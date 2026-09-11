# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 14 (App Router, JavaScript, no TypeScript) single-purpose registration portal for a charity
walk event ("Camminata Benefica"). Public form to register participants (individually or in
groups/families) with per-category fees, payment by Stripe card checkout or cash on the day, plus a
password-gated admin panel to view/export/manage registrations. Data lives in Supabase (Postgres).
UI text and all user-facing content is in Italian.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm start        # run production build
```

There is no lint script, no test suite, and no TypeScript checking configured in this repo.

Environment variables (see `.env.example`) must be set in `.env.local` for local dev:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `ADMIN_PASSWORD`.

## Architecture

- **`app/page.js`** — public registration form (client component). Contains `CATEGORY_OPTIONS`,
  a UI-only mirror of the pricing used in `lib/pricing.js` purely to display prices — **the two
  must be kept in sync manually** whenever fees change.
- **`app/api/checkout/route.js`** — the only entry point that creates participant rows. Inserts one
  row per participant into `participants`, all sharing a single generated `group_id` (a
  registration can cover a family/group under one contact email). Then branches on total price and
  payment method:
  - total = 0 (all free categories) → marks the group `paid` immediately, no Stripe involved.
  - `payment_method: 'cash'` → leaves rows `pending`; confirmed later manually from `/admin`.
  - `payment_method: 'card'` → creates a single Stripe Checkout session for the group's total and
    stores `stripe_session_id` on the rows.
- **`app/api/webhook/route.js`** — Stripe webhook (`checkout.session.completed`). Verifies the
  signature against the **raw** request body and flips matching rows to `paid` by `stripe_session_id`.
  This is the *only* code path allowed to mark card payments as paid — the admin UI intentionally
  has no way to toggle card payment status by hand.
- **`lib/pricing.js`** — single source of truth for category fees (`CATEGORIES`), used by the
  checkout API to compute real amounts server-side. Never trust client-submitted amounts.
- **`lib/supabase.js`** — `getSupabaseAdmin()` builds a Supabase client with the `service_role` key
  (full DB access, bypasses RLS). Import this only inside `app/api/**` route handlers, never in
  client components — this key must never reach the browser.
- **`app/admin/*` + `app/api/admin/*`** — password-protected admin panel. Auth is a shared
  `ADMIN_PASSWORD` sent in the body of every admin API request (no session/cookie); each admin
  route re-checks the password itself. `app/api/admin/list` returns all rows (including
  soft-deleted); `delete` toggles `is_deleted` (soft delete/restore, nothing is ever hard-deleted);
  `mark-paid` toggles cash-group payment status only (rejects card payments); `update-note` sets a
  free-text note per row. CSV export happens client-side in `app/admin/page.js` from already-fetched
  data.
- **`app/api/ping/route.js`** — lightweight Supabase query hit by `.github/workflows/keep-alive.yml`
  (cron, Mon/Thu) to prevent the free-tier Supabase project from pausing due to inactivity.
- **`supabase/schema.sql`** — the `participants` table definition (run manually in the Supabase SQL
  editor; there is no migration tool). When adding columns, update this file AND write the
  idempotent `alter table ... add column if not exists` for existing deployed databases (see
  README.md history for the established pattern).

## Data model notes (`participants` table)

- One row per person; `group_id` links everyone in the same submission/payment.
- `payment_method`: `'card'` or `'cash'` — `'cash'` actually means "any in-person payment (cash or
  POS), confirmed manually at check-in", kept as `cash` internally for backward compatibility.
- `payment_status`: `'pending' | 'paid' | 'cancelled'`.
- `is_deleted`: soft-delete flag; deleted rows are excluded from the admin's main list and from CSV
  export but remain in the DB and are restorable.
- `category` is constrained by a DB check constraint (`adulto`, `bambino`, `senior`, `agevolata`) —
  keep `lib/pricing.js`, `supabase/schema.sql`, and `app/page.js`'s `CATEGORY_OPTIONS` consistent
  when changing categories.
- The `agevolata` category deliberately avoids asking for a disability/reason (GDPR Art. 9 sensitive
  data) — see the note in `lib/pricing.js` before changing this.
