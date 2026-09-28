CREATE TABLE IF NOT EXISTS business_leads (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT,
  rating          NUMERIC,
  review_count    INTEGER,
  address         TEXT,
  phone           TEXT,
  website         TEXT,
  source          TEXT NOT NULL DEFAULT 'Google Maps',
  search_query    TEXT,
  search_location TEXT,
  imported        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name, address)
);
