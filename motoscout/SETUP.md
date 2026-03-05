# MotoScout Setup Guide

Complete setup instructions for MotoScout motorcycle listing aggregator.

## Prerequisites

- Node.js 20+
- Supabase account
- Telegram account (for alerts)
- GitHub repository (for automated scanning)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to be ready

### 1.2 Run Database Migration

1. Open Supabase SQL Editor
2. Copy contents of `motoscout/migrations/001_initial_schema.sql`
3. Execute the SQL
4. Verify tables are created:
   - `motoscout_saved_searches`
   - `motoscout_facebook_watchlist`
   - `motoscout_listings`
   - `motoscout_listing_actions`
   - `motoscout_scan_requests`

### 1.3 Get Supabase Credentials

1. Go to Project Settings > API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### 1.4 Enable Email Auth

1. Go to Authentication > Providers
2. Enable Email provider
3. Disable email confirmation (or configure SMTP)

### 1.5 Create User Account

1. Go to Authentication > Users
2. Click "Add user"
3. Enter your email and password
4. This email will be your allowlisted access

## Step 2: Telegram Bot Setup

### 2.1 Create Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow prompts to create bot
4. Copy the bot token → `TELEGRAM_BOT_TOKEN`

### 2.2 Get Chat ID

1. Start a chat with your new bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find `"chat":{"id":123456789}` in the response
5. Copy the ID → `TELEGRAM_CHAT_ID`

## Step 3: Environment Variables

Create `.env.local` in project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MotoScout Access Control
MOTOSCOUT_ALLOWED_EMAIL=your@email.com

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789
```

⚠️ **Important**: Never commit `.env.local` to git!

## Step 4: GitHub Actions Setup

### 4.1 Add Repository Secrets

1. Go to your GitHub repository
2. Settings > Secrets and variables > Actions
3. Add these secrets:
   - `SUPABASE_URL` (same as NEXT_PUBLIC_SUPABASE_URL)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

### 4.2 Enable GitHub Actions

1. Go to Actions tab
2. Enable workflows if prompted
3. The scanner will run every 30 minutes automatically

### 4.3 Manual Trigger

You can manually trigger a scan:
1. Go to Actions tab
2. Select "MotoScout Scanner" workflow
3. Click "Run workflow"

## Step 5: Local Development

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Run Development Server

```bash
npm run dev
```

### 5.3 Access MotoScout

1. Open http://localhost:3000/motoscout
2. Login with your Supabase user credentials
3. Start creating searches!

### 5.4 Test Scanners Locally

```bash
# Run all scanners
npm run motoscout:scan

# Run individual scanners
npm run motoscout:scan-dubizzle
npm run motoscout:scan-facebook
```

## Step 6: Usage

### 6.1 Create Saved Searches

1. Go to Saved Searches
2. Click "New Search"
3. Fill in criteria (brand, model, price, etc.)
4. Save

### 6.2 Add Facebook Watchlist

1. Go to Facebook Watchlist
2. Click "Add URL"
3. Paste Facebook Marketplace URL
4. Save

⚠️ **Note**: Facebook may block automated access. Items will be marked as BLOCKED if inaccessible.

### 6.3 Browse Listings

1. Go to Listings Feed
2. Use filters to narrow results
3. Favorite or ignore listings
4. Click "View" to open original listing

### 6.4 Receive Alerts

- New listings matching your searches will trigger Telegram alerts
- Alerts include title, price, source, and link
- Scanner runs every 30 minutes via GitHub Actions

## Troubleshooting

### No listings appearing

- Check that searches are marked as ACTIVE
- Verify GitHub Actions is running (check Actions tab)
- Check scanner logs in GitHub Actions
- Test scanners locally with `npm run motoscout:scan`

### Telegram alerts not working

- Verify bot token and chat ID are correct
- Test by visiting: `https://api.telegram.org/bot<TOKEN>/getMe`
- Make sure you've sent at least one message to the bot
- Check GitHub Actions logs for errors

### Facebook watchlist blocked

- This is expected behavior
- Facebook blocks automated access
- Items will be marked as BLOCKED
- No workaround without violating Facebook's terms

### Authentication issues

- Verify email is in `MOTOSCOUT_ALLOWED_EMAIL`
- Check Supabase user exists
- Try resetting password in Supabase dashboard

### Database errors

- Verify migration ran successfully
- Check RLS policies are enabled
- Ensure service role key is correct

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (zee.build)    │
└────────┬────────┘
         │
         ├─── /motoscout (isolated theme)
         │    ├─── login
         │    ├─── dashboard
         │    ├─── searches
         │    ├─── facebook
         │    └─── listings
         │
         ├─── API Routes
         │    ├─── /api/motoscout/searches
         │    ├─── /api/motoscout/facebook
         │    ├─── /api/motoscout/listings
         │    └─── /api/motoscout/scan-now
         │
         └─── Supabase (Postgres + Auth + RLS)

┌──────────────────┐
│ GitHub Actions   │
│  (every 30 min)  │
└────────┬─────────┘
         │
         ├─── scan-dubizzle.ts
         ├─── scan-facebook-watchlist.ts
         └─── notify-telegram.ts
         │
         └─── Supabase (insert listings)
                │
                └─── Telegram Bot (send alerts)
```

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS - keep secret!
- Only use service role key in GitHub Actions and scanner scripts
- Never expose service role key in client-side code
- Email allowlist prevents unauthorized access
- RLS policies ensure users only see their own data

## Maintenance

### Update allowlisted emails

Edit `.env.local`:
```env
MOTOSCOUT_ALLOWED_EMAIL=email1@example.com,email2@example.com
```

### Adjust scan frequency

Edit `.github/workflows/motoscout-scan.yml`:
```yaml
schedule:
  - cron: '*/30 * * * *'  # Change to desired frequency
```

### Monitor usage

- Check Supabase dashboard for database size
- Monitor GitHub Actions usage (free tier: 2000 min/month)
- Review Telegram bot message limits

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review Supabase logs
3. Test scanners locally
4. Check this documentation

## License

Part of zee.build portfolio project.
