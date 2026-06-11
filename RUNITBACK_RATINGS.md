# Run It Back — How Ratings & Cards Work

This explains how a player's **Overall** rating is calculated, how that
maps to a **card tier** (bronze/silver/gold/special), and why two
specific cases — Archis's blue card and Xami's 90 overall — happen
under the current rules.

All of this lives in [`lib/runitback/queries.ts`](lib/runitback/queries.ts).

---

## 1. Two ingredients: Stats Overall + Community Overall

Every player has up to two scores that get blended into one **Overall**:

### A) Stats Overall (0–99, based on what happened on the pitch)

Calculated per player from this season's matches:

| Component | Weight | Notes |
|---|---|---|
| Goals per game | 15 | |
| Assists per game | 15 | Equal to goals — passing counts as much as scoring |
| MOTM rate | 25 | % of games where they were Man of the Match |
| Win rate | 25 | % of games won |
| Games played factor | 20 | `min(games / 20, 1) × 20` — caps out at 20 games played |

These five numbers are summed (max 100) and rescaled to a **60–99**
range. If a player has **0 games**, Stats Overall defaults to **60**.

### B) Community Overall (0–99, based on peer ratings)

Teammates rate each player on 6 attributes (pace, shooting, passing,
dribbling, defending, physical) on a 1–10 scale. The average of all
ratings from all raters becomes the **community rating** (1–10), which
is rescaled to **60–99**.

---

## 2. Blending the two into "Overall"

```
weight = min(0.8, 0.3 + (number of teammates who rated you) × 0.15)
overall = StatsOverall × (1 - weight) + CommunityOverall × weight
```

So the more peers who have rated you, the more your Overall leans on
**community rating** rather than match stats:

| Ratings received | Community weight |
|---|---|
| 0 | 0% (pure stats) |
| 1 | 45% |
| 2 | 60% |
| 3 | 75% |
| 4+ | 80% (capped) |

### Special case: 0 games played

```
if (games === 0 && communityRating exists) {
  overall = min(CommunityOverall, 70)   // capped — peer opinion alone can't carry you
}
```

If you haven't played a single match, your Overall is based entirely on
peer ratings, but it's **capped at 70** — high praise from teammates
can't push a non-player above someone who's actually shown up.

---

## 3. Card tiers

Once `overall` is known, the card art is chosen:

| Overall | Card |
|---|---|
| 85–99 | 🥇 Gold |
| 75–84 | 🥈 Silver |
| < 75 | 🥉 Bronze |

Plus **special, one-of-a-kind cards** that override the tier above:

| Card | Who gets it |
|---|---|
| **TOTY** (blue/icy "Team of the Year") | The single player with the **highest Overall** this season, *among award-eligible players* |
| **Hero** | The top goal-scorer this season (excluding the TOTY player), *among award-eligible players* |
| **POTW** ("Player of the Week", in-form gold) | Best individual performance (goals/assists/MOTM/result) in the most recently played calendar week |
| **MOTM card** (orange) | Anyone with 3+ Man of the Match awards this season |
| **TOTS Gold** | Overall ≥ 88, 5+ goals, **and** award-eligible |

**Award-eligible** = played at least **half of this season's matches**.
This keeps TOTY/Hero/TOTS Gold reserved for regulars, regardless of how
high their Overall climbs.

---

## 4. Why Archis got the blue card with 1 goal (and the fix)

The blue card is **TOTY** — previously it was awarded to whoever had
the **highest Overall** among players with at least 1 game, regardless
of goal count. Goals only drive ~15% of the Stats component, and Stats
itself could be as little as 20% of Overall once a player had 3+ peer
ratings — so a single goal plus glowing peer ratings was enough.

**Fix applied:** TOTY/Hero/TOTS Gold now require the player to be
**award-eligible** (played ≥50% of this season's matches). A player
with only 1 appearance can no longer snag TOTY purely on peer ratings.

---

## 5. Why Xami was rated 90 despite not playing (and the fix)

Xami had **0 games this season**. Previously, a player with 0 games and
at least one peer rating got:

```
overall = CommunityOverall   (100% peer ratings, 0% match stats)
```

If teammates rated Xami highly on attributes (avg ~8.7/10), that mapped
to roughly `60 + ((8.7-1)/9) × 39 ≈ 93` — **purely from how good people
think he is**, with zero in-game evidence.

**Fix applied:** Overall for 0-game players is now **capped at 70**:

```
overall = min(CommunityOverall, 70)
```

So Xami's Overall is now `min(93, 70) = 70` — a respectable bronze/low
card, but it can no longer outrank regulars who've actually played.

---

## 6. Summary of changes made

1. **0-game cap**: Overall for players with 0 games this season is
   capped at 70, even with great peer ratings.
2. **Award eligibility**: TOTY, Hero, and TOTS Gold now require having
   played at least half of this season's matches (`awardsEligible`).

Both are in [`lib/runitback/queries.ts`](lib/runitback/queries.ts) —
search for `awardsEligible` and "capped".
