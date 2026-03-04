# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
- Form handling libraries

## 2. Verify Installation

Check that everything is installed correctly:

```bash
npm run build
```

Should complete without errors.

## 3. Run Development Server

```bash
npm run dev
```

Visit:
- Main portal: http://localhost:3000
- Builds page: http://localhost:3000/builds
- NutriNest project: http://localhost:3000/builds/nutrinest
- NutriNest waitlist: http://localhost:3000/nutrinest

## 4. Optional: Set Up Supabase

For waitlist functionality:

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL from `DEPLOYMENT.md` to create waitlist table
4. Copy `.env.example` to `.env.local`
5. Add your Supabase credentials

## 5. Test Locally

- Navigate through all pages
- Test responsive design
- Submit waitlist form (will log to console without Supabase)
- Check for any console errors

## Folder Structure Explained

### Route Groups

- `(marketing)` - Main zee.build portal routes
- `(nutrinest)` - NutriNest validation subdomain routes

Route groups don't affect URLs but help organize code.

### Why /components/ui?

This is the shadcn/ui convention. All UI primitives live here:
- Consistent styling via Tailwind
- Accessible by default (Radix UI)
- Customizable and composable
- Type-safe with TypeScript

### Styling Decisions

1. **Dark Theme**: Premium aesthetic, reduces eye strain
2. **Warm Orange Accent**: Stands out, energetic, friendly
3. **Subtle Grain**: Adds texture without distraction
4. **Silver Text**: Softer than pure white, easier to read
5. **Minimal Design**: Focus on content, not decoration

## Subdomain Mapping (Production)

### How it works in Vercel:

1. Add both domains in Vercel dashboard:
   - zee.build (main)
   - nutrinest.zee.build (subdomain)

2. Vercel automatically routes:
   - zee.build → app/(marketing) routes
   - nutrinest.zee.build → app/(nutrinest) routes

3. No additional config needed unless you want custom rewrites

### Alternative: Manual Rewrites

If you need more control, add to `next.config.ts`:

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

## Common Issues

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript errors

```bash
# Check for errors
npx tsc --noEmit
```

## Next Steps

1. Customize content in pages
2. Add your LinkedIn/Instagram links
3. Set up Supabase for waitlist
4. Deploy to Vercel
5. Configure domains
6. Start validation campaign

## Production Checklist

- [ ] All dependencies installed
- [ ] Build completes without errors
- [ ] All pages render correctly
- [ ] Forms work (at least console logging)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Links point to correct URLs
- [ ] Environment variables configured
- [ ] Supabase database set up
- [ ] Meta Pixel added (optional)
- [ ] Deployed to Vercel
- [ ] Domains configured and verified
- [ ] SSL certificates active
- [ ] Analytics tracking working

## Support

For issues or questions:
- Check DEPLOYMENT.md for detailed deployment steps
- Review Next.js docs: https://nextjs.org/docs
- Check shadcn/ui docs: https://ui.shadcn.com
- Supabase docs: https://supabase.com/docs
