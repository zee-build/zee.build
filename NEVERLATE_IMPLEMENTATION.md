# NeverLate Implementation Plan

## Overview
NeverLate is a premium life admin OS for tracking important documents and renewals for multiple profiles (self, family, business).

## Core Philosophy
**Simplicity is the premium feature** - Calm, modern, intuitive design that makes users feel in control instantly.

## Implementation Status

### ✅ Completed
1. **Theme System** - Premium calm design with status colors
2. **Landing Page** - Hero, features, how it works, CTA
3. **Type System** - Profiles, Documents, Status, Health Score
4. **Utilities** - Status calculation, health score, formatting
5. **Storage Layer** - localStorage-based for MVP
6. **Profiles Home** - Grid view with health scores and stats

### 🚧 In Progress
7. Create Profile Flow
8. Profile Dashboard
9. Add Document Manually
10. Upload + OCR Flow
11. Review & Confirm Screen
12. Notifications Page
13. Settings Page

## File Structure
```
app/(neverlate)/
├── layout.tsx                    # NeverLate layout wrapper
├── neverlate.css                 # Premium theme system
├── neverlate/
│   ├── page.tsx                  # Landing page
│   └── app/
│       ├── page.tsx              # Profiles home
│       ├── profiles/
│       │   ├── new/page.tsx      # Create profile
│       │   └── [id]/
│       │       ├── page.tsx      # Profile dashboard
│       │       ├── documents/
│       │       │   ├── new/page.tsx      # Add document
│       │       │   └── upload/page.tsx   # OCR upload
│       │       └── settings/page.tsx
│       ├── notifications/page.tsx
│       └── settings/page.tsx

lib/neverlate/
├── types.ts                      # TypeScript types
├── utils.ts                      # Helper functions
└── storage.ts                    # localStorage layer
```

## Key Features

### 1. Profile System
- Multiple profiles (self, spouse, child, parent, business)
- Custom avatars and colors
- Life health score per profile
- Document count and urgency indicators

### 2. Document Tracking
- Categories: Passport, Visa, ID, License, Insurance, etc.
- Status: Safe, Upcoming, Urgent, Overdue
- Auto-calculated based on expiry dates
- File attachments

### 3. Life Health Score
- Visual score (0-100) per profile
- Based on document status distribution
- Color-coded: Green (80+), Amber (50-79), Red (<50)

### 4. OCR Upload (Planned)
- Upload image/PDF
- Extract key fields
- Review & confirm screen
- Save to profile

### 5. Smart Reminders (Planned)
- 90, 60, 30, 7 days before expiry
- In-app notifications
- Clear urgency visibility

## Design System

### Colors
- **Primary**: Indigo (Trust & Calm)
- **Accent**: Purple (Premium)
- **Safe**: Green
- **Upcoming**: Amber
- **Urgent**: Orange
- **Overdue**: Red

### Typography
- Inter for body
- JetBrains Mono for mono
- Large, clear headings
- Generous spacing

### Components
- Rounded cards with subtle shadows
- Smooth transitions
- Premium gradients
- Status badges
- Health score meters

## Next Steps
1. Complete create profile flow
2. Build profile dashboard with sections
3. Add document manually form
4. OCR upload flow with mock extraction
5. Review & confirm screen
6. Notifications page
7. Settings page
8. Add to builds page

## Integration with zee.build
- Follows same architecture as MotoScout/NutriNest
- Uses existing UI components
- Isolated theme system
- Clean navigation
- Ready for Supabase migration
