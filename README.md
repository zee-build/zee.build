# 🚀 zee.build

> Premium portfolio + build lab by Ziyan Bin Anoos Hilal

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Private-red?style=flat)](LICENSE)

## 📖 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

> **[📖 Complete Documentation Index](./DOCS_INDEX.md)** - Full guide to all docs

| Document | Description |
|----------|-------------|
| **[START_HERE.md](./START_HERE.md)** | 👈 Your starting point - read this first! |
| [QUICKSTART.md](./QUICKSTART.md) | Copy-paste commands and quick setup |
| [CHECKLIST.md](./CHECKLIST.md) | Complete deployment checklist |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Detailed deployment guide |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture and diagrams |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | File organization and routing |
| [WHAT_WAS_BUILT.md](./WHAT_WAS_BUILT.md) | Visual guide with ASCII diagrams |
| [RESOURCES.md](./RESOURCES.md) | Links and learning resources |
| [SUMMARY.md](./SUMMARY.md) | Project delivery summary |

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│           zee.build                  │
│     (Main Portfolio Site)            │
└─────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   Homepage   │  │  Builds & About  │
│      /       │  │  /builds /about  │
└──────────────┘  └──────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   NutriNest     │
                │  /builds/       │
                │   nutrinest     │
                └─────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │   nutrinest.zee.build      │
        │  (Validation Landing)      │
        └────────────────────────────┘
                         │
                         ▼
                ┌─────────────┐
                │  Supabase   │
                │  Database   │
                └─────────────┘
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.4
- **Components:** shadcn/ui (Radix UI)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics + Meta Pixel

## 📁 Project Structure

```
zee.build/
├── app/
│   ├── (marketing)/          # Main portal (zee.build)
│   │   ├── page.tsx         # Homepage
│   │   ├── builds/          # Builds showcase
│   │   │   ├── page.tsx
│   │   │   └── nutrinest/   # NutriNest project page
│   │   └── about/           # About page
│   └── (nutrinest)/         # Validation subdomain
│       └── nutrinest/
│           └── page.tsx     # Waitlist landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── navbar.tsx
│   └── footer.tsx
└── lib/
    └── utils.ts             # Utilities
```

## 🎨 Design System

### Colors
- **Background:** `#141414` (Dark)
- **Foreground:** `#D9D9D9` (Silver)
- **Primary:** `#FF8C42` (Warm Orange)
- **Card:** `#1A1A1A`
- **Border:** `#333333`

### Typography
- **Font:** Inter (Google Fonts)
- **Style:** Premium minimal aesthetic
- **Hierarchy:** Clean and clear

### Effects
- Subtle grain overlay (3% opacity)
- Smooth transitions
- Premium dark theme

## ✨ Features

### zee.build Portal
- ✅ Hero with clear value proposition
- ✅ Featured builds showcase
- ✅ Builds grid with status badges
- ✅ Philosophy section
- ✅ About page

### NutriNest Validation
- ✅ Waitlist landing page
- ✅ Form with email, age, country, allergies, budget
- ✅ Success state
- ✅ Supabase integration ready

## 🚀 Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

### 2. Deploy to Vercel
1. Import repository in Vercel
2. Add environment variables
3. Deploy

### 3. Configure Domains
- Add `zee.build` in Vercel
- Add `nutrinest.zee.build` in Vercel
- Update DNS records

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🌐 Domain Setup

| Domain | Routes To | Purpose |
|--------|-----------|---------|
| zee.build | app/(marketing) | Main portfolio |
| nutrinest.zee.build | app/(nutrinest) | Validation landing |

## 🔐 Environment Variables

```env
# Supabase (Required for waitlist)
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Analytics (Optional)
NEXT_PUBLIC_META_PIXEL_ID=123456789
```

## 📊 Success Metrics

### Portfolio (zee.build)
- Page views
- LinkedIn clicks
- Project engagement
- Time on site

### Validation (NutriNest)
- Waitlist signups
- Conversion rate
- Geographic distribution
- Feature interest

## 🧪 Testing

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint
```

## 📝 Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `app/` or `components/`
   - Changes hot-reload automatically

3. **Test Locally**
   - Visit http://localhost:3000
   - Test all pages and forms

4. **Deploy**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
   - Vercel auto-deploys on push

## 🎯 Roadmap

### Phase 1: Validation (Current)
- [x] Build zee.build portal
- [x] Create NutriNest landing page
- [ ] Launch waitlist
- [ ] Collect 100+ signups

### Phase 2: MVP
- [ ] Build NutriNest core features
- [ ] Add authentication
- [ ] Create user dashboard
- [ ] Launch beta

### Phase 3: Growth
- [ ] Iterate based on feedback
- [ ] Add more features
- [ ] Scale infrastructure
- [ ] Consider separate domain

## 🤝 Contributing

This is a private project. For questions or suggestions, reach out on LinkedIn.

## 📞 Contact

- **Creator:** Ziyan Bin Anoos Hilal
- **LinkedIn:** [linkedin.com/in/ziyanbinanoos](https://www.linkedin.com/in/ziyanbinanoos/)
- **Instagram:** [@zee.build](https://instagram.com/zee.build)
- **Email:** contact@zee.build

## 📄 License

Private - © 2026 Ziyan Bin Anoos Hilal

---

## 🎉 Ready to Build?

1. Read [START_HERE.md](./START_HERE.md)
2. Run `npm install && npm run dev`
3. Start building!

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
