# MotoScout

Find bikes fast. Alerts + Deal feed.

## Overview

MotoScout is a motorcycle listing aggregator and alert system that monitors Dubizzle and Facebook Marketplace for new listings matching your saved searches.

## Features

- **Saved Searches**: Create custom search criteria for Dubizzle
- **Facebook Watchlist**: Monitor specific Facebook Marketplace URLs
- **Real-time Alerts**: Get Telegram notifications for new listings
- **Deal Feed**: Browse, favorite, and ignore listings
- **Private Access**: Email allowlist authentication

## Environment Variables

Add these to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MotoScout Access Control
MOTOSCOUT_ALLOWED_EMAIL=your@email.com

# Telegram Bot (for alerts)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Database Setup

1. Run the migration in Supabase SQL Editor:

```bash
# Copy the contents of motoscout/migrations/001_initial_schema.sql
# and execute in Supabase SQL Editor
```

2. Enable RLS policies (included in migration)

## Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Start a chat with your bot
4. Get your chat ID by visiting: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Add both to `.env.local`

## Running Scanners Locally

```bash
# Install dependencies
npm install

# Run all scanners
npm run motoscout:scan

# Run individual scanners
npm run motoscout:scan-dubizzle
npm run motoscout:scan-facebook
```

## GitHub Actions Setup

The scanner runs automatically every 30 minutes via GitHub Actions.

Add these secrets to your GitHub repository:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Facebook Limitations

Facebook Marketplace scraping has limitations:
- No authentication bypass
- No captcha solving
- No stealth plugins
- Listings may be blocked by Facebook's anti-bot measures
- Watchlist items will be marked as `BLOCKED` if inaccessible

## Architecture

- **Frontend**: Next.js 15 with App Router
- **Database**: Supabase Postgres with RLS
- **Auth**: Supabase Auth with email allowlist
- **Scanners**: Node.js scripts with cheerio
- **Notifications**: Telegram Bot API
- **Automation**: GitHub Actions cron

## Theme

MotoScout uses an isolated "rider cockpit" theme that doesn't affect the main zee.build site.
