# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account
- Supabase account (for waitlist data)
- Domain: zee.build

## Step 1: Database Setup (Supabase)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### Create Waitlist Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  age_range TEXT NOT NULL,
  country TEXT DEFAULT 'UAE',
  allergies TEXT,
  budget_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (for waitlist form)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT TO authenticated
  USING (true);
```

## Step 2: Vercel Deployment

### Initial Setup

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: zee.build with NutriNest"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id (optional)
```

### Deploy

Click "Deploy" - Vercel will build and deploy automatically.

## Step 3: Domain Configuration

### Main Domain (zee.build)

1. In Vercel project settings → Domains
2. Add domain: `zee.build`
3. Add DNS records at your domain registrar:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### Subdomain (nutrinest.zee.build)

1. In Vercel project settings → Domains
2. Add domain: `nutrinest.zee.build`
3. Add DNS record at your domain registrar:
   - Type: CNAME
   - Name: nutrinest
   - Value: cname.vercel-dns.com

### Subdomain Routing

The subdomain will automatically route to `/nutrinest` path.

If you need custom routing, add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nutrinest.zee.build',
          },
        ],
        destination: '/nutrinest/:path*',
      },
    ];
  },
};
```

## Step 4: Integrate Waitlist Form with Supabase

Update `app/(nutrinest)/nutrinest/page.tsx`:

```typescript
// Add at top
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// In handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          age_range: ageRange,
          country,
          allergies: allergies || null,
          budget_sensitive: budgetSensitive,
        },
      ]);

    if (error) throw error;

    setIsSubmitted(true);
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

Install Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 5: Meta Pixel (Optional)

Add to `app/layout.tsx` before closing `</head>`:

```typescript
{process.env.NEXT_PUBLIC_META_PIXEL_ID && (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
        fbq('track', 'PageView');
      `,
    }}
  />
)}
```

Track waitlist submissions:

```typescript
// In handleSubmit after successful submission
if (typeof window !== 'undefined' && (window as any).fbq) {
  (window as any).fbq('track', 'Lead', {
    content_name: 'NutriNest Waitlist',
  });
}
```

## Step 6: Verify Deployment

1. Visit `https://zee.build` - should show main portal
2. Visit `https://nutrinest.zee.build` - should show waitlist page
3. Test waitlist form submission
4. Check Supabase dashboard for new entries

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard → Analytics

### Supabase Dashboard

Monitor waitlist signups in real-time:
- Table Editor → waitlist
- View submissions, export CSV

## Troubleshooting

### Subdomain not working

- Check DNS propagation (can take up to 48 hours)
- Verify CNAME record points to `cname.vercel-dns.com`
- Check Vercel domain settings

### Form submissions failing

- Verify Supabase environment variables
- Check browser console for errors
- Verify RLS policies in Supabase

### Build errors

- Check Vercel build logs
- Verify all dependencies installed
- Check TypeScript errors locally: `npm run build`

## Next Steps

1. Set up email notifications for new waitlist signups
2. Create admin dashboard to view submissions
3. Add analytics tracking
4. Set up A/B testing for landing page
5. Plan validation campaign strategy
