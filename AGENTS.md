# Haoken — Base44 setup notes

Next.js 16 (Turbopack) app — a marketing agency dashboard. Client/invoice/lead data is
stored in the browser (localStorage); crawled business leads are stored in PostgreSQL.

## Running here

`docker compose -f docker-compose.base44.yml up -d` starts three services:

1. **db** — PostgreSQL 16 (user/db: `haoken`, password: `haoken`, volume: `pgdata`).
2. **migrate** — one-shot `psql` run that creates the `business_leads` table from
   `scripts/migrate.sql`. Exits after migration.
3. **web** — built from `Dockerfile.web` (node:22-slim + Chromium for the crawler),
   bind-mounts the repo, runs `npm install` then `next dev -H 0.0.0.0 -p 3000`.
   Live reload is on (WATCHPACK_POLLING=true). Healthcheck probes `GET /`.

`DATABASE_URL=postgresql://haoken:haoken@db:5432/haoken` is set in compose.
`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` points puppeteer-core at the system Chromium.

## Secrets

- `GEMINI_API_KEY` — Google Gemini key from https://aistudio.google.com/apikey. Powers the AI
  routes (`/api/generate`, `/api/chat`, `/api/client-brief`, `/api/studio`). The dashboard boots
  without it; those routes return 500 if the key is missing. Delivered via `/run/base44/app.env`.
- Meta lead import (`/api/meta-leads`) takes an ad account ID + access token per request and does
  not persist them — no server secret needed.

## Lead Finder

- `app/lead-finder/page.tsx` — UI for searching Google Maps and importing leads.
- `app/api/lead-finder/route.ts` — GET (list saved), POST (crawl + save), DELETE (remove).
- `lib/lead-crawler.ts` — Puppeteer-core crawler that renders Google Maps search results,
  scrolls the feed, and extracts business name/category/rating/reviews/website.
- Crawled businesses are stored in PostgreSQL (`business_leads` table) and can be imported
  into the agency localStorage as prospek.

## Next.js preview origin

`next.config.ts` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` and
`serverExternalPackages: ["pg", "puppeteer-core"]` so the preview origin is allowed and
native packages aren't bundled.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
