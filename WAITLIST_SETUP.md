# Waitlist Setup Guide

This guide walks you through setting up the Google Forms integration for the NutriNest waitlist.

## Overview

The waitlist system stores submissions in Google Sheets (free) without redirecting users. The flow is:

```
User fills form → POST /api/waitlist → Server forwards to Google Form → Data appears in Google Sheet
```

## Step 1: Create Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "Blank" to create a new form
3. Title it "NutriNest Waitlist"

## Step 2: Add Form Fields

Add these three fields to your form:

### Field 1: Email
- Type: **Short answer**
- Question: "Email"
- Toggle "Required" ON
- Click the three dots → "Response validation"
  - Select "Text" → "Email"

### Field 2: Child Age in Months
- Type: **Dropdown**
- Question: "Child Age in Months"
- Options: Add numbers 6 through 36 (one per line)
- Leave "Required" OFF (optional field)

### Field 3: Location
- Type: **Multiple choice**
- Question: "Location"
- Options:
  - UAE
  - Other
- Leave "Required" OFF (optional field)

## Step 3: Link to Google Sheet

1. In your form, click the "Responses" tab
2. Click the Google Sheets icon (green spreadsheet)
3. Select "Create a new spreadsheet"
4. Name it "NutriNest Waitlist Responses"
5. Click "Create"

Your form is now linked! All submissions will automatically appear in this sheet.

## Step 4: Get Form ID and Entry IDs

### Get Form ID

1. Click "Send" button in your form
2. Copy the form link
3. The URL looks like: `https://docs.google.com/forms/d/e/{FORM_ID}/viewform`
4. Copy the `FORM_ID` part (long string of characters)

### Get Entry IDs

1. Open your form in a new browser tab
2. Open DevTools (F12 or Right-click → Inspect)
3. Go to the **Network** tab
4. Fill out the form with test data:
   - Email: test@example.com
   - Child Age: 12
   - Location: UAE
5. Click Submit
6. In the Network tab, find the request to `formResponse`
7. Click on it and look at the **Form Data** section
8. You'll see entries like:
   ```
   entry.123456789: test@example.com
   entry.987654321: 12
   entry.456789123: UAE
   ```
9. Copy these entry numbers (the numbers after `entry.`)

## Step 5: Set Environment Variables

### Local Development

Create a `.env.local` file in your project root:

```bash
GOOGLE_FORM_ID=your_form_id_from_step_4
GOOGLE_FORM_EMAIL_ENTRY=123456789
GOOGLE_FORM_AGE_ENTRY=987654321
GOOGLE_FORM_LOCATION_ENTRY=456789123
```

Replace the values with your actual IDs from Step 4.

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - `GOOGLE_FORM_ID`
   - `GOOGLE_FORM_EMAIL_ENTRY`
   - `GOOGLE_FORM_AGE_ENTRY`
   - `GOOGLE_FORM_LOCATION_ENTRY`
4. Set them for "Production", "Preview", and "Development"
5. Click "Save"
6. Redeploy your site for changes to take effect

## Step 6: Test the Integration

### Local Testing

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/builds/nutrinest`
3. Scroll to the waitlist form
4. Fill it out and submit
5. Check your Google Sheet - the submission should appear!

### Production Testing

1. Deploy to Vercel
2. Visit your production URL
3. Submit the form
4. Verify the data appears in your Google Sheet

## Troubleshooting

### "Server configuration error"
- Check that all environment variables are set correctly
- Verify the variable names match exactly (case-sensitive)
- Redeploy after adding variables to Vercel

### Submissions not appearing in Google Sheet
- Verify the form is linked to a Google Sheet (Step 3)
- Check that entry IDs are correct (Step 4)
- Try submitting directly to the Google Form to ensure it works
- Check the Network tab for the actual entry IDs being used

### "Too many submissions" error
- This is the rate limiter working (5 per IP per 10 minutes)
- Wait 10 minutes or test from a different IP/network

### "Please take your time" error
- This is the anti-bot time check (minimum 1.5 seconds)
- Wait a moment before submitting

## Security Features

The waitlist includes several anti-spam measures:

1. **Honeypot field**: Hidden "company" field catches bots
2. **Time-to-submit check**: Rejects submissions that are too fast (<1.5s) or too slow (>1 hour)
3. **Rate limiting**: Max 5 submissions per IP per 10 minutes
4. **Server-side forwarding**: Google Form endpoint never exposed to client

## Analytics Events

The form logs these events to console (replace with your analytics service):

- `click_waitlist_cta` - User clicks submit
- `submit_waitlist_success` - Successful submission
- `submit_waitlist_error` - Failed submission

## Viewing Responses

### In Google Sheets
1. Open your linked Google Sheet
2. All responses appear in real-time
3. Columns: Timestamp, Email, Child Age, Location

### Export Data
1. In Google Sheets, click File → Download
2. Choose format (CSV, Excel, etc.)

## Next Steps

- Set up email notifications when someone joins (optional)
- Add more fields to the form if needed
- Connect to your email marketing tool (Mailchimp, ConvertKit, etc.)
- Set up automated welcome emails

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the Vercel logs for server errors
3. Verify all environment variables are set correctly
4. Test the Google Form directly to ensure it works
