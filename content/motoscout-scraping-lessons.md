# MotoScout: Lessons in Ethical Scraping

**April 2026** · 2 min read

MotoScout monitors Dubizzle and Facebook Marketplace for motorcycle listings. Building it taught me where the line is between useful automation and platform abuse.

## The Architecture

Every 30 minutes, a GitHub Action runs two scanners:

1. **Dubizzle scanner** — Builds search URLs from saved criteria, fetches HTML, parses with cheerio
2. **Facebook scanner** — Attempts to fetch marketplace URLs, gracefully handles blocks

New listings get inserted into Supabase with deduplication. Each new match triggers a Telegram alert.

## What Works

Dubizzle is scraping-friendly. The HTML is semantic, the rate limits are reasonable, and the data is public. With random jitter between requests, the scanner runs reliably.

## What Doesn't

Facebook blocks everything. No login bypass, no captcha solving, no stealth plugins. The scanner marks watchlist items as BLOCKED and moves on. This is by design — I won't build tools that violate platform terms.

## Key Decisions

- **Rate limiting with jitter** — 1-3 second random delays between requests
- **Deduplication by URL** — Unique constraint on source_url prevents duplicates
- **Graceful degradation** — If a source is blocked, the rest of the scan continues
- **Telegram over email** — Instant, no spam folder, easy to set up

## The Takeaway

Scraping is a tool. Like any tool, it can be used responsibly or abusively. MotoScout stays on the right side by respecting rate limits, not bypassing auth, and accepting when a platform says no.

---

*Source: [github.com/zee-build/zee.build](https://github.com/zee-build/zee.build)*
