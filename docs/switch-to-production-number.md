# Switch to Production WhatsApp Number

Complete guide to migrate from Meta test number to your real business number in Flairtek WACRM.

---

## Overview

Meta provides test numbers for development, but production use requires:
1. **Business verification** by Meta (1-3 business days)
2. **Phone number registration** via the Cloud API
3. **Configuration update** in Flairtek WACRM
4. **Webhook subscription** update

---

## Step 1: Verify Your Business with Meta

Before using a production number, your business must be verified.

### Process:
1. Go to [Meta Business Settings → Security Center](https://business.facebook.com/settings/security)
2. Navigate to **Business verification**
3. Submit required documents:
   - Business registration certificate
   - Tax ID or business license
   - Proof of address (utility bill, bank statement)
4. Wait for Meta's approval email (1-3 business days)

⚠️ **Important:** Start this process first — it's the longest step.

---

## Step 2: Add Your Production Phone Number

Once verified, add your real WhatsApp number.

### Method A: New Number from Meta
1. Go to [WhatsApp Manager → Phone Numbers](https://business.facebook.com/wa/manage/phone-numbers/)
2. Click **Add phone number** → **Get a new number**
3. Select country and choose from available numbers
4. Complete setup

### Method B: Migrate Existing Number
1. Go to [WhatsApp Manager → Phone Numbers](https://business.facebook.com/wa/manage/phone-numbers/)
2. Click **Add phone number** → **Use existing number**
3. Enter your phone number (with country code, e.g., `+14155552345`)
4. Choose verification method: **SMS** or **Voice call**
5. Enter the 6-digit code you receive

🚨 **Critical:** Migrating an existing WhatsApp number will:
- Permanently move it from the WhatsApp mobile app to the Business API
- Your old chat history will NOT be accessible
- You cannot use this number on the mobile app anymore

---

## Step 3: Get Phone Number ID & WABA ID

After adding your production number:

1. In [WhatsApp Manager](https://business.facebook.com/wa/manage/phone-numbers/), click your new number
2. Copy the **Phone number ID** (e.g., `123456789012345`)
3. Copy the **WhatsApp Business Account ID (WABA ID)** from the top of the page

💡 Keep these IDs handy for the next step.

---

## Step 4: Generate Permanent Access Token

Create a System User with a permanent token:

1. Go to [Business Settings → System Users](https://business.facebook.com/settings/system-users)
2. Click **Add** → Create an **Admin** system user (e.g., `Flairtek CRM Bot`)
3. Click **Add Assets** → Select **WhatsApp Accounts** → Choose your WABA
4. Enable **Full Control** and click **Save**
5. Click **Generate New Token**:
   - **App:** Select your Meta app
   - **Token expiration:** **Never**
   - **Permissions:**
     - ✅ `whatsapp_business_management`
     - ✅ `whatsapp_business_messaging`
6. Copy the token (store it securely — it won't be shown again)

---

## Step 5: Update Configuration in Flairtek WACRM

Now configure your production number in your deployed app:

1. Open your deployed app: `https://your-vercel-url.vercel.app`
2. Navigate to **Settings → WhatsApp Configuration**
3. Update these fields:
   - **Phone Number ID:** Paste from Step 3
   - **WABA ID:** Paste from Step 3
   - **Access Token:** Paste from Step 4
4. Click **Save Configuration**
5. You should see: **"✓ Configuration saved and verified successfully"**

---

## Step 6: Update Meta Webhook Subscription

Subscribe the new phone number to your webhook:

1. Go to [Meta App Dashboard](https://developers.facebook.com/) → your app
2. Navigate to **WhatsApp → Configuration**
3. Scroll to **Webhook** section
4. Under **Webhook fields**, click **Manage**
5. Ensure `messages` is subscribed for your new phone number

💡 Your webhook URL should be: `https://your-vercel-url.vercel.app/api/whatsapp/webhook`

---

## Step 7: Test Your Production Number

Send a test message to verify everything works:

1. From your personal phone, send a WhatsApp message to your business number
2. Check Flairtek WACRM **Inbox** — the message should appear within seconds
3. Reply from the CRM — your personal phone should receive it
4. Check the **Dashboard** to verify metrics are tracking

✅ **Success indicators:**
- Incoming messages appear in real-time
- Replies send successfully
- Contact is auto-created in Contacts module
- Dashboard shows activity

---

## Step 8: Configure Business Profile

Set up your business profile for customers:

1. In [WhatsApp Manager](https://business.facebook.com/wa/manage/phone-numbers/), select your number
2. Click **WhatsApp Business Profile**
3. Set:
   - **Display name:** Your business name (e.g., "Flairtek Support")
   - **About:** Brief description
   - **Profile photo:** Your business logo (square, min 192×192px)
   - **Category:** Your business type
   - **Website:** Your business URL
   - **Address:** Physical location (optional)
4. Click **Save**

⚠️ **Display name approval:** Business display names require Meta approval (1-2 days).

---

## Step 9: Remove Test Number (Optional)

Once production is working, you can remove the test number:

1. In [WhatsApp Manager](https://business.facebook.com/wa/manage/phone-numbers/), find your test number
2. Click the three dots **⋯** → **Delete number**
3. Confirm deletion

💡 **Or keep it:** Some businesses keep the test number for development and testing new features.

---

## Troubleshooting

### "Phone number not verified"
- Wait 24-48 hours for Meta to process verification
- Check Business verification status in Meta Business Settings

### "This number can't be registered"
- Number is already registered under a different WABA
- Number is banned or flagged by Meta
- Try a different number

### Messages not arriving in CRM
- Check webhook subscription includes new Phone Number ID
- Verify webhook URL is correct in Meta App Dashboard
- Check Vercel logs for webhook errors: `vercel logs --prod`

### "Access token expired"
- Regenerate permanent System User token (Step 4)
- Ensure it has both required permissions
- Update in Flairtek WACRM Settings

### "Please register this phone number using the registration API"
This error means the number needs to be registered via the Cloud API. Two solutions:

**Option A: Register via Meta Business Manager (Recommended)**
1. Go to [WhatsApp Manager](https://business.facebook.com/wa/manage/phone-numbers/)
2. Click your phone number
3. Look for **Register** or **Complete Setup** button
4. Follow the on-screen prompts

**Option B: Register via API**
Contact Meta support or your WhatsApp Business Solution Provider to complete phone number registration.

---

## Post-Migration Checklist

- ✅ Business verified by Meta
- ✅ Production number added and verified
- ✅ Phone Number ID & WABA ID updated in Flairtek WACRM
- ✅ Permanent access token configured
- ✅ Webhook subscribed to new number
- ✅ Test messages sent and received successfully
- ✅ Business profile configured
- ✅ Display name submitted for approval
- ✅ Team members notified of new number
- ✅ Old test number removed (optional)

---

## Additional Resources

- [Meta WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Business Verification Guide](https://www.facebook.com/business/help/2058515294227817)
- [WhatsApp Business Profile Setup](https://www.facebook.com/business/help/757569725593362)
- [System Users & Tokens](https://www.facebook.com/business/help/326334014025510)

---

## Need Help?

If you encounter issues not covered here:
1. Check Vercel deployment logs
2. Review Meta App Dashboard error logs
3. Contact Meta Business Support via [Business Help Center](https://www.facebook.com/business/help/)
