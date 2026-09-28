# Haoken

Marketing agency dashboard for clients, invoices, campaigns, leads, and Gemini automations.

## Run

```bash
npm install
cp .env.example .env.local
```

Put a Gemini API key in `.env.local`, then:

```bash
npm run dev
```

Open http://localhost:3000.

Clients, invoices, and leads are stored in the browser. Meta lead import uses an ad account ID and access token that are sent once and not saved. Image ads use Gemini's image models and need image quota on that key.
