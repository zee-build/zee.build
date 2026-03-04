# NutriNest Build - Implementation Guide

## Overview
Complete implementation of the NutriNest build detail page with waitlist functionality, theme switching, and premium animations.

## File Structure
```
app/builds/nutrinest/
├── page.tsx                          # Main page with all sections
├── layout.tsx                        # Layout with SEO metadata
├── log/
│   └── page.tsx                      # Build log timeline page
└── components/
    ├── hero.tsx                      # Hero section with CTAs
    ├── screens-gallery.tsx           # Image gallery with zoom modal
    ├── how-it-works.tsx              # 3-step process section
    ├── pricing.tsx                   # Pricing card with features
    ├── waitlist-form.tsx             # Email collection form
    └── theme-switcher.tsx            # Theme toggle (Light/Dark/Warm/Kids)

app/api/waitlist/
└── route.ts                          # API endpoint for form submissions

public/builds/nutrinest/
└── nutrinest-stitch-collage.png      # ADD YOUR IMAGE HERE
```

## Features Implemented

### ✅ 1. Hero Section
- Title, subtitle, and one-liner
- Feature badges (UAE-First, Budget-Friendly, etc.)
- Primary CTA: "Join the Waitlist"
- Secondary CTA: "View Screens"
- Smooth scroll to sections
- Animated entrance with framer-motion

### ✅ 2. Social Proof
- "Built in Public" messaging
- Early access callout
- UAE-specific value proposition

### ✅ 3. Screens Gallery
- Full-width collage display
- Click-to-zoom modal
- 6 screen captions with descriptions
- "Coming Soon" callout for grocery list
- Placeholder ready for image

### ✅ 4. How It Works
- 3-step process with icons
- Animated cards on scroll
- Clear, concise descriptions

### ✅ 5. Pricing
- 35 AED/month with 7-day trial
- "Not Live Yet" badge
- 8 feature checkmarks
- Waitlist CTA button

### ✅ 6. Waitlist Form
- Email field (required) with validation
- Child age dropdown (optional)
- Bot protection:
  - Honeypot field
  - Time-to-submit check (min 2 seconds)
- Loading and success states
- Error handling
- Analytics tracking

### ✅ 7. Theme Switcher
- 4 themes: Light, Dark, Warm, Kids
- Fixed position (top-right)
- Smooth transitions
- localStorage persistence
- CSS variable updates
- Analytics tracking

### ✅ 8. Animations
- Subtle entrance animations (framer-motion)
- Hover effects on cards and buttons
- Scroll-triggered animations
- Magnetic button effects (reused from existing components)

### ✅ 9. Analytics Events
All events logged to console (ready for Plausible/GA integration):
- `view_build_nutrinest` - Page view
- `click_waitlist_cta` - CTA clicks (with source tracking)
- `submit_waitlist_success` - Form submission
- `theme_change` - Theme switch

### ✅ 10. Build Log Page
- Timeline layout
- Phase badges
- Development milestones
- "Coming Soon" section

## Setup Instructions

### 1. Add Your Image
Place your Stitch collage image at:
```
public/builds/nutrinest/nutrinest-stitch-collage.png
```

Then uncomment the `<Image>` components in:
- `app/builds/nutrinest/components/screens-gallery.tsx` (lines 60-67 and 169-175)

### 2. Waitlist Storage Options

#### Current Implementation (Option A - Recommended)
The API route stores submissions in-memory. For production, integrate with an email service:

**Using Resend (Free Tier):**
```bash
npm install resend
```

Add to `.env.local`:
```
RESEND_API_KEY=your_key_here
```

Update `app/api/waitlist/route.ts`:
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// After storing entry:
await resend.emails.send({
  from: 'NutriNest <noreply@zee.build>',
  to: email,
  subject: 'Welcome to NutriNest Waitlist',
  html: '<p>Thanks for joining! We'll notify you when we launch.</p>'
})

// Also notify yourself:
await resend.emails.send({
  from: 'NutriNest <noreply@zee.build>',
  to: 'your-email@example.com',
  subject: 'New Waitlist Signup',
  html: `<p>Email: ${email}<br>Child Age: ${childAge}</p>`
})
```

#### Alternative: Google Forms (Option B)
1. Create a Google Form with fields: email, childAge
2. Get the form action URL
3. Update `waitlist-form.tsx` to POST to Google Forms endpoint

### 3. Analytics Integration

To integrate with Plausible or Google Analytics, replace console.log calls:

**Plausible:**
```typescript
// Add to app/layout.tsx
<script defer data-domain="zee.build" src="https://plausible.io/js/script.js"></script>

// In components, replace console.log with:
window.plausible?.('event_name', { props: { key: 'value' } })
```

**Google Analytics:**
```typescript
// Use next/script in app/layout.tsx
import Script from 'next/script'

// Replace console.log with:
window.gtag?.('event', 'event_name', { key: 'value' })
```

### 4. SEO Optimization

Update the OG image path in `app/builds/nutrinest/layout.tsx` once you add your image:
```typescript
images: [
  {
    url: "/builds/nutrinest/nutrinest-stitch-collage.png",
    width: 1200,
    height: 630,
  },
],
```

## Testing

### Local Development
```bash
npm run dev
```

Visit: `http://localhost:3000/builds/nutrinest`

### Test Checklist
- [ ] Hero CTAs scroll to correct sections
- [ ] Theme switcher changes colors
- [ ] Theme persists on page reload
- [ ] Waitlist form validates email
- [ ] Waitlist form shows success state
- [ ] Honeypot protection works
- [ ] Image gallery modal opens/closes
- [ ] All animations are smooth
- [ ] Mobile responsive (test on small screens)
- [ ] Build log page loads correctly

### View Waitlist Submissions
```bash
curl -H "Authorization: Bearer dev-secret-key" http://localhost:3000/api/waitlist
```

## Deployment

### Vercel (Recommended)
```bash
git add .
git commit -m "Add NutriNest build page"
git push origin main
```

Vercel will auto-deploy. No additional configuration needed.

### Environment Variables
Add to Vercel dashboard if using Resend:
- `RESEND_API_KEY`

## Customization

### Theme Colors
Edit `app/builds/nutrinest/components/theme-switcher.tsx`:
```typescript
case "warm":
  root.style.setProperty('--primary', '30 100% 60%') // Change hue/saturation/lightness
```

### Pricing
Edit `app/builds/nutrinest/components/pricing.tsx`:
```typescript
<span className="text-5xl md:text-6xl font-bold">35 AED</span>
```

### Features List
Edit the `features` array in `pricing.tsx`

### Screen Captions
Edit the `screens` array in `screens-gallery.tsx`

## Future Enhancements

### Carousel for Multiple Screenshots
When you have individual screenshots, replace the single image with a carousel:
```bash
npm install embla-carousel-react
```

### Database Storage
For production-grade waitlist storage:
- Supabase (free tier)
- Vercel Postgres
- PlanetScale

### Email Automation
- Welcome email sequence
- Launch notification system
- Drip campaigns

## Support

For issues or questions:
- Check console for analytics events
- Verify image paths are correct
- Test API route with curl
- Check browser console for errors

## License
Part of zee.build portfolio - All rights reserved
