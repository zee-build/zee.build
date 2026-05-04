-- ═══════════════════════════════════════════════════════════
-- ASCEND OS — Supabase Schema Migration (complete + idempotent)
-- Run in Supabase SQL Editor
--
-- Cron schedules (set in Supabase Cron dashboard, all UTC):
--   morning-briefing : 25 1 * * *    →  1:25 AM UTC = 5:25 AM Dubai
--   evening-shame    : 30 17 * * *   →  5:30 PM UTC = 9:30 PM Dubai
--   weekly-review    : 30 16 * * 6   →  4:30 PM UTC Saturday = 8:30 PM Dubai Saturday
-- ═══════════════════════════════════════════════════════════

-- ─── Projects ───────────────────────────────────────────────
create table if not exists projects (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null unique,  -- unique name enables idempotent seed
  type                text, -- 'agency' | 'saas' | 'freelance' | 'learning' | 'job' | 'other'
  goal                text,
  weekly_hours_target int default 5,
  color               text default '#C9A84C',
  icon                text default '⚡',
  active              boolean default true,
  created_at          timestamptz default now()
);

-- ─── Daily habit logs ───────────────────────────────────────
create table if not exists habit_logs (
  id         uuid primary key default gen_random_uuid(),
  date       date not null default current_date,
  habit_id   text not null,
  completed  boolean default false,
  value      int default 0,
  created_at timestamptz default now(),
  unique (date, habit_id)  -- prevent duplicate logs per day
);

-- ─── Schedule block logs ────────────────────────────────────
create table if not exists block_logs (
  id               uuid primary key default gen_random_uuid(),
  date             date not null default current_date,
  block_index      int not null,
  completed        boolean default false,
  project_id       uuid references projects(id),
  work_description text,
  created_at       timestamptz default now(),
  unique (date, block_index)  -- one log per block per day
);

-- ─── Income entries ─────────────────────────────────────────
create table if not exists income_entries (
  id         uuid primary key default gen_random_uuid(),
  month      text not null,  -- 'YYYY-MM'
  stream     text not null,
  amount_aed numeric not null,
  note       text,
  created_at timestamptz default now()
);

-- ─── Habit streaks ──────────────────────────────────────────
create table if not exists streaks (
  id              uuid primary key default gen_random_uuid(),
  habit_id        text unique not null,
  current_streak  int default 0,
  longest_streak  int default 0,
  last_completed  date,
  updated_at      timestamptz default now()
);

-- ─── Journal entries ────────────────────────────────────────
create table if not exists journal_entries (
  id         uuid primary key default gen_random_uuid(),
  date       date not null default current_date,
  type       text,  -- 'block_insight' | 'weekly_review' | 'reading_note'
  question   text,
  answer     text,
  project_id uuid references projects(id),
  created_at timestamptz default now()
);

-- ─── Trade logs (OpenClaw) ──────────────────────────────────
create table if not exists trade_logs (
  id         uuid primary key default gen_random_uuid(),
  date       date not null default current_date,
  symbol     text,
  direction  text,
  pnl_aed    numeric,
  notes      text,
  created_at timestamptz default now()
);

-- ─── Key-value store (pipeline state, settings, etc.) ───────
create table if not exists kv_store (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz default now()
);

-- Seed initial pipeline state
insert into kv_store (key, value)
values ('internet_money_pipeline', '{"leads":0,"calls":0,"proposals":0,"closed":0}')
on conflict (key) do nothing;

-- ─── Add unique constraints to existing tables (idempotent) ──
-- Needed when tables were created without these constraints in a
-- prior migration. CREATE TABLE IF NOT EXISTS skips the column
-- definitions, so ALTER TABLE is required to backfill constraints.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'projects_name_key' and conrelid = 'projects'::regclass
  ) then
    alter table projects add constraint projects_name_key unique (name);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'habit_logs_date_habit_id_key' and conrelid = 'habit_logs'::regclass
  ) then
    alter table habit_logs add constraint habit_logs_date_habit_id_key unique (date, habit_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'block_logs_date_block_index_key' and conrelid = 'block_logs'::regclass
  ) then
    alter table block_logs add constraint block_logs_date_block_index_key unique (date, block_index);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'streaks_habit_id_key' and conrelid = 'streaks'::regclass
  ) then
    alter table streaks add constraint streaks_habit_id_key unique (habit_id);
  end if;
end $$;

-- ─── Performance indexes ─────────────────────────────────────
create index if not exists idx_habit_logs_date      on habit_logs (date);
create index if not exists idx_habit_logs_habit_id  on habit_logs (habit_id);
create index if not exists idx_block_logs_date      on block_logs (date);
create index if not exists idx_income_entries_month on income_entries (month);
create index if not exists idx_journal_entries_date on journal_entries (date);
create index if not exists idx_trade_logs_date      on trade_logs (date);

-- ─── Seed default projects (idempotent) ──────────────────────
insert into projects (name, type, goal, weekly_hours_target, color, icon) values
  ('tarbiya.ai',       'saas',      'Get to 163 paying subscribers at $9.99/mo',           10, '#f59e0b', '📖'),
  ('Internet Money',   'agency',    'Land first paying AI automation client in UAE',          8, '#4ade80', '🏦'),
  ('Yuze',             'job',       'Deliver quality work, build skills for job upgrade',    40, '#60a5fa', '⚡'),
  ('Job Hunt',         'job',       'Land AED 18-25K/month fintech role in UAE',              5, '#a78bfa', '💼'),
  ('OpenClaw Trading', 'other',     'Grow $100 to $1000 with automated strategy',             3, '#fb7185', '📊'),
  ('Pure Bean',        'other',     'Understand monthly profit, find ways to grow',           2, '#94a3b8', '☕')
on conflict (name) do nothing;

-- ─── Seed habit streaks (idempotent) ─────────────────────────
insert into streaks (habit_id, current_streak, longest_streak) values
  ('fajr',     0, 0),
  ('water',    0, 0),
  ('workout',  0, 0),
  ('leetcode', 0, 0),
  ('reading',  0, 0),
  ('tarbiya',  0, 0),
  ('job',      0, 0),
  ('sleep',    0, 0)
on conflict (habit_id) do nothing;

-- ─── Row Level Security ───────────────────────────────────────
-- ASCEND is a personal OS — only Zee uses it. RLS is not strictly
-- required, but disable by default to keep queries simple.
-- If you want RLS: enable it per table and add a policy for the
-- authenticated role (Supabase anon key is effectively Zee-only
-- since the URL is not publicly advertised).
--
-- Example (run manually if desired):
--   alter table habit_logs enable row level security;
--   create policy "Zee only" on habit_logs using (true);
