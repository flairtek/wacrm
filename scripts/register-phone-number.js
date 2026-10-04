/**
 * WhatsApp Cloud API Phone Number Registration Script
 *
 * This script registers a phone number with Meta's WhatsApp Cloud API.
 * Required before the number can send/receive messages.
 *
 * Usage:
 *   node scripts/register-phone-number.js
 *
 * Environment variables required:
 *   - PHONE_NUMBER_ID: Your WhatsApp Phone Number ID
 *   - WHATSAPP_ACCESS_TOKEN: Your permanent Meta access token
 */

/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv/config');

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN must be set');
  console.error('\nAdd them to your .env.local file or pass them directly:');
  console.error('   PHONE_NUMBER_ID=123456789 WHATSAPP_ACCESS_TOKEN=xxx node scripts/register-phone-number.js');
  process.exit(1);
}

async function registerPhoneNumber() {
  console.log('📞 Registering phone number with WhatsApp Cloud API...\n');
  console.log(`   Phone Number ID: ${PHONE_NUMBER_ID}`);
  console.log(`   Access Token: ${ACCESS_TOKEN.substring(0, 20)}...`);
  console.log('');

  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/register`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        // pin: '123456', // Optional: 6-digit PIN for two-step verification
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Registration failed\n');
      console.error('Status:', response.status);
      console.error('Response:', JSON.stringify(data, null, 2));

      if (data.error) {
        console.error('\nError details:');
        console.error(`  Code: ${data.error.code}`);
        console.error(`  Message: ${data.error.message}`);
        console.error(`  Type: ${data.error.type}`);

        if (data.error.error_user_title) {
          console.error(`  Title: ${data.error.error_user_title}`);
        }

        if (data.error.error_user_msg) {
          console.error(`  User Message: ${data.error.error_user_msg}`);
        }

        // Common error messages
        if (data.error.code === 33) {
          console.error('\n💡 This usually means:');
          console.error('   - The phone number is already registered');
          console.error('   - Or registration was already completed');
        } else if (data.error.code === 131031) {
          console.error('\n💡 This usually means:');
          console.error('   - The phone number needs verification first');
          console.error('   - Go to WhatsApp Manager to verify the number');
        }
      }

      process.exit(1);
    }

    console.log('✅ Phone number registered successfully!\n');
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('\n🎉 Your phone number is now ready to send and receive messages.');
    console.log('\nNext steps:');
    console.log('  1. Update Flairtek WACRM Settings with this Phone Number ID');
    console.log('  2. Configure the webhook subscription in Meta App Dashboard');
    console.log('  3. Send a test message to verify everything works');

  } catch (error) {
    console.error('❌ Registration request failed\n');
    console.error('Error:', error.message);

    if (error.cause) {
      console.error('Cause:', error.cause);
    }

    process.exit(1);
  }
}

// Run the registration
registerPhoneNumber();
