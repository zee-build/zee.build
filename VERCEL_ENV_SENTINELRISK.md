# SentinelRisk Vercel Environment Variables

## Form Details

**Google Form URL:**
```
https://docs.google.com/forms/d/e/1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ/viewform
```

**Form ID (extracted):**
```
1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ
```

**Email Entry ID (extracted):**
```
1566413015
```

---

## Environment Variables to Set in Vercel

### Option 1: Using Separate Form for SentinelRisk (Recommended)

Add these NEW variables to Vercel (keep existing NutriNest variables):

```env
# SentinelRisk Google Form
SENTINELRISK_FORM_ID=1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ
SENTINELRISK_EMAIL_ENTRY=1566413015
```

### Option 2: Replace Existing Form (Use Same Form for Both)

If you want to use this form for BOTH NutriNest and SentinelRisk, update these:

```env
# Shared Google Form (replaces existing)
GOOGLE_FORM_ID=1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ
GOOGLE_FORM_EMAIL_ENTRY=1566413015

# Remove or keep as fallback (optional)
GOOGLE_FORM_AGE_ENTRY=2130672761
GOOGLE_FORM_LOCATION_ENTRY=352004114
```

---

## Step-by-Step: Setting Variables in Vercel

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/zee-builds-projects/zee-build/settings/environment-variables
   ```

2. **Add SENTINELRISK_FORM_ID:**
   - Click "Add New"
   - Key: `SENTINELRISK_FORM_ID`
   - Value: `1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ`
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

3. **Add SENTINELRISK_EMAIL_ENTRY:**
   - Click "Add New"
   - Key: `SENTINELRISK_EMAIL_ENTRY`
   - Value: `1566413015`
   - Environment: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

4. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - OR push a new commit to trigger deployment

---

## Current Environment Variables Summary

### NutriNest (Existing - Keep These)
```env
GOOGLE_FORM_ID=1FAIpQLScUjv6OEUXEHW7ADAxSRtqmEpPJ46wvCP-gJ7mxEKsmV8aM5Q
GOOGLE_FORM_EMAIL_ENTRY=1974560826
GOOGLE_FORM_AGE_ENTRY=2130672761
GOOGLE_FORM_LOCATION_ENTRY=352004114
```

### SentinelRisk (New - Add These)
```env
SENTINELRISK_FORM_ID=1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ
SENTINELRISK_EMAIL_ENTRY=1566413015
```

---

## Testing After Deployment

### 1. Test Locally First

Create/update `.env.local`:
```env
# NutriNest
GOOGLE_FORM_ID=1FAIpQLScUjv6OEUXEHW7ADAxSRtqmEpPJ46wvCP-gJ7mxEKsmV8aM5Q
GOOGLE_FORM_EMAIL_ENTRY=1974560826
GOOGLE_FORM_AGE_ENTRY=2130672761
GOOGLE_FORM_LOCATION_ENTRY=352004114

# SentinelRisk
SENTINELRISK_FORM_ID=1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ
SENTINELRISK_EMAIL_ENTRY=1566413015
```

Run:
```bash
npm run dev
```

Navigate to:
```
http://localhost:3000/builds/sentinelrisk
```

Submit test email and check Google Form responses.

### 2. Test in Production

After deploying to Vercel:

1. Navigate to: `https://zee-build.vercel.app/builds/sentinelrisk`
2. Scroll to waitlist section
3. Submit test email: `test@example.com`
4. Check Google Form responses
5. Check Vercel Function logs:
   ```
   https://vercel.com/zee-builds-projects/zee-build/logs
   ```
   Filter by: `/api/waitlist`

---

## Troubleshooting

### Form Not Submitting

**Check Vercel Logs:**
```
https://vercel.com/zee-builds-projects/zee-build/logs
```

Look for:
```
[Waitlist API] Environment variables check
[Waitlist API] Submitting to Google Forms
[Waitlist API] Google Forms response
```

**Common Issues:**

1. **Missing Environment Variables**
   - Error: "Missing GOOGLE_FORM_* environment variables"
   - Solution: Verify variables are set in Vercel and redeploy

2. **Wrong Entry IDs**
   - Error: Form submits but no data appears
   - Solution: Double-check entry IDs match your form fields

3. **Rate Limiting**
   - Error: "Too many submissions"
   - Solution: Wait 10 minutes or test from different IP

### Verify Environment Variables

In Vercel Function logs, you should see:
```
[Waitlist API] Environment variables check: {
  hasFormId: true,
  hasEmailEntry: true,
  hasAgeEntry: true,
  hasLocationEntry: true
}
```

---

## Google Sheets Integration

To track submissions in a spreadsheet:

1. Open your Google Form:
   ```
   https://docs.google.com/forms/d/1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ/edit
   ```

2. Click "Responses" tab

3. Click the Google Sheets icon (green spreadsheet icon)

4. Create new spreadsheet or link existing

5. All submissions will automatically appear in the sheet

---

## Next Steps

1. ✅ Set environment variables in Vercel (see above)
2. ✅ Redeploy the application
3. ✅ Test locally with `.env.local`
4. ✅ Test in production
5. ✅ Link Google Form to Google Sheets
6. ✅ Monitor submissions

---

## Quick Copy-Paste for Vercel

**Variable 1:**
```
Key: SENTINELRISK_FORM_ID
Value: 1FAIpQLSetWeujfhsg9c035wgaqwlfOspS3jRmgVj3BsxRcF23ykMyLQ
```

**Variable 2:**
```
Key: SENTINELRISK_EMAIL_ENTRY
Value: 1566413015
```

Select all environments (Production, Preview, Development) for both.
