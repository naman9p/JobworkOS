# JobworkOS

JobworkOS is a responsive manufacturing job-work management prototype for coordinating outsourced production, material custody, quality, reconciliation, and supplier performance.

## Included

- Next.js App Router, React, TypeScript, Tailwind CSS and Lucide icons
- Enterprise operations dashboard and responsive navigation
- Job orders, workflow detail, suppliers and supplier workbench
- Material movement ledger with separate receipt acknowledgement records
- Reconciliation, inspections, alerts and operational reports
- Supabase SSR client, normalized PostgreSQL migration, RLS foundation and Zod validation
- Automated tests for reconciliation, inspection validation, transitions and closure
- Clearly identified demo records in `src/lib/demo-data.ts`

The interface runs immediately using demo records. Supabase is the persistent production target.

## Local setup

1. Install Node.js 20 or newer and run `npm install`.
2. Copy `.env.example` to `.env.local` and add Supabase values.
3. Run `npm run dev`, then open `http://localhost:3000`.
4. Validate with `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build`.

## Supabase setup

1. Create a hosted Supabase project.
2. Apply `supabase/migrations/202611230001_initial.sql` in the SQL editor, or link the Supabase CLI and run `supabase db push`.
3. Enable the Email provider and add localhost plus the Vercel domain to Auth redirect URLs.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
5. Create demo Auth users in the dashboard. Insert matching `user_profiles` rows using their Auth UUIDs and one role: `administrator`, `planner`, `store`, `supplier`, `quality_inspector`, or `manager`.
6. Create the manufacturer organization first, then associate profiles and operational records to its UUID.

Suggested demo users are one per role plus one per supplier. Use temporary passwords delivered securely; never commit credentials.

## Security model

The migration provides UUID keys, foreign keys, quantity constraints, indexes, organization scoping, immutable movement events and RLS-enabled tables. `current_org()` anchors tenant policies. Before production use, complete supplier-assignment-specific select policies, mutation policies for every role, Storage policies, audit triggers and transactional RPCs.

## GitHub and Vercel

1. Run `git init`, commit the source and push it to GitHub.
2. In Vercel, import that repository as a new project; keep the detected Next.js defaults.
3. Add variables from `.env.example` for Preview and Production.
4. Deploy and add the final Vercel URL to Supabase Auth redirects.
5. Verify each role and the create → dispatch → receipt → progress → return → inspect → reconcile → close workflow.

## Prototype boundaries

Signup, sign-in, sign-out and job creation/list/detail use Supabase. Apply both migrations in `supabase/migrations` and configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` on the deployment. Enable email/password Auth and configure email confirmation in Supabase. New users get a private workspace with the planner role on their first order; existing memberships are preserved. No service-role key is used by these flows.

Verify signup confirmation, invalid credentials, sign-in name, job creation confirmation, refresh persistence, search by job ID/title, and opening a saved order. Also verify a second account cannot see the first account's orders. Local end-to-end database verification requires a configured Supabase project.

Overview and Reports read saved orders. Other operational screens still contain demo data. Complete supplier-specific policies, remaining workflow mutations, document uploads and transactional workflow RPCs before treating those screens as live operational records.

### Team access and samples

Apply all migrations in filename order, including `202611240003_team_samples.sql`. This migration adds ten `[Sample]` orders per existing workspace and seeds new workspaces once. It preserves real orders and uses stable SAMPLE IDs to avoid duplicate seeds. The samples are included in the overview counts.

Members can open Settings / Workspace & Team and share their workspace join code privately. New teammates sign up/sign in separately and enter the code on that page. This grants the planner role in the invited workspace. An account already containing real orders or other team members cannot switch via this flow; share its own workspace code instead. Orders are never globally exposed to unrelated signups.

Supabase's built-in email sender is intended for testing and has a low project-wide limit. Configure Custom SMTP in Supabase Auth for friends/public signups and configure the email rate limit to suit that provider. The app cannot raise the hosted provider limit. Configure the production Site URL and permitted redirect URLs in Supabase Auth as well.
