import 'dotenv/config';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const META_API_VERSION = 'v21.0';

function decryptToken(encryptedText, keyHex) {
  if (!encryptedText || !keyHex) return null;
  try {
    const parts = encryptedText.split(':');
    if (parts.length === 3) {
      const [ivHex, ciphertextHex, authTagHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(keyHex, 'hex'), iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } else if (parts.length === 2) {
      const [ivHex, ciphertextHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(keyHex, 'hex'), iv);
      let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
  } catch {
    return null;
  }
  return null;
}

async function runTest() {
  console.log('====================================================');
  console.log('   Flairtek WACRM — Live WhatsApp Meta API Test     ');
  console.log('====================================================\n');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in environment.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Fetch whatsapp_config from Supabase
  console.log('1. Checking database for configured WhatsApp accounts...');
  const { data: configs, error: configError } = await supabase
    .from('whatsapp_config')
    .select('id, account_id, phone_number_id, waba_id, access_token, status, connected_at, created_at');

  if (configError) {
    console.error('❌ Failed to fetch whatsapp_config from DB:', configError.message);
    process.exit(1);
  }

  if (!configs || configs.length === 0) {
    console.warn('⚠️ No WhatsApp accounts configured in the database yet.');
    console.log('   Please connect your WhatsApp number via the UI (Settings -> WhatsApp Connection)');
    console.log('   or add a configuration to whatsapp_config table.');
    return;
  }

  console.log(`✅ Found ${configs.length} configured WhatsApp connection(s):\n`);

  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i];
    console.log(`--- Account Config #${i + 1} ---`);
    console.log(`  Account ID:        ${cfg.account_id}`);
    console.log(`  Phone Number ID:   ${cfg.phone_number_id}`);
    console.log(`  WABA ID:           ${cfg.waba_id || '(not set)'}`);
    console.log(`  Status:            ${cfg.status}`);
    console.log(`  Connected At:      ${cfg.connected_at || 'Never'}`);

    const token = decryptToken(cfg.access_token, ENCRYPTION_KEY);
    if (!token) {
      console.error('  ❌ Failed to decrypt access token. Check ENCRYPTION_KEY in .env.local.');
      continue;
    }
    console.log(`  Access Token:      ${token.substring(0, 15)}... (Decrypted successfully)`);

    // 2. Query Meta Graph API for Phone Number Details
    console.log('\n  Querying Meta Graph API for Phone Number status...');
    try {
      const metaRes = await fetch(
        `https://graph.facebook.com/${META_API_VERSION}/${cfg.phone_number_id}?fields=display_phone_number,verified_name,quality_rating,code_verification_status,status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const metaData = await metaRes.json();

      if (!metaRes.ok) {
        console.error('  ❌ Meta API Error:');
        console.error(`     HTTP Status: ${metaRes.status}`);
        console.error(`     Message:     ${metaData.error?.message || JSON.stringify(metaData)}`);
        console.error(`     Code:        ${metaData.error?.code}`);
        console.error(`     Subcode:     ${metaData.error?.error_subcode || 'none'}`);
        console.error(`     Trace ID:    ${metaData.error?.fbtrace_id || 'none'}`);
      } else {
        console.log('  ✅ Meta API Connection Successful!');
        console.log(`     Display Phone Number: ${metaData.display_phone_number}`);
        console.log(`     Verified Name:        ${metaData.verified_name || '(unverified)'}`);
        console.log(`     Quality Rating:       ${metaData.quality_rating || 'UNKNOWN'}`);
        console.log(`     Status:               ${metaData.status || 'AVAILABLE'}`);
        console.log(`     Code Verification:    ${metaData.code_verification_status || 'NOT_VERIFIED'}`);
      }

      // Check args for test message sending
      const recipientArg = process.argv.find((arg) => arg.startsWith('--to='));
      const textArg = process.argv.find(
        (arg) => arg.startsWith('--msg=') || arg.startsWith('--text=') || arg.startsWith('--message=')
      );
      const customText = textArg ? textArg.substring(textArg.indexOf('=') + 1).trim() : null;

      if (recipientArg) {
        const recipient = recipientArg.split('=')[1].trim().replace(/^\+/, '');
        console.log(`\n  Target recipient: +${recipient}`);

        let sendData = null;
        let sentType = 'template';
        let messageText = customText || 'hello_world';

        if (customText) {
          console.log(`  Sending custom text message: "${customText}"...`);
          const textRes = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/${cfg.phone_number_id}/messages`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: recipient,
                type: 'text',
                text: { body: customText },
              }),
            }
          );
          sendData = await textRes.json();
          if (textRes.ok) {
            sentType = 'text';
            console.log('  🎉 Text Message Sent Successfully via Meta Cloud API!');
            console.log(`     Meta Message ID: ${sendData.messages?.[0]?.id}`);
          } else {
            console.warn('  ⚠️ Direct text message rejected by Meta API:');
            console.warn(`     Code: ${sendData.error?.code}, Message: ${sendData.error?.message}`);
            if (sendData.error?.code === 131047) {
              console.warn('     💡 Note: 24-hour customer window is closed. Business must initiate conversation with an approved template.');
            }
          }
        } else {
          console.log(`  Sending template message ("hello_world")...`);
          const sendRes = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/${cfg.phone_number_id}/messages`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: recipient,
                type: 'template',
                template: {
                  name: 'hello_world',
                  language: { code: 'en_US' },
                },
              }),
            }
          );
          sendData = await sendRes.json();
          if (sendRes.ok) {
            sentType = 'template';
            console.log('  🎉 Template Message Sent Successfully via Meta Cloud API!');
            console.log(`     Meta Message ID: ${sendData.messages?.[0]?.id}`);
          } else {
            console.error('  ❌ Template send failed:');
            console.error(`     Code: ${sendData.error?.code}, Message: ${sendData.error?.message}`);
          }
        }

        // Record in Supabase database if send succeeded
        if (sendData && sendData.messages?.[0]?.id) {
          const wamid = sendData.messages[0].id;
          console.log('\n  Syncing sent message to Supabase database...');
          try {
            // Find or create contact
            let { data: contact } = await supabase
              .from('contacts')
              .select('id, phone, name')
              .eq('account_id', cfg.account_id)
              .or(`phone.eq.+${recipient},phone.eq.${recipient}`)
              .limit(1)
              .maybeSingle();

            if (!contact) {
              const { data: newContact, error: createContactErr } = await supabase
                .from('contacts')
                .insert({
                  account_id: cfg.account_id,
                  phone: `+${recipient}`,
                  name: `Contact +${recipient}`,
                })
                .select('id, phone, name')
                .single();
              if (!createContactErr) contact = newContact;
            }

            if (contact) {
              // Find or create conversation
              let { data: conv } = await supabase
                .from('conversations')
                .select('id')
                .eq('account_id', cfg.account_id)
                .eq('contact_id', contact.id)
                .limit(1)
                .maybeSingle();

              if (!conv) {
                const { data: newConv, error: createConvErr } = await supabase
                  .from('conversations')
                  .insert({
                    account_id: cfg.account_id,
                    contact_id: contact.id,
                    status: 'open',
                    last_message_text: customText || 'Template: hello_world',
                    last_message_at: new Date().toISOString(),
                  })
                  .select('id')
                  .single();
                if (!createConvErr) conv = newConv;
              } else {
                await supabase
                  .from('conversations')
                  .update({
                    last_message_text: customText || 'Template: hello_world',
                    last_message_at: new Date().toISOString(),
                  })
                  .eq('id', conv.id);
              }

              if (conv) {
                const { error: insertMsgErr } = await supabase
                  .from('messages')
                  .insert({
                    conversation_id: conv.id,
                    sender_type: 'agent',
                    content_type: sentType,
                    content_text: customText || (sentType === 'template' ? 'hello_world' : ''),
                    template_name: sentType === 'template' ? 'hello_world' : null,
                    status: 'sent',
                    message_id: wamid,
                  });

                if (!insertMsgErr) {
                  console.log(`  ✅ Synced message to conversation ${conv.id}`);
                } else {
                  console.warn(`  ⚠️ Could not record message in DB: ${insertMsgErr.message}`);
                }
              }
            }
          } catch (dbSyncErr) {
            console.warn(`  ⚠️ DB sync error: ${dbSyncErr.message}`);
          }
        }
      } else {
        console.log('\n  💡 Tip: To send a test message to a phone number, run:');
        console.log(`     node scripts/test-live-whatsapp.mjs --to=+1234567890 --msg="Your message"`);
      }
    } catch (err) {
      console.error('  ❌ Error connecting to Meta API:', err.message);
    }
  }

  // 3. Check Recent Message Activity in Database
  console.log('\n2. Checking recent messages in database...');
  const { data: recentMessages, error: msgError } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_type, content_type, content_text, status, message_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (msgError) {
    console.error('  ❌ Error querying messages:', msgError.message);
  } else if (!recentMessages || recentMessages.length === 0) {
    console.log('  ℹ️ No messages found in the database yet.');
  } else {
    console.log(`  ✅ Found ${recentMessages.length} recent message(s):`);
    for (const msg of recentMessages) {
      const dirIcon = msg.sender_type === 'customer' ? '📥 INBOUND (customer)' : `📤 OUTBOUND (${msg.sender_type})`;
      const preview = (msg.content_text || msg.content_type || '').substring(0, 50).replace(/\n/g, ' ');
      console.log(`     [${msg.created_at}] ${dirIcon} | Status: ${msg.status} | "${preview}"`);
    }
  }

  console.log('\n====================================================');
  console.log('                    Test Complete                   ');
  console.log('====================================================');
}

runTest();
