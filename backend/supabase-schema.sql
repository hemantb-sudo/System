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
  user_name   TEXT DEFAULT 'Hemant Bhadoria',
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

-- Generic key/value store backing the Admin Settings module (CRM, Account Setup,
-- Security, etc.) — one row per settings row-card, keyed by "<section>::<row name>".
CREATE TABLE IF NOT EXISTS admin_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Day Planner: My Day tasks ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dp_tasks (
  id                   TEXT PRIMARY KEY,             -- 'tk_...'
  title                TEXT NOT NULL,
  description          TEXT DEFAULT '',
  time                 TEXT DEFAULT '',               -- free-text 'HH:MM'
  start_date           DATE NOT NULL,
  expected_close_date  DATE,
  status               TEXT NOT NULL DEFAULT 'Me',    -- Me | At Product | In Dev | ... | Closed | custom
  closed_date          DATE,
  assignee             TEXT DEFAULT '',
  task_state           TEXT NOT NULL DEFAULT 'Open',  -- Open | Hold | Closed — separate from `status` (Task Owner)
  order_index          INTEGER,                        -- manual drag-and-drop priority among open tasks; NULL = unset, falls back to creation order
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE dp_tasks ADD COLUMN IF NOT EXISTS assignee TEXT DEFAULT '';
ALTER TABLE dp_tasks ADD COLUMN IF NOT EXISTS task_state TEXT NOT NULL DEFAULT 'Open';
ALTER TABLE dp_tasks ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Custom statuses the user has added via the "+ Add new status…" option.
CREATE TABLE IF NOT EXISTS dp_custom_statuses (
  name TEXT PRIMARY KEY
);

-- Assignees the user has added via the "+ Add new assignee…" option (independent
-- of dp_custom_statuses — a separate, unrelated list).
CREATE TABLE IF NOT EXISTS dp_custom_assignees (
  name TEXT PRIMARY KEY
);

-- Audit log: one row per create/change/delete on a My Day task or Team Tracker
-- item, newest first. Mirrors wf_log's shape/replace-on-save pattern.
CREATE TABLE IF NOT EXISTS dp_audit_log (
  id      BIGSERIAL PRIMARY KEY,
  ts      BIGINT NOT NULL,      -- epoch millis
  action  TEXT NOT NULL,        -- short label, e.g. 'Task created'
  detail  TEXT NOT NULL         -- full human-readable sentence
);

-- ── Team Tracker: manually tracked external-team items ───────────────────────
CREATE TABLE IF NOT EXISTS dp_tracker_items (
  id         TEXT PRIMARY KEY,                       -- 'tr_...'
  title      TEXT NOT NULL,
  team       TEXT DEFAULT 'Other Team',
  status     TEXT NOT NULL DEFAULT 'Pending',         -- Pending | In Progress | Blocked | Done
  due_date   DATE,
  notes      TEXT DEFAULT '',
  assignee   TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE dp_tracker_items ADD COLUMN IF NOT EXISTS assignee TEXT DEFAULT '';

-- ── Workflow Builder: workflows ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wf_workflows (
  id         TEXT PRIMARY KEY,                       -- 'wf_...'
  name       TEXT NOT NULL,
  trigger    TEXT NOT NULL,                           -- Task Added | Task Status Changed | Task Closed | Task Moved to Team
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ordered steps per workflow.
CREATE TABLE IF NOT EXISTS wf_steps (
  id          TEXT PRIMARY KEY,                       -- 'st_...'
  workflow_id TEXT NOT NULL REFERENCES wf_workflows(id) ON DELETE CASCADE,
  step_order  INTEGER NOT NULL,                        -- drives execution order + drag-drop position
  type        TEXT NOT NULL,                           -- Add Follow-up Task | Set Status To | Set Expected Closure (+days) | Wait (days) | Show Notification
  detail      TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_wf_steps_workflow ON wf_steps(workflow_id, step_order);

-- Automation activity log ("Show Notification" runs).
CREATE TABLE IF NOT EXISTS wf_log (
  id      BIGSERIAL PRIMARY KEY,
  ts      BIGINT NOT NULL,                             -- epoch millis
  message TEXT NOT NULL
);

-- Paused "Wait" runs awaiting resume.
CREATE TABLE IF NOT EXISTS wf_pending_runs (
  id              TEXT PRIMARY KEY,                    -- 'pend_...'
  workflow_id     TEXT NOT NULL REFERENCES wf_workflows(id) ON DELETE CASCADE,
  workflow_name   TEXT NOT NULL,                        -- snapshot, survives a rename/delete of the workflow
  task_id         TEXT,                                 -- dp_tasks.id that triggered the run, if any
  resume_at       DATE NOT NULL,
  next_step_index INTEGER NOT NULL
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
