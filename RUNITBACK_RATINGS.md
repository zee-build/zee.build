# Run It Back — How Ratings & Cards Work

The rating system works like an **EA FC ratings update**. There are two
separate things players do, and they feed the card differently:

1. **Match Ratings** — one quick score out of 10 per teammate, per game.
   "How did they play?" Fast: one tap per player.
2. **Squad Update (Attributes)** — every two months, everyone rates each
   player's long-term attributes out of 99, based on their position.

All of the maths lives in [`lib/runitback/queries.ts`](lib/runitback/queries.ts)
and [`lib/runitback/config.ts`](lib/runitback/config.ts).

---

## 1. The two rating inputs

### A) Match Ratings (1–10, every game)

After each match you rate every teammate you played with **once**, giving a
single score out of 10 for how they played. No attributes — just a number.
That's 17 quick taps instead of 100+ slider drags.

These scores are the player's **form**. They're recency-weighted (each score
halves in influence every 21 days) so a hot streak shows up fast and an old
bad game fades.

### B) Attribute Ratings (1–99, every two months)

Attribute updates open during six windows a year — **January, March, May,
July, September, November** — mirroring EA's ratings refreshes. During an open
window, everyone can rate each player's six attributes (and a GK rating for
keepers) out of 99:

```
PACE · SHOOTING · PASSING · DRIBBLING · DEFENDING · PHYSICAL   (+ GK)
```

Each submission is editable until the window closes. A player's shown card
is the **average of everyone's submissions from the most recent window** —
so each window effectively re-issues the card, just like a real FIFA update.

Windows are stored keyed `YYYY-MM` (e.g. `2026-07`). See `getOpenWindow`,
`getNextWindow`, and `UPDATE_MONTHS` in `config.ts`.

---

## 2. Position-weighted overall

Everyone shares the same six attributes so cards stay comparable, but **how
much each attribute counts toward the overall depends on the player's
position**. Defending barely moves a striker; shooting barely moves a
defender. Weights are defined in `POSITION_WEIGHTS` (each sums to 100):

| Position | Heaviest attributes |
|---|---|
| GK | Goalkeeping 45, Passing 15 |
| CB | Defending 30, Physical 25 |
| LB / RB | Defending 25, Pace 20, Passing 20 |
| CM | Passing 30, Dribbling 20 |
| CAM | Passing 30, Dribbling 25, Shooting 20 |
| LW / RW | Pace 25, Dribbling 25, Shooting 20 |
| ST | Shooting 30, Pace 20 |

The **attribute overall** is the position-weighted average of a player's
1–99 attributes. On the rate screen, a player's key attributes (weight ≥ 20)
are marked with a ★ so raters know what matters for that position.

**Goalkeepers:** while Hammad is the only keeper, he's rated on GK attributes
*and* the outfield attributes for wherever he plays, until there are two
permanent keepers.

---

## 3. Blending into the final Overall

```
statsOverall     = match-event performance (goals, assists, wins, MOTM, …), 60–99
attributeOverall = position-weighted average of the 1–99 attributes

attrWeight = min(0.85, 0.15 + attributeRaters × 0.18)
overall    = statsOverall × (1 − attrWeight) + attributeOverall × attrWeight
```

The more teammates who've rated a player's attributes, the more the card
leans on those attributes (they *are* the card). With few or no attribute
ratings, match stats carry the overall so thin samples don't skew it:

| Attribute raters | Attribute weight |
|---|---|
| 0 | 0% (pure stats) |
| 1 | 33% |
| 3 | 69% |
| 5+ | 85% (capped) |

### Form nudge

Recent **match ratings** then nudge the card ±3 between attribute windows, so
hot and cold streaks are felt without waiting two months for a refresh:

```
nudge = clamp((avgMatchRating − 5.5) / 4.5 × 3, −3, +3) × min(1, matchRatings / 4)
overall += nudge
```

5.5/10 is neutral. One good game can't swing a card — the nudge scales in
with how many scores back it.

### 0-game players

A player with **0 games this season** is capped at **75** no matter how high
their attributes — peer opinion alone can't outrank people who've shown up.

---

## 4. Card tiers

| Overall | Card |
|---|---|
| 85–99 | 🥇 Gold |
| 75–84 | 🥈 Silver |
| < 75 | 🥉 Bronze |

Plus **special, one-of-a-kind cards** that override the tier:

| Card | Who gets it |
|---|---|
| **TOTY** (icy blue) | Highest Overall this season, *among award-eligible players* |
| **Hero** | Top goal-scorer (excluding TOTY), *among award-eligible players* |
| **POTW** (in-form gold) | Best individual performance in the most recent week |
| **MOTM card** (orange) | Anyone with 3+ Man of the Match awards this season |
| **TOTS Gold** | Overall ≥ 88, 5+ goals, **and** award-eligible |

**Award-eligible** = played at least half of this season's matches, keeping
the marquee cards reserved for regulars.

---

## 5. Data model

Two tables replaced the old `peer_ratings` (kept as an archive):

- **`match_ratings`** — `(season, match_id, rater_id, ratee_id, score 1–10)`,
  unique per `(match, rater, ratee)`.
- **`attribute_ratings`** — `(season, rating_window, rater_id, ratee_id,
  pace…physical 1–99, goalkeeping?)`, unique per `(window, rater, ratee)`,
  upserted so raters can edit until the window closes.

The July 2026 window was seeded from the old attribute ratings (rescaled
1–10 → 1–99), and `match_ratings` was seeded from the old per-match averages,
so nothing was lost in the switch.

---

## 6. Summary of the redesign

1. **Per-match rating is now a single 1–10 score** — far faster to submit.
2. **Attributes are 1–99 and updated bimonthly**, like EA ratings windows.
3. **Overall is position-weighted** — a striker isn't dragged by defending.
4. **Recent form nudges the card ±3** between windows.
5. **0-game cap (75)** and **award eligibility** are retained.
