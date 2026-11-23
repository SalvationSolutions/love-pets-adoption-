# Loving Pets Adaptation

A friendly, responsive pet adoption platform built for Cloudflare Pages + D1.

## Features
- Public pet directory with search and species filters
- Pet profile details and adoption-interest application
- Application screening questions (home, household agreement, pet experience, existing animals, care plan)
- Admin application review with status updates
- D1-backed API; public browsing gracefully falls back to sample pets until configured

## Deploy
1. Create a Cloudflare D1 database named `loving-pets-adoption`.
2. Apply `migrations/0001_initial.sql`:
   ```sh
   npx wrangler d1 execute loving-pets-adoption --remote --file=migrations/0001_initial.sql
   ```
3. Set `DB` as a D1 binding named `DB` in the Pages project.
4. Set a strong `ADMIN_API_KEY` Pages secret. Admin API requests use `Authorization: Bearer <key>`.
5. Deploy this repository to Cloudflare Pages. Build command: none. Build output directory: `/`.

For local development:
```sh
npm install
npx wrangler pages dev .
```

## Admin API
- `GET /api/admin/applications` — list applications (requires admin key)
- `PATCH /api/admin/applications/:id` — set status to `reviewing`, `approved`, `declined`, or `completed` (requires admin key)

Do not expose the admin key in frontend JavaScript. Use an authenticated admin proxy or make admin requests from a trusted environment.

## Privacy and screening
Applications are reviewed by a person. Screening answers are intended to support a conversation about responsible care, not to automatically reject applicants based on sensitive personal traits. Collect only information needed to assess readiness and arrange a safe adoption.
