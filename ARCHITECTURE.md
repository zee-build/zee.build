# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         zee.build                            │
│                    (Main Portfolio Site)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Homepage   │    │    Builds    │    │    About     │
│      /       │    │   /builds    │    │    /about    │
└──────────────┘    └──────────────┘    └──────────────┘
                            │
                            │
                    ┌───────┴───────┐
                    │               │
                    ▼               ▼
            ┌──────────────┐  ┌──────────┐
            │  NutriNest   │  │  Future  │
            │   Project    │  │  Builds  │
            │    Page      │  │          │
            └──────────────┘  └──────────┘
                    │
                    │
                    ▼
        ┌───────────────────────┐
        │  nutrinest.zee.build  │
        │  (Validation Landing) │
        └───────────────────────┘
                    │
                    │
                    ▼
            ┌──────────────┐
            │   Supabase   │
            │   Database   │
            └──────────────┘
```

## Route Structure

```
app/
│
├── (marketing)/                    # zee.build routes
│   ├── layout.tsx                 # Navbar + Footer
│   │
│   ├── page.tsx                   # GET /
│   │   └── Components:
│   │       ├── Hero
│   │       ├── Featured Build (NutriNest)
│   │       ├── Builds Grid
│   │       └── Philosophy
│   │
│   ├── builds/
│   │   ├── page.tsx              # GET /builds
│   │   │   └── Components:
│   │   │       └── Build Cards Grid
│   │   │
│   │   └── nutrinest/
│   │       └── page.tsx          # GET /builds/nutrinest
│   │           └── Components:
│   │               ├── Hero
│   │               ├── Problem Section
│   │               ├── Features Grid
│   │               └── CTA
│   │
│   └── about/
│       └── page.tsx              # GET /about
│           └── Components:
│               └── About Content
│
└── (nutrinest)/                   # nutrinest.zee.build routes
    ├── layout.tsx                # Minimal layout (no navbar/footer)
    │
    └── nutrinest/
        └── page.tsx              # GET / (on subdomain)
            └── Components:
                ├── Hero
                ├── Waitlist Form
                ├── Features
                └── Footer
```

## Component Hierarchy

```
Root Layout
├── Font: Inter
├── Dark Mode
└── Global Styles

Marketing Layout
├── Navbar
│   ├── Logo (zee.build)
│   └── Links (Builds, About)
├── Page Content
│   └── [Dynamic Page]
└── Footer
    ├── Copyright
    └── Links (LinkedIn, Instagram, Contact)

NutriNest Layout
└── Page Content
    └── Standalone Landing Page
```

## Data Flow

### Waitlist Submission Flow

```
User Input
    │
    ▼
Form Component (Client)
    │
    ├─► Validation (zod)
    │
    ▼
Supabase Client
    │
    ├─► Insert to Database
    │
    ▼
Success/Error State
    │
    ├─► Show Confirmation
    └─► Track Event (Meta Pixel)
```

### Future: Full Product Flow

```
User Action
    │
    ▼
API Route (Server)
    │
    ├─► Authentication Check
    ├─► Business Logic
    ├─► Database Operation
    ├─► Email Notification
    └─► Analytics Event
    │
    ▼
Response to Client
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           Frontend Layer                 │
├─────────────────────────────────────────┤
│  Next.js 15 (App Router)                │
│  React 18 (Server Components)           │
│  TypeScript 5.3                          │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│           Styling Layer                  │
├─────────────────────────────────────────┤
│  Tailwind CSS 3.4                       │
│  shadcn/ui (Radix UI)                   │
│  CSS Variables (Theme)                  │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│           Data Layer                     │
├─────────────────────────────────────────┤
│  Supabase (PostgreSQL)                  │
│  Row Level Security                     │
│  Real-time Subscriptions                │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Deployment Layer                 │
├─────────────────────────────────────────┤
│  Vercel (Hosting)                       │
│  Edge Network (CDN)                     │
│  Automatic SSL                          │
└─────────────────────────────────────────┘
```

## Domain Architecture

```
┌──────────────────────────────────────────────────┐
│              DNS Configuration                    │
└──────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────┐          ┌──────────────────┐
│  zee.build   │          │ nutrinest.zee    │
│              │          │     .build       │
│  A Record    │          │  CNAME Record    │
│  76.76.21.21 │          │  cname.vercel    │
└──────────────┘          │     -dns.com     │
        │                 └──────────────────┘
        │                           │
        └─────────────┬─────────────┘
                      │
                      ▼
            ┌──────────────────┐
            │  Vercel Platform │
            └──────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────┐          ┌──────────────────┐
│  Marketing   │          │   NutriNest      │
│   Routes     │          │    Routes        │
│ (marketing)  │          │  (nutrinest)     │
└──────────────┘          └──────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│           Client Browser                 │
└─────────────────────────────────────────┘
                  │
                  │ HTTPS (SSL/TLS)
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Vercel Edge Network              │
│  - DDoS Protection                       │
│  - Rate Limiting                         │
│  - SSL Termination                       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Next.js Application              │
│  - Server Components (secure by default)│
│  - Environment Variables (server-only)  │
│  - Input Validation (zod)               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Supabase Database                │
│  - Row Level Security (RLS)             │
│  - Connection Pooling                   │
│  - Encrypted at Rest                    │
└─────────────────────────────────────────┘
```

## Performance Architecture

```
┌─────────────────────────────────────────┐
│         Build Time (Static)              │
├─────────────────────────────────────────┤
│  - Static Pages Pre-rendered            │
│  - CSS Purged & Minified                │
│  - JavaScript Tree-shaken               │
│  - Images Optimized                     │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Runtime (Dynamic)                │
├─────────────────────────────────────────┤
│  - Server Components (Zero JS)          │
│  - Client Components (Minimal JS)       │
│  - Streaming SSR                        │
│  - Incremental Static Regeneration      │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Delivery (CDN)                   │
├─────────────────────────────────────────┤
│  - Edge Caching                         │
│  - Brotli Compression                   │
│  - HTTP/2 & HTTP/3                      │
│  - Smart Routing                        │
└─────────────────────────────────────────┘
```

## Development Workflow

```
┌──────────────┐
│  Local Dev   │
│  npm run dev │
└──────────────┘
        │
        │ git push
        │
        ▼
┌──────────────┐
│   GitHub     │
│  Repository  │
└──────────────┘
        │
        │ webhook
        │
        ▼
┌──────────────┐
│    Vercel    │
│    Build     │
└──────────────┘
        │
        ├─► Type Check
        ├─► Lint
        ├─► Build
        └─► Deploy
        │
        ▼
┌──────────────┐
│  Production  │
│   Preview    │
└──────────────┘
        │
        │ promote
        │
        ▼
┌──────────────┐
│  Production  │
│     Live     │
└──────────────┘
```

## Scaling Strategy

### Phase 1: Validation (Current)
- Static pages
- Simple waitlist form
- Supabase free tier
- Vercel hobby plan

### Phase 2: MVP Launch
- Add authentication
- User dashboard
- API routes
- Supabase pro tier
- Vercel pro plan

### Phase 3: Growth
- Database optimization
- Caching layer (Redis)
- Background jobs
- Email service
- Analytics platform

### Phase 4: Scale
- Microservices architecture
- Separate API server
- CDN for assets
- Load balancing
- Monitoring & alerting

## Monitoring & Analytics

```
┌─────────────────────────────────────────┐
│         User Interactions                │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│   Vercel     │    │  Meta Pixel  │
│  Analytics   │    │   Tracking   │
└──────────────┘    └──────────────┘
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│  Performance │    │  Conversion  │
│   Metrics    │    │   Tracking   │
└──────────────┘    └──────────────┘
```

## Database Schema (Supabase)

```sql
┌─────────────────────────────────────────┐
│              waitlist                    │
├─────────────────────────────────────────┤
│  id              UUID (PK)               │
│  email           TEXT (UNIQUE)           │
│  age_range       TEXT                    │
│  country         TEXT                    │
│  allergies       TEXT (nullable)         │
│  budget_sensitive BOOLEAN                │
│  created_at      TIMESTAMP               │
└─────────────────────────────────────────┘

Row Level Security:
- INSERT: Public (anon)
- SELECT: Authenticated only
- UPDATE: None
- DELETE: None
```

## Future Expansion Points

### New Builds
```
app/(marketing)/builds/
├── nutrinest/
├── sentinelrisk/      # Fintech risk intelligence
├── automation-tools/   # Add new build
└── experiments/        # Add new build
```

### New Subdomains
```
app/
├── (marketing)/        # zee.build
├── (nutrinest)/       # nutrinest.zee.build
├── (sentinelrisk)/    # sentinelrisk.zee.build
└── (tools)/           # tools.zee.build
```

### API Routes
```
app/api/
├── waitlist/
│   └── route.ts       # POST /api/waitlist
├── auth/
│   └── route.ts       # POST /api/auth
└── webhooks/
    └── route.ts       # POST /api/webhooks
```

## Key Architectural Decisions

### 1. Server Components First
- Reduces JavaScript bundle
- Better performance
- Improved SEO
- Simpler data fetching

### 2. Route Groups
- Clean URL structure
- Logical code organization
- Different layouts per section
- Easy to scale

### 3. Supabase for Backend
- PostgreSQL (reliable)
- Real-time capabilities
- Built-in auth
- Row Level Security
- Easy to start, scales well

### 4. Vercel for Hosting
- Zero-config deployment
- Automatic SSL
- Edge network
- Preview deployments
- Great DX

### 5. Minimal Dependencies
- Faster builds
- Smaller bundles
- Fewer security risks
- Easier maintenance
- Better performance

## Conclusion

This architecture is:
- ✅ Production-ready
- ✅ Scalable
- ✅ Maintainable
- ✅ Performant
- ✅ Secure
- ✅ Cost-effective

Start lean, validate fast, scale when needed.
