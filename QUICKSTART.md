# 🚀 Quickstart Guide

## Copy-Paste Commands (In Order)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Repo Readiness Check

| Requirement | Status | Version/Details |
|------------|--------|-----------------|
| Next.js | ✅ Configured | 15.0.0 (App Router) |
| TypeScript | ✅ Enabled | 5.3.3 (Strict mode) |
| Tailwind CSS | ✅ Installed | 3.4.1 |
| shadcn/ui | ✅ Configured | Latest |
| Route Groups | ✅ Set up | (marketing) & (nutrinest) |
| Components | ✅ Created | Button, Card, Badge, Input, Label, Separator |
| Utils | ✅ Ready | cn() helper in lib/utils.ts |

## 📁 Files Created

### Configuration (9 files)
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind + theme
- `postcss.config.mjs` - PostCSS setup
- `components.json` - shadcn/ui config
- `.gitignore` - Git ignore rules
- `.env.example` - Environment template
- `lib/utils.ts` - Utility functions

### Layouts (3 files)
- `app/layout.tsx` - Root layout
- `app/(marketing)/layout.tsx` - Marketing layout with navbar/footer
- `app/(nutrinest)/layout.tsx` - NutriNest layout

### Marketing Pages (4 files)
- `app/(marketing)/page.tsx` - Homepage
- `app/(marketing)/builds/page.tsx` - All builds
- `app/(marketing)/builds/nutrinest/page.tsx` - NutriNest project page
- `app/(marketing)/about/page.tsx` - About page

### NutriNest Validation (1 file)
- `app/(nutrinest)/nutrinest/page.tsx` - Waitlist landing page

### Components (8 files)
- `components/navbar.tsx` - Navigation
- `components/footer.tsx` - Footer
- `components/ui/button.tsx` - Button component
- `components/ui/card.tsx` - Card component
- `components/ui/badge.tsx` - Badge component
- `components/ui/input.tsx` - Input component
- `components/ui/label.tsx` - Label component
- `components/ui/separator.tsx` - Separator component

### Styles (1 file)
- `app/globals.css` - Global styles + theme

### Documentation (5 files)
- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_STRUCTURE.md` - Architecture details
- `QUICKSTART.md` - This file

**Total: 31 files created**

## 🎨 Styling Decisions

### Color Palette
- **Background**: `hsl(0 0% 8%)` - Deep dark
- **Foreground**: `hsl(0 0% 85%)` - Silver text
- **Primary**: `hsl(24 100% 60%)` - Warm orange (#FF8C42)
- **Card**: `hsl(0 0% 10%)` - Slightly lighter than background
- **Border**: `hsl(0 0% 20%)` - Subtle borders

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale (text-sm to text-7xl)
- **Weight**: Regular (400) to Bold (700)

### Effects
- Subtle grain overlay (3% opacity)
- Smooth transitions on hover
- Premium minimal aesthetic

### Why These Choices?
- Dark theme reduces eye strain, feels premium
- Silver text softer than pure white
- Orange accent stands out, feels energetic
- Minimal design keeps focus on content

## 🌐 Subdomain Mapping (Vercel)

### How It Works

1. **Add Domains in Vercel**:
   - Project Settings → Domains
   - Add: `zee.build`
   - Add: `nutrinest.zee.build`

2. **Configure DNS** (at your registrar):
   ```
   # Main domain
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   # Subdomain
   Type: CNAME
   Name: nutrinest
   Value: cname.vercel-dns.com
   ```

3. **Automatic Routing**:
   - `zee.build` → `app/(marketing)` routes
   - `nutrinest.zee.build` → `app/(nutrinest)` routes

### No Additional Config Needed!

Vercel handles subdomain routing automatically based on your route groups.

### Optional: Manual Rewrites

If you need custom behavior, add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'nutrinest.zee.build' }],
        destination: '/nutrinest/:path*',
      },
    ];
  },
};
```

## 🗄️ Environment Variables Needed

### For Waitlist (Supabase)

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### For Analytics (Optional)

```env
NEXT_PUBLIC_META_PIXEL_ID=123456789
```

### Where to Add Them

**Local Development**: `.env.local`
**Vercel Production**: Project Settings → Environment Variables

## 📦 Next Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: zee.build with NutriNest"
git branch -M main
git remote add origin https://github.com/yourusername/zee-build.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Framework: Next.js (auto-detected)
5. Click "Deploy"

### 3. Add Environment Variables

In Vercel dashboard:
- Settings → Environment Variables
- Add all variables from `.env.example`
- Apply to Production, Preview, Development

### 4. Configure Domains

In Vercel dashboard:
- Settings → Domains
- Add `zee.build`
- Add `nutrinest.zee.build`
- Follow DNS instructions

### 5. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from `DEPLOYMENT.md` to create waitlist table
3. Copy credentials to Vercel environment variables
4. Redeploy

### 6. Verify

- ✅ Visit `https://zee.build`
- ✅ Visit `https://nutrinest.zee.build`
- ✅ Test waitlist form
- ✅ Check Supabase for submissions

## 🎯 Why This Structure?

### /components/ui Folder

This is the shadcn/ui convention:
- All UI primitives in one place
- Consistent styling via Tailwind
- Accessible by default (Radix UI)
- Easy to customize
- Type-safe with TypeScript

### Route Groups

`(marketing)` and `(nutrinest)`:
- Organize code logically
- Apply different layouts
- Don't affect URLs (parentheses are removed)
- Clean separation of concerns

### Minimal Approach

- No over-engineering
- Production-ready from day one
- Easy to understand and maintain
- Fast to iterate and validate

## 🚦 Testing Checklist

### Local Testing

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] All builds page displays cards
- [ ] NutriNest project page shows features
- [ ] About page renders
- [ ] Waitlist form accepts input
- [ ] Form validation works
- [ ] Responsive on mobile
- [ ] No console errors

### Production Testing

- [ ] Main domain resolves
- [ ] Subdomain resolves
- [ ] SSL certificates active
- [ ] Forms submit to database
- [ ] Analytics tracking works
- [ ] All links functional
- [ ] Performance acceptable (Lighthouse > 90)

## 📊 Success Metrics

### Validation Phase (NutriNest)

- Waitlist signups
- Conversion rate (visitors → signups)
- Geographic distribution
- Age range distribution
- Budget sensitivity percentage

### Portfolio (zee.build)

- Page views
- Time on site
- LinkedIn clicks
- Project page engagement

## 🔧 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port In Use

```bash
npx kill-port 3000
# or
npm run dev -- -p 3001
```

### TypeScript Errors

```bash
npx tsc --noEmit
```

### Subdomain Not Working

- Wait 24-48 hours for DNS propagation
- Verify CNAME points to `cname.vercel-dns.com`
- Check Vercel domain settings
- Clear browser cache

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## 🎉 You're Ready!

Run `npm install && npm run dev` and start building.

The foundation is solid, lean, and production-ready. Focus on validation first, scale later.

Good luck with zee.build and NutriNest! 🚀
