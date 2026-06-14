# Cloud Cowboy — CRM & Investor Portal

## Phase 1 — Internal CRM (`/crm`)
Interactive lead CRM seeded with the 259 enriched Colorado ag applicators.
- US lead map (`react-simple-maps`, geometry bundled locally) — zoom, pan, hover, click.
- 7-stage pipeline, interaction log, mass-email composer.
- Code-split so lead data never ships in the public marketing bundle.

## Phase 2 — Backend (Supabase) — CODE COMPLETE, needs your setup
Stack: **Supabase** (Postgres + magic-link auth + RLS + edge functions) and
**Resend** for mass email.

What's built:
- Magic-link sign in (`/login`), investor **request access** (`/investors`),
  admin **approve/deny** screen (`/admin`).
- `/crm` and `/admin` are gated to **admin** users; investors are allow-listed
  but can't see the CRM. Access is enforced by **row-level security**, not just UI.
- CRM reads/writes leads + interactions in Postgres when configured; falls back
  to Phase-1 local mode when not.
- `send-bulk` edge function sends real email via Resend and logs each touch.

> Everything is **env-guarded**: until you set the two `VITE_SUPABASE_*` vars,
> the site runs exactly as Phase 1 (no auth, local data). Nothing breaks.

### Setup checklist (~15 min)
1. **Create a Supabase project** at supabase.com → copy its **Project URL** and
   **anon public key** (Settings → API).
2. **Run the SQL.** In the Supabase SQL editor, paste and run
   `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
   (The seed makes `chris@cloudcowboy.us` the first admin and loads all 259 leads.)
3. **Frontend env vars.** Add to `.env.local` (and to your CI/build secrets):
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
4. **Auth settings (Supabase → Authentication).**
   - URL config → add your site URL + `http://localhost:8080` to redirect allow-list.
   - Email provider works out of the box; for production, set up custom SMTP.
5. **Mass email (Resend).**
   - Create a Resend account, verify your sending domain, copy the API key.
   - Deploy the function: `supabase functions deploy send-bulk`
   - Set its secrets:
     ```
     supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Cloud Cowboy <hello@cloudcowboy.us>"
     ```
     (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.)
6. **Test the flow.** Visit `/login`, sign in as `chris@cloudcowboy.us` → you land
   in `/crm` and `/admin`. Submit a test request at `/investors`, approve it in
   `/admin`, then sign in as that email to confirm investor access.

### Data classification (per Venture OS rules)
Lead PII + investor data = **Sensitive**. It now lives in Postgres behind RLS,
not in the static bundle. The Resend key + service-role key stay server-side in
the edge function — never in the client.

### Swapping the data layer
`src/lib/crm-store.tsx` and `src/lib/auth.tsx` are the only seams. They already
branch on `isSupabaseConfigured`; no component changes needed.
