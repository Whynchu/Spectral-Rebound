# Hosted Leaderboard Plan (Free Tier)

## Recommended stack

- **API + DB**: Supabase (free Postgres + auth + row-level security).
- **Write path**: Cloudflare Worker or Supabase Edge Function to validate and write scores.
- **Read path**: Public endpoint for `daily` and `all_time` top-10 queries.

## Data model

- Table `scores`:
  - `id` (uuid primary key)
  - `player_name` (text, capped length)
  - `score` (int)
  - `room` (int)
  - `run_started_at` (timestamp)
  - `submitted_at` (timestamp default now)
  - `run_hash` (text, optional anti-replay token)

## Query views

- `top_all_time_everyone`: top 10 by score desc.
- `top_daily_everyone`: top 10 where `submitted_at` is today (UTC or chosen timezone).
- `top_all_time_personal`: filter by `player_name`.
- `top_daily_personal`: filter by `player_name` and day.

## Basic anti-cheat (lightweight)

- Validate payload schema and clamp impossible values.
- Reject duplicate `run_hash`.
- Add per-IP rate limit in Worker.
- Keep anonymous writes allowed, but sign requests with a server-side secret from the Worker.

## Client integration notes

- Keep local leaderboard as fallback when network is unavailable.
- Add a `pending_submissions` queue in localStorage and retry on next launch.
- Show a small sync state in the leaderboard modal (`LOCAL`, `SYNCED`, `OFFLINE`).
