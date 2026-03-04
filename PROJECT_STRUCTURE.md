# Project Structure Overview

## Complete File Tree

```
zee.build/
├── app/
│   ├── (marketing)/              # Main portal routes
│   │   ├── layout.tsx           # Marketing layout with navbar/footer
│   │   ├── page.tsx             # Homepage - hero, featured build, philosophy
│   │   ├── builds/
│   │   │   ├── page.tsx         # All builds showcase
│   │   │   └── nutrinest/
│   │   │       └── page.tsx     # NutriNest project detail page
│   │   └── about/
│   │       └── page.tsx         # About Ziyan page
│   ├── (nutrinest)/             # Validation subdomain routes
│   │   ├── layout.tsx           # NutriNest-specific layout
│   │   └── nutrinest/
│   │       └── page.tsx         # Waitlist landing page
│   ├── layout.tsx               # Root layout (global)
│   └── globals.css              # Global styles + theme variables
│
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── separator.tsx
│   ├── navbar.tsx               # Main navigation component
│   └── footer.tsx               # Footer with links
│
├── lib/
│   └── utils.ts                 # cn() helper for className merging
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind + theme configuration
├── tsconfig.json                # TypeScript configuration
│
├── README.md                    # Project overview
├── SETUP.md                     # Quick setup guide
├── DEPLOYMENT.md                # Detailed deployment instructions
└── PROJECT_STRUCTURE.md         # This file
```

## Route Mapping

### Main Domain (zee.build)

| URL | File | Description |
|-----|------|-------------|
| `/` | `app/(marketing)/page.tsx` | Homepage with hero and featured builds |
| `/builds` | `app/(marketing)/builds/page.tsx` | All builds showcase |
| `/builds/nutrinest` | `app/(marketing)/builds/nutrinest/page.tsx` | NutriNest project detail |
| `/about` | `app/(marketing)/about/page.tsx` | About page |

### Subdomain (nutrinest.zee.build)

| URL | File | Description |
|-----|------|-------------|
| `/` | `app/(nutrinest)/nutrinest/page.tsx` | Waitlist landing page |

Note: The subdomain routes to `/nutrinest` path, which is handled by the `(nutrinest)` route group.

## Component Architecture

### Layout Hierarchy

```
Root Layout (app/layout.tsx)
├── Marketing Layout (app/(marketing)/layout.tsx)
│   ├── Navbar
│   ├── Page Content
│   └── Footer
└── NutriNest Layout (app/(nutrinest)/layout.tsx)
    └── Page Content (standalone, no navbar/footer)
```

### Shared Components

- **Navbar**: Used in marketing layout only
- **Footer**: Used in marketing layout only
- **UI Components**: Used across all pages

### Page-Specific Components

All pages use shadcn/ui components directly. No custom page-specific components needed for MVP.

## Styling System

### Theme Configuration

Defined in `app/globals.css`:

```css
--background: 0 0% 8%        /* Dark background */
--foreground: 0 0% 85%       /* Silver text */
--primary: 24 100% 60%       /* Warm orange */
--card: 0 0% 10%             /* Card background */
--border: 0 0% 20%           /* Border color */
```

### Tailwind Extensions

Configured in `tailwind.config.ts`:
- Custom color system via CSS variables
- Container utilities
- Animation utilities
- Border radius tokens

### Global Effects

- Subtle grain overlay (3% opacity)
- Dark mode by default
- Inter font family

## Data Flow

### Current (MVP)

```
User Input → Form State → Console Log
```

### With Supabase Integration

```
User Input → Form State → Supabase Client → Database
                              ↓
                         Success/Error State
```

### Future (Full Product)

```
User Input → API Route → Supabase → Email Service
                            ↓
                    Analytics Tracking
```

## Key Design Decisions

### 1. Route Groups

Using `(marketing)` and `(nutrinest)` to:
- Organize code logically
- Apply different layouts
- Keep URLs clean (groups don't appear in URLs)

### 2. Minimal Component Structure

- No over-abstraction
- Use shadcn/ui directly in pages
- Create custom components only when needed
- Keep it lean and maintainable

### 3. Type Safety

- TypeScript everywhere
- Strict mode enabled
- Type-safe form handling with zod
- Type-safe UI components

### 4. Performance

- Server components by default
- Client components only when needed (`"use client"`)
- Optimized images (when added)
- Minimal JavaScript bundle

### 5. Accessibility

- shadcn/ui built on Radix UI (accessible primitives)
- Semantic HTML
- Proper form labels
- Keyboard navigation support

## Environment Variables

### Required for Production

```env
DATABASE_URL                    # Supabase connection string
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anonymous key
```

### Optional

```env
NEXT_PUBLIC_META_PIXEL_ID      # Meta Pixel for tracking
EMAIL_SERVICE_API_KEY          # Email notifications
```

## Build Output

### Development

```bash
npm run dev
# Starts dev server on http://localhost:3000
# Hot reload enabled
# Source maps included
```

### Production

```bash
npm run build
# Creates optimized production build in .next/
# Static pages pre-rendered
# Server components optimized
# Client bundles minimized
```

## Deployment Architecture

```
GitHub Repository
       ↓
   Vercel Build
       ↓
   ┌─────────────┐
   │  zee.build  │ ← Main domain
   └─────────────┘
       ↓
   ┌─────────────────────┐
   │ nutrinest.zee.build │ ← Subdomain
   └─────────────────────┘
       ↓
   Supabase Database
```

## Future Expansion

### Adding New Builds

1. Create new page in `app/(marketing)/builds/[build-name]/page.tsx`
2. Add card to builds grid in `app/(marketing)/builds/page.tsx`
3. Update featured section on homepage if needed

### Adding New Subdomains

1. Create new route group: `app/(subdomain-name)/`
2. Add layout and pages
3. Configure domain in Vercel
4. Add DNS CNAME record

### Adding Backend Features

1. Create API routes in `app/api/`
2. Add server actions for form handling
3. Integrate with Supabase or other services
4. Add middleware for auth/protection

## Maintenance Notes

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all (careful)
npm update

# Update specific package
npm install package-name@latest
```

### Adding shadcn Components

```bash
# List available components
npx shadcn@latest add

# Add specific component
npx shadcn@latest add [component-name]
```

### Code Quality

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Format (if prettier configured)
npx prettier --write .
```

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90
- Core Web Vitals: All green

## Security Considerations

- Environment variables never exposed to client (except NEXT_PUBLIC_*)
- Supabase RLS policies protect data
- HTTPS enforced via Vercel
- No sensitive data in client-side code
- Form validation on both client and server

## Monitoring

### Vercel Analytics

- Page views
- User sessions
- Performance metrics
- Error tracking

### Supabase Dashboard

- Database queries
- Real-time subscriptions
- Storage usage
- API usage

### Custom Tracking

- Waitlist conversion rate
- Page engagement
- Form abandonment
- Traffic sources
