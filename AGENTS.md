# Haoken — Base44 setup notes

Next.js 16 (Turbopack) app — a marketing agency dashboard. All client/invoice/lead data is
stored in the browser (localStorage); there is no database.

## Running here

`docker compose -f docker-compose.base44.yml up -d` starts a `node:22-slim` container that
bind-mounts the repo, runs `npm install`, then `next dev -H 0.0.0.0 -p 3000`. Live reload is on
(WATCHPACK_POLLING=true for bind-mount reliability). Healthcheck probes `GET /`.

## Secrets

- `GEMINI_API_KEY` — Google Gemini key. Only the AI API routes need it (`/api/generate`,
  `/api/chat`, `/api/client-brief`, `/api/studio`). The dashboard boots and renders fine without
  it; those routes return a 500 if the key is missing. A dev placeholder is in
  `.env.base44-defaults`; the real value lives in `/run/base44/app.env` (override wins).
- Meta lead import (`/api/meta-leads`) takes an ad account ID + access token per request and does
  not persist them — no server secret needed.

## Next.js preview origin

`next.config.ts` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin
is allowed for dev assets/HMR. Do not hardcode the host.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
