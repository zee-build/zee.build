# Waitlist Implementation

## Quick Start

The NutriNest waitlist is live at `/builds/nutrinest`. It stores submissions in Google Sheets for free.

### Setup (5 minutes)

1. **Create Google Form** with 3 fields: Email, Child Age (6-36), Location (UAE/Other)
2. **Link to Google Sheet** (Responses tab → Create spreadsheet)
3. **Get IDs** (see [WAITLIST_SETUP.md](./WAITLIST_SETUP.md) for detailed steps)
4. **Set environment variables**:
   ```bash
   GOOGLE_FORM_ID=your_form_id
   GOOGLE_FORM_EMAIL_ENTRY=123456789
   GOOGLE_FORM_AGE_ENTRY=987654321
   GOOGLE_FORM_LOCATION_ENTRY=456789123
   ```
5. **Test locally**: `npm run dev` → visit `/builds/nutrinest`

## Features

✅ **Inline submission** - No redirect, stays on page  
✅ **Success animation** - Confetti + success message  
✅ **Anti-spam protection** - Honeypot, rate limiting, time checks  
✅ **Free storage** - Google Sheets (no database needed)  
✅ **Mobile responsive** - Works on all devices  
✅ **Validation** - Email format, required fields  
✅ **Analytics ready** - Console logs for tracking events  

## Files Created

```
app/api/waitlist/route.ts          # API endpoint with anti-spam
components/waitlist-form.tsx        # Reusable form component
app/(marketing)/builds/nutrinest/   # Updated with form
WAITLIST_SETUP.md                   # Detailed setup guide
.env.local.template                 # Environment template
```

## Usage

### On NutriNest Page
The form is already integrated at the bottom of `/builds/nutrinest`.

### Use Elsewhere (Compact Mode)
```tsx
import { WaitlistForm } from "@/components/waitlist-form"

<WaitlistForm 
  compact 
  className="max-w-md"
/>
```

### Full Form Mode
```tsx
<WaitlistForm 
  title="Join the Waitlist"
  description="Be the first to know when we launch."
/>
```

## Anti-Spam Features

1. **Honeypot field** - Hidden "company" field catches bots
2. **Time validation** - Rejects too fast (<1.5s) or too slow (>1hr) submissions
3. **Rate limiting** - Max 5 submissions per IP per 10 minutes
4. **Server-side only** - Google Form endpoint never exposed to client

## Analytics Events

Track these events in your analytics:
- `click_waitlist_cta` - User clicks submit
- `submit_waitlist_success` - Successful submission  
- `submit_waitlist_error` - Failed submission

Currently logs to console. Replace with your analytics service (GA4, Mixpanel, etc.)

## Testing

### Local
```bash
npm run dev
# Visit http://localhost:3000/builds/nutrinest
# Fill form and submit
# Check your Google Sheet for the entry
```

### Production
1. Set environment variables in Vercel
2. Deploy
3. Test on production URL
4. Verify data in Google Sheet

## Troubleshooting

**"Server configuration error"**
- Environment variables not set or incorrect
- Check Vercel dashboard → Settings → Environment Variables

**Submissions not appearing**
- Verify Google Form is linked to a Sheet
- Check entry IDs are correct (see WAITLIST_SETUP.md)
- Test submitting directly to Google Form

**Rate limit errors**
- Expected behavior (5 per IP per 10 min)
- Wait or test from different network

## Next Steps

- [ ] Set up Google Form (see WAITLIST_SETUP.md)
- [ ] Add environment variables locally
- [ ] Test submission locally
- [ ] Deploy to Vercel
- [ ] Add environment variables to Vercel
- [ ] Test on production
- [ ] Connect to email marketing tool (optional)
- [ ] Set up welcome email automation (optional)

## Support

See [WAITLIST_SETUP.md](./WAITLIST_SETUP.md) for detailed setup instructions.
