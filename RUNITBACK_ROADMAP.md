# Run It Back — Roadmap (from squad feedback, 2026-06-12)

Raw feedback from the group chat (Rohvin), organized into actionable
items. Nothing here is built yet — this is a planning doc.

## Quick fixes

- **Fix incorrect player positions** — e.g. Zareef is listed as CAM but
  never plays there. Need a way to correct positions (admin edit, or
  let players self-select their real position with admin approval).

## Transparency / fairness

- **Make weekly match ratings public** — currently peer ratings are
  anonymous/private. Squad wants ratings to be visible (who rated whom,
  and what) so people don't troll ratings without accountability.
  - Pairs with the post-match rating flow below.

## Match-day tools

- **GK rotation** — track/rotate who's in goal each week.
  - **Randomizer** for GK rotation order/numbers.
- **Team picks / team selection**
  - Auto-generate balanced teams each week.
  - Admin/mod can manually adjust the auto-generated teams.

## Player profile

- **Football attributes / traits** — beyond the existing 6 FIFA
  attributes (pace/shooting/passing/dribbling/defending/physical),
  add traits/tags (e.g. "Finisher", "Engine", "Aerial Threat").

## Onboarding / branding

- **Welcome page** — a "Welcome to Run It Back" club intro page.
  Mobile layout already looks good per feedback.
- **Animated FIFA-esque start screen** — like the FIFA 20 EA Sports
  splash screen referenced (big player image, animated logo reveal,
  "tap to continue" feel) before landing on the home page.

## Bigger roadmap items

- **Team management** — formations + drag-and-drop player placement.
- **Tournament bracket maker** — admin/mod generates brackets, can
  edit teams week to week.
- **New "mod" role** — a permission tier below admin that can log
  matches (currently only admin can).
- **Post-match rating flow**:
  1. Mod/admin logs the match result (existing flow).
  2. Every player who played gets a "rate your teammates" prompt for
     that specific match.
  3. Those ratings feed into player stats/overall (as peer ratings do
     now), but **the votes are public** this time (see Transparency
     above).

---

## Suggested starting points

These are mostly independent, so we can tackle in any order. Candidates
for "build first":

1. **Animated FIFA-style welcome/splash screen** — self-contained,
   high visual impact, no schema changes.
2. **Public match ratings** — builds on existing peer_ratings table,
   mainly UI + a "show who rated what" view.
3. **Fix player positions** — small data/UI fix, quick win.
4. **Mod role + post-match rating prompt** — bigger, touches auth,
   schema (new role), and match-logging flow.
5. **Team auto-pick + GK rotation** — bigger, new schema for weekly
   rotations and team generation logic.
