# SentinelRisk Waitlist Setup Guide

## Overview

The SentinelRisk waitlist uses the same `/api/waitlist` endpoint as NutriNest, but with a `product` field to differentiate submissions.

## Google Form Setup

### Form ID
```
1553faQKqrXpolIa0bW6-b8_cjm5q6qKu84afU2s_fOk
```

### Getting Entry IDs

You need to inspect the form to get the entry IDs for each field:

1. Open the form: https://docs.google.com/forms/d/1553faQKqrXpolIa0bW6-b8_cjm5q6qKu84afU2s_fOk/viewform

2. Open DevTools (F12) → Network tab

3. Fill out the form with test data and click Submit

4. Look for a request to `formResponse`

5. In the Form Data section, you'll see entries like:
   ```
   entry.123456789: email@example.com
   entry.987654321: sentinelrisk
   ```

6. Copy these entry IDs

### Required Form Fields

Your Google Form should have these fields:

1. **Email** (Short answer, required)
   - Entry ID: `entry.XXXXXXXXX`

2. **Product** (Short answer or dropdown)
   - Entry ID: `entry.XXXXXXXXX`
   - This will receive the value "sentinelrisk"

## Environment Variables

### Option 1: Shared Form (Recommended)

If you want to use the same Google Form for both NutriNest and SentinelRisk:

```env
# Shared Google Form for all products
GOOGLE_FORM_ID=1553faQKqrXpolIa0bW6-b8_cjm5q6qKu84afU2s_fOk
GOOGLE_FORM_EMAIL_ENTRY=your_email_entry_id
GOOGLE_FORM_PRODUCT_ENTRY=your_product_entry_id

# Legacy fields (keep for NutriNest compatibility)
GOOGLE_FORM_AGE_ENTRY=your_age_entry_id
GOOGLE_FORM_LOCATION_ENTRY=your_location_entry_id
```

### Option 2: Separate Forms

If you want separate forms for each product:

```env
# NutriNest Form
GOOGLE_FORM_ID=your_nutrinest_form_id
GOOGLE_FORM_EMAIL_ENTRY=your_email_entry_id
GOOGLE_FORM_AGE_ENTRY=your_age_entry_id
GOOGLE_FORM_LOCATION_ENTRY=your_location_entry_id

# SentinelRisk Form
SENTINELRISK_FORM_ID=1553faQKqrXpolIa0bW6-b8_cjm5q6qKu84afU2s_fOk
SENTINELRISK_EMAIL_ENTRY=your_email_entry_id
SENTINELRISK_PRODUCT_ENTRY=your_product_entry_id
```

## API Route Behavior

The `/api/waitlist` route automatically handles the `product` field:

### NutriNest Submission
```json
{
  "email": "user@example.com",
  "childAgeMonths": 12,
  "location": "UAE",
  "product": "nutrinest"
}
```

### SentinelRisk Submission
```json
{
  "email": "user@example.com",
  "product": "sentinelrisk"
}
```

## Vercel Environment Variables

Set these in your Vercel project settings:

1. Go to: https://vercel.com/your-team/zee-build/settings/environment-variables

2. Add the following variables:
   - `GOOGLE_FORM_ID`
   - `GOOGLE_FORM_EMAIL_ENTRY`
   - `GOOGLE_FORM_PRODUCT_ENTRY` (if using shared form)
   - `GOOGLE_FORM_AGE_ENTRY` (for NutriNest)
   - `GOOGLE_FORM_LOCATION_ENTRY` (for NutriNest)

3. Set for: Production, Preview, Development

4. Redeploy after adding variables

## Testing

### Local Testing

1. Set environment variables in `.env.local`:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Navigate to: http://localhost:3000/builds/sentinelrisk

4. Scroll to waitlist section and submit test email

5. Check your Google Form responses to verify submission

### Production Testing

1. Deploy to Vercel

2. Navigate to: https://zee-build.vercel.app/builds/sentinelrisk

3. Submit test email

4. Check Vercel Function logs:
   - Go to: https://vercel.com/your-team/zee-build/logs
   - Filter by: `/api/waitlist`
   - Look for: `[Waitlist API]` log entries

5. Verify submission in Google Sheets (if linked)

## Troubleshooting

### Form Not Submitting

1. Check browser console for errors
2. Verify environment variables are set in Vercel
3. Check Vercel Function logs for API errors
4. Ensure form ID and entry IDs are correct

### Wrong Product Value

The SentinelRisk form automatically sends `product: "sentinelrisk"`. If you see a different value:

1. Check `app/(marketing)/builds/sentinelrisk/components/waitlist-form.tsx`
2. Verify the hidden field: `product: 'sentinelrisk'`

### Rate Limiting

The API has built-in rate limiting:
- Max 5 submissions per IP per 10 minutes
- If exceeded, user sees: "Too many submissions. Please try again later."

## Google Sheets Integration

To automatically collect submissions in a spreadsheet:

1. Open your Google Form
2. Click "Responses" tab
3. Click the Google Sheets icon
4. Create a new spreadsheet or link to existing one
5. All submissions will automatically appear in the sheet

## Security Features

The waitlist API includes:

1. **Honeypot Field** - Catches bots
2. **Rate Limiting** - Prevents spam (5 per IP per 10 min)
3. **Time Validation** - Detects too-fast submissions (min 1.5s)
4. **Email Validation** - Ensures valid email format
5. **Server-Side Only** - No client-side form submission to Google

## Next Steps

1. Get entry IDs from your Google Form
2. Update environment variables in Vercel
3. Test locally with `.env.local`
4. Deploy and test in production
5. Link Google Form to Google Sheets for easy tracking

## Support

If you encounter issues:

1. Check Vercel Function logs
2. Verify environment variables are set
3. Test with browser DevTools Network tab
4. Review `app/api/waitlist/route.ts` for debugging logs
