-- Run this entire file in your Supabase SQL Editor (one paste, one run)

CREATE TABLE IF NOT EXISTS mets_pricing (
  field TEXT PRIMARY KEY,
  value TEXT DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS mets_pools (
  pool  TEXT PRIMARY KEY,
  label TEXT,
  total DOUBLE PRECISION DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mets_channels (
  pool    TEXT,
  channel TEXT,
  balance DOUBLE PRECISION DEFAULT 0,
  PRIMARY KEY (pool, channel)
);

CREATE TABLE IF NOT EXISTS mets_wa_region_balances (
  pool     TEXT NOT NULL,
  region   TEXT NOT NULL,
  category TEXT NOT NULL,
  balance  DOUBLE PRECISION DEFAULT 0,
  PRIMARY KEY (pool, region, category)
);

CREATE TABLE IF NOT EXISTS mets_sms_type_balances (
  pool     TEXT NOT NULL,
  sms_type TEXT NOT NULL,
  balance  DOUBLE PRECISION DEFAULT 0,
  PRIMARY KEY (pool, sms_type)
);

CREATE TABLE IF NOT EXISTS mets_audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  ts          BIGINT DEFAULT extract(epoch from now())::bigint,
  action      TEXT,
  pool        TEXT,
  channel     TEXT,
  region      TEXT,
  category    TEXT,
  amount      DOUBLE PRECISION,
  reason      TEXT,
  notes       TEXT,
  details     TEXT,
  description TEXT,
  user_name   TEXT DEFAULT 'Rahul Anand',
  department  TEXT DEFAULT 'Admin',
  ip          TEXT,
  status      TEXT DEFAULT 'Success'
);

CREATE TABLE IF NOT EXISTS mets_transit (
  id               BIGSERIAL PRIMARY KEY,
  job_id           TEXT UNIQUE NOT NULL,
  ts               BIGINT DEFAULT extract(epoch from now())::bigint,
  feature          TEXT,
  channel          TEXT,
  region           TEXT,
  category         TEXT,
  sms_type         TEXT,
  requested_amount DOUBLE PRECISION DEFAULT 0,
  held_amount      DOUBLE PRECISION DEFAULT 0,
  credits_held     DOUBLE PRECISION DEFAULT 0,
  source_breakdown JSONB DEFAULT '{}',
  status           TEXT DEFAULT 'held',
  pingback_ts      BIGINT,
  pingback_status  TEXT
);

CREATE TABLE IF NOT EXISTS mets_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '{}'
);

-- ── Seed pools ────────────────────────────────────────────────────────────────
INSERT INTO mets_pools (pool, label, total) VALUES
  ('unallocated',   'Unallocated',   0),
  ('allocated',     'Allocated',     0),
  ('committed',     'Committed',     0),
  ('complementary', 'Complementary', 0),
  ('testing',       'Testing',       0)
ON CONFLICT (pool) DO NOTHING;

-- ── Seed default pricing ──────────────────────────────────────────────────────
INSERT INTO mets_pricing (field, value) VALUES
  ('Email (CPM)',                   '0'),
  ('SMS Domestic (CPS)',            '0'),
  ('SMS International (CPS)',       '0'),
  ('WhatsApp Service (CPS)',        '0'),
  ('WhatsApp Marketing (CPS)',      '0'),
  ('WhatsApp Utility (CPS)',        '0'),
  ('WhatsApp Authentication (CPS)', '0'),
  ('Niaa (CPS)',                    '0'),
  ('Mio AI Guide (CPS)',            '0'),
  ('Mio AI Voice Cost Per Pulse',   '0'),
  ('Mio AI Coach (CPS)',            '0')
ON CONFLICT (field) DO NOTHING;

-- ── Seed channels (4 pools × 7 channels) ─────────────────────────────────────
INSERT INTO mets_channels (pool, channel, balance)
SELECT p.pool, c.channel, 0
FROM (VALUES ('allocated'),('committed'),('complementary'),('testing')) AS p(pool)
CROSS JOIN (VALUES ('email'),('sms'),('whatsapp'),('niaa'),('guide'),('voice'),('coach')) AS c(channel)
ON CONFLICT (pool, channel) DO NOTHING;
