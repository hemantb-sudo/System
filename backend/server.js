const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { DatabaseSync } = require('node:sqlite');

const app  = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const FRONTEND = path.join(__dirname, '..', 'frontend');
const DB_PATH  = path.join(__dirname, 'database', 'mets.db');

// ── Database setup ────────────────────────────────────────────────────────────
const fs = require('fs');
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new DatabaseSync(DB_PATH);

// Enable WAL for performance
db.exec('PRAGMA journal_mode=WAL;');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS mets_pricing (
    field TEXT PRIMARY KEY,
    value TEXT DEFAULT '0'
  );

  CREATE TABLE IF NOT EXISTS mets_pools (
    pool  TEXT PRIMARY KEY,
    label TEXT,
    total REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS mets_channels (
    pool    TEXT,
    channel TEXT,
    balance REAL DEFAULT 0,
    PRIMARY KEY (pool, channel)
  );

  CREATE TABLE IF NOT EXISTS mets_wa_region_balances (
    pool     TEXT NOT NULL,
    region   TEXT NOT NULL,
    category TEXT NOT NULL,
    balance  REAL DEFAULT 0,
    PRIMARY KEY (pool, region, category)
  );

  CREATE TABLE IF NOT EXISTS mets_sms_type_balances (
    pool     TEXT NOT NULL,
    sms_type TEXT NOT NULL,
    balance  REAL DEFAULT 0,
    PRIMARY KEY (pool, sms_type)
  );

  CREATE TABLE IF NOT EXISTS mets_audit_logs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          INTEGER DEFAULT (unixepoch()),
    action      TEXT,
    pool        TEXT,
    channel     TEXT,
    region      TEXT,
    category    TEXT,
    amount      REAL,
    reason      TEXT,
    details     TEXT,
    description TEXT,
    user_name   TEXT DEFAULT 'Rahul Anand',
    department  TEXT DEFAULT 'Admin',
    ip          TEXT,
    status      TEXT DEFAULT 'Success'
  );

  CREATE TABLE IF NOT EXISTS mets_transit (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id           TEXT UNIQUE NOT NULL,
    ts               INTEGER DEFAULT (unixepoch()),
    feature          TEXT,
    channel          TEXT,
    region           TEXT,
    category         TEXT,
    sms_type         TEXT,
    requested_amount REAL DEFAULT 0,
    held_amount      REAL DEFAULT 0,
    credits_held     REAL DEFAULT 0,
    source_breakdown TEXT DEFAULT '{}',
    status           TEXT DEFAULT 'held',
    pingback_ts      INTEGER,
    pingback_status  TEXT
  );

  CREATE TABLE IF NOT EXISTS mets_settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '{}'
  );
`);

// Seed pools (only if not already present)
const pools = [
  { pool: 'unallocated',   label: 'Unallocated' },
  { pool: 'allocated',     label: 'Allocated' },
  { pool: 'committed',     label: 'Committed' },
  { pool: 'complementary', label: 'Complementary' },
  { pool: 'testing',       label: 'Testing' },
];
const insertPool = db.prepare(
  'INSERT OR IGNORE INTO mets_pools (pool, label, total) VALUES (?, ?, 0)'
);
for (const p of pools) insertPool.run(p.pool, p.label);

// Seed default pricing (only if not already present)
const defaultPricing = [
  { field: 'Email (CPM)',                    value: '0' },
  { field: 'SMS Domestic (CPS)',             value: '0' },
  { field: 'SMS International (CPS)',        value: '0' },
  { field: 'WhatsApp Service (CPS)',         value: '0' },
  { field: 'WhatsApp Marketing (CPS)',       value: '0' },
  { field: 'WhatsApp Utility (CPS)',         value: '0' },
  { field: 'WhatsApp Authentication (CPS)',  value: '0' },
  { field: 'Niaa (CPS)',                     value: '0' },
  { field: 'Mio AI Guide (CPS)',             value: '0' },
  { field: 'Mio AI Voice Cost Per Pulse',    value: '0' },
  { field: 'Mio AI Coach (CPS)',             value: '0' },
];
const insertPricing = db.prepare('INSERT OR IGNORE INTO mets_pricing (field, value) VALUES (?, ?)');
for (const p of defaultPricing) insertPricing.run(p.field, p.value);

// Seed channels for 4 pools × 7 channels
const channelPools = ['allocated', 'committed', 'complementary', 'testing'];
const channels     = ['email', 'sms', 'whatsapp', 'niaa', 'guide', 'voice', 'coach'];
const insertChan   = db.prepare(
  'INSERT OR IGNORE INTO mets_channels (pool, channel, balance) VALUES (?, ?, 0)'
);
for (const pool of channelPools) {
  for (const ch of channels) insertChan.run(pool, ch);
}

// ── Migration: add notes column if absent ────────────────────────────────────
{
  const cols = db.prepare("PRAGMA table_info(mets_audit_logs)").all();
  if (!cols.find(c => c.name === 'notes')) {
    db.exec("ALTER TABLE mets_audit_logs ADD COLUMN notes TEXT");
  }
}

// ── Migration: recalculate complementary pool total from audit logs ───────────
// Needed for data created before the fix that always updates pool total.
{
  const compRow = db.prepare("SELECT total FROM mets_pools WHERE pool = 'complementary'").get();
  if (compRow && compRow.total === 0) {
    const topups    = db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM mets_audit_logs WHERE pool='complementary' AND action='Complementary Credits'").get();
    const reversals = db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM mets_audit_logs WHERE pool='complementary' AND action IN ('METS Reversal','METS Deduction')").get();
    const net = (topups.s || 0) - (reversals.s || 0);
    if (net > 0) {
      db.prepare("UPDATE mets_pools SET total = ? WHERE pool = 'complementary'").run(net);
    }
  }
}

// ── Migration: add credits_held column to mets_transit if absent ─────────────
{
  const cols = db.prepare("PRAGMA table_info(mets_transit)").all();
  if (cols.length && !cols.find(c => c.name === 'credits_held')) {
    db.exec("ALTER TABLE mets_transit ADD COLUMN credits_held REAL DEFAULT 0");
  }
}

// ── Feature → channel map ─────────────────────────────────────────────────────
const FEAT_TO_CHANNEL = {
  'Email':        'email',
  'SMS':          'sms',
  'WhatsApp':     'whatsapp',
  'Niaa':         'niaa',
  'Mio AI Guide': 'guide',
  'Mio AI Voice': 'voice',
  'Mio AI Coach': 'coach',
};

// Reverse map: channel key → full display name used in reports
const CHANNEL_TO_FEAT = Object.fromEntries(
  Object.entries(FEAT_TO_CHANNEL).map(([feat, ch]) => [ch, feat])
);

// ── Prepared statements ───────────────────────────────────────────────────────
const stmtGetPools    = db.prepare('SELECT pool, label, total FROM mets_pools');
const stmtGetChannels = db.prepare('SELECT pool, channel, balance FROM mets_channels');

const stmtUpdatePool  = db.prepare(
  'UPDATE mets_pools SET total = total + ? WHERE pool = ?'
);
const stmtUpdateChan  = db.prepare(
  'UPDATE mets_channels SET balance = balance + ? WHERE pool = ? AND channel = ?'
);

const stmtInsertLog = db.prepare(`
  INSERT INTO mets_audit_logs
    (action, pool, channel, region, category, amount, reason, notes, details, description, ip, status, user_name, department)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Rahul Anand', 'Admin')
`);

// ── Serve frontend ────────────────────────────────────────────────────────────
app.use(express.static(FRONTEND));

// ── GET /api/mets/balances ────────────────────────────────────────────────────
app.get('/api/mets/balances', (req, res) => {
  const poolRows = stmtGetPools.all();
  const chanRows = stmtGetChannels.all();

  // Build a map of pool→channels
  const chanMap = {};
  for (const row of chanRows) {
    if (!chanMap[row.pool]) chanMap[row.pool] = {};
    chanMap[row.pool][row.channel] = row.balance;
  }

  const result = {};
  for (const row of poolRows) {
    const hasChannels = !!chanMap[row.pool];
    result[row.pool] = {
      label:       row.label,
      total:       row.total,
      hasChannels: hasChannels,
    };
    if (hasChannels) {
      result[row.pool].channels = chanMap[row.pool];
    }
  }

  // Include total soft-hold METS (sum of held_amount from active transit rows)
  const shRow = db.prepare("SELECT COALESCE(SUM(held_amount),0) AS t FROM mets_transit WHERE status='held'").get();
  result._softHoldTotal = shRow ? (shRow.t || 0) : 0;

  res.json(result);
});

// ── POST /api/mets/topup ──────────────────────────────────────────────────────
app.post('/api/mets/topup', (req, res) => {
  const { pool, features, totalAmount, poti, notes } = req.body;
  if (!pool || !totalAmount || totalAmount <= 0) {
    return res.status(400).json({ error: 'Invalid pool or amount' });
  }

  // Check pool exists
  const poolRow = db.prepare('SELECT pool, total FROM mets_pools WHERE pool = ?').get(pool);
  if (!poolRow) return res.status(400).json({ error: 'Unknown pool: ' + pool });

  // Total available METS = committed + unallocated + allocated + soft_hold (future)
  const totalRow = db.prepare(
    "SELECT COALESCE(SUM(total),0) AS t FROM mets_pools WHERE pool IN ('committed','unallocated','allocated')"
  ).get();
  const totalMETSBefore = totalRow.t || 0;
  const totalMETSAfter  = totalMETSBefore + totalAmount;

  // Pool balance before update (for complementary / testing total line)
  const poolBefore = poolRow.total || 0;
  const poolAfter  = poolBefore + totalAmount;

  const isComplementary = (pool === 'complementary');
  const isTesting       = (pool === 'testing');

  // Always update pool total
  stmtUpdatePool.run(totalAmount, pool);

  // Update channel balances for all pools
  if (Array.isArray(features)) {
    for (const feat of features) {
      const ch = FEAT_TO_CHANNEL[feat.name];
      if (ch && feat.amount > 0) {
        stmtUpdateChan.run(feat.amount, pool, ch);
        // Track per-region/category balance for WhatsApp (non-complementary only)
        if (!isComplementary && feat.name === 'WhatsApp' && feat.region && feat.category) {
          db.prepare(
            'INSERT INTO mets_wa_region_balances (pool, region, category, balance) VALUES (?, ?, ?, ?) ' +
            'ON CONFLICT(pool, region, category) DO UPDATE SET balance = balance + excluded.balance'
          ).run(pool, feat.region, feat.category, feat.amount);
        }
        // Track per-type balance for SMS
        if (feat.name === 'SMS' && feat.smsType) {
          db.prepare(
            'INSERT INTO mets_sms_type_balances (pool, sms_type, balance) VALUES (?, ?, ?) ' +
            'ON CONFLICT(pool, sms_type) DO UPDATE SET balance = balance + excluded.balance'
          ).run(pool, feat.smsType, feat.amount);
        }
      }
    }
  }

  // Build description
  const fmtBal = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const poolDisplayNames = {
    committed:     'Committed',
    allocated:     'Allocated',
    unallocated:   'Unallocated',
    complementary: 'Complementary',
    testing:       'Testing',
  };
  const poolDisplayName = poolDisplayNames[pool] || (pool.charAt(0).toUpperCase() + pool.slice(1));

  const featNames = (features || []).map(f => f.name).filter(Boolean);
  const typeLabel = pool.charAt(0).toUpperCase() + pool.slice(1);
  const details   = typeLabel + (featNames.length ? ' \u203a ' + featNames.join(', ') : '');

  const action = isComplementary ? 'Complementary Credits' : 'METS Top-up';
  const showTotalLine = (pool === 'committed' || pool === 'unallocated');

  // Build the "with PO/TI: … and Notes: …" clause
  const hasPoti  = poti  && String(poti).trim();
  const hasNotes = notes && String(notes).trim();
  let withClause = '';
  if (hasPoti || hasNotes) {
    const parts = [];
    if (hasPoti)  parts.push('PO/TI: ' + String(poti).trim());
    if (hasNotes) parts.push('Notes: ' + String(notes).trim());
    withClause = ' with ' + parts.join(' and ');
  }

  const featClause = (pool === 'committed' && (features || []).length)
    ? ' in ' + (features || []).filter(f => f.name && f.amount > 0).map(f => {
        let label = f.name;
        const qualifiers = [];
        if (f.name === 'SMS' && f.smsType) {
          qualifiers.push(f.smsType.charAt(0).toUpperCase() + f.smsType.slice(1));
        }
        if (f.name === 'WhatsApp') {
          if (f.region) qualifiers.push(f.region.includes('-') ? f.region.split('-').slice(1).join('-') : f.region);
          if (f.category) qualifiers.push(f.category.charAt(0).toUpperCase() + f.category.slice(1));
        }
        if (qualifiers.length) label += ' (' + qualifiers.join(', ') + ')';
        return label + ': ' + fmtBal(f.amount) + ' METS';
      }).join(', ')
    : '';

  let description;
  if (isComplementary || isTesting) {
    const creditLabel = isComplementary ? 'Complementary' : 'Testing';
    const featDetail = (features || []).filter(f => f.name && f.amount > 0)
      .map(f => f.name + ': ' + fmtBal(f.amount) + ' credits').join(', ');
    const featClauseCredits = featDetail ? ' for ' + featDetail : '';
    description = creditLabel + ' credits of ' + fmtBal(totalAmount) + ' added' + featClauseCredits + '.'
      + ' Total ' + creditLabel + ' credits updated from ' + fmtBal(poolBefore) + ' to ' + fmtBal(poolAfter) + '.';
  } else {
    description = 'METS Top-up of ' + fmtBal(totalAmount) + ' METS added to ' + poolDisplayName + ' pool' + featClause + withClause + '.'
      + (showTotalLine ? ' Total available METS updated from ' + fmtBal(totalMETSBefore) + ' to ' + fmtBal(totalMETSAfter) + '.' : '');
  }

  stmtInsertLog.run(
    action, pool, null, null, null,
    totalAmount, poti || null, notes || null, details, description,
    req.ip || null, 'Success'
  );

  res.json({ ok: true });
});

// ── POST /api/mets/reversal ───────────────────────────────────────────────────
app.post('/api/mets/reversal', (req, res) => {
  const { pool, channel, amount, reason, notes, region, category, smsType } = req.body;
  if (!pool || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid pool or amount' });
  }

  // Check pool balance
  const poolRow = db.prepare('SELECT total, label FROM mets_pools WHERE pool = ?').get(pool);
  if (!poolRow) return res.status(400).json({ error: 'Unknown pool: ' + pool });
  if (poolRow.total < amount) {
    return res.status(400).json({ error: 'Insufficient pool balance for ' + pool });
  }

  // For complementary, testing and committed: also guard channel balance
  if (['complementary', 'testing', 'committed'].includes(pool) && channel) {
    const chanRow = db.prepare('SELECT balance FROM mets_channels WHERE pool = ? AND channel = ?').get(pool, channel);
    if (!chanRow || chanRow.balance < amount) {
      return res.status(400).json({ error: 'Insufficient channel balance for ' + pool + ' / ' + channel });
    }
  }

  // Deduct from pool (never below 0)
  db.prepare('UPDATE mets_pools SET total = max(0, total + ?) WHERE pool = ?').run(-amount, pool);

  // Deduct from channel if given
  if (channel) {
    db.prepare('UPDATE mets_channels SET balance = max(0, balance + ?) WHERE pool = ? AND channel = ?').run(-amount, pool, channel);
    // Deduct per-region/category WA balance
    if (channel === 'whatsapp' && region && category) {
      db.prepare(
        'UPDATE mets_wa_region_balances SET balance = balance - ? WHERE pool = ? AND region = ? AND category = ?'
      ).run(amount, pool, region, category);
    }
    // Deduct per-type SMS balance
    if (channel === 'sms' && smsType) {
      db.prepare(
        'UPDATE mets_sms_type_balances SET balance = balance - ? WHERE pool = ? AND sms_type = ?'
      ).run(amount, pool, smsType);
    }
  }

  // Build description
  const fmtAmt = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Pool display names
  const revPoolNames = { committed: 'Committed', allocated: 'Allocated', unallocated: 'Unallocated', complementary: 'Complementary', testing: 'Testing' };
  const poolLabel = revPoolNames[pool] || (pool.charAt(0).toUpperCase() + pool.slice(1));

  // Feature/channel qualifier
  const channelName = channel ? (channel.charAt(0).toUpperCase() + channel.slice(1)) : null;
  const qualifiers = [];
  if (channelName) qualifiers.push(channelName);
  if (channel === 'sms' && smsType) qualifiers.push(smsType.charAt(0).toUpperCase() + smsType.slice(1));
  if (channel === 'whatsapp') {
    if (category) qualifiers.push(category.charAt(0).toUpperCase() + category.slice(1));
    if (region)   qualifiers.push(region.includes('-') ? region.split('-').slice(1).join('-') : region);
  }
  const qualClause = qualifiers.length > 1 ? ' (' + qualifiers.slice(1).join(', ') + ')' : '';
  const featureClause = channelName ? ' (' + qualifiers.join(', ') + ')' : '';

  // Reason / notes clause
  const hasReason = reason && String(reason).trim();
  const hasNotes  = notes  && String(notes).trim();
  let withClause = '';
  if (hasReason || hasNotes) {
    const parts = [];
    if (hasReason) parts.push('Reason: ' + String(reason).trim());
    if (hasNotes)  parts.push('Additional Notes: ' + String(notes).trim());
    withClause = ' with ' + parts.join(' and ');
  }

  // Total line — same logic as top-up
  const isRevComp    = (pool === 'complementary');
  const isRevTesting = (pool === 'testing');
  const showRevMETSTotal = (pool === 'committed' || pool === 'unallocated' || pool === 'allocated');

  let totalClause = '';
  if (showRevMETSTotal) {
    const metsRow = db.prepare("SELECT COALESCE(SUM(total),0) AS t FROM mets_pools WHERE pool IN ('committed','unallocated','allocated')").get();
    // total AFTER deduction (pool already updated above)
    const metsAfter  = metsRow.t || 0;
    const metsBefore = metsAfter + amount;
    totalClause = ' Total Available METS updated from ' + fmtAmt(metsBefore) + ' to ' + fmtAmt(metsAfter) + '.';
  } else if (isRevComp || isRevTesting) {
    const creditLabel = isRevComp ? 'Complementary' : 'Testing';
    const poolAfter  = poolRow.total - amount; // poolRow captured before deduction
    const poolBefore = poolRow.total;
    totalClause = ' Total ' + creditLabel + ' credits updated from ' + fmtAmt(poolBefore) + ' to ' + fmtAmt(poolAfter) + '.';
  }

  const crumb = poolLabel + (channelName ? ' › ' + qualifiers.join(', ') : '');
  const description = fmtAmt(amount) + ' deducted from ' + poolLabel + featureClause + withClause + '.' + totalClause;

  stmtInsertLog.run(
    'METS Deduction', pool, channel || null, region || null, category || null,
    amount, reason || null, notes || null, crumb, description,
    req.ip || null, 'Success'
  );

  res.json({ ok: true });
});

// ── GET /api/mets/wa-region-balances ─────────────────────────────────────────
app.get('/api/mets/wa-region-balances', (req, res) => {
  const pool = req.query.pool;
  const rows = pool
    ? db.prepare('SELECT region, category, balance FROM mets_wa_region_balances WHERE pool = ? AND balance > 0').all(pool)
    : db.prepare('SELECT pool, region, category, balance FROM mets_wa_region_balances WHERE balance > 0').all();
  res.json(rows);
});

// ── GET /api/mets/sms-type-balances ──────────────────────────────────────────
app.get('/api/mets/sms-type-balances', (req, res) => {
  const pool = req.query.pool;
  const rows = pool
    ? db.prepare('SELECT sms_type, balance FROM mets_sms_type_balances WHERE pool = ? AND balance > 0').all(pool)
    : db.prepare('SELECT pool, sms_type, balance FROM mets_sms_type_balances WHERE balance > 0').all();
  res.json(rows);
});

// ── GET /api/mets/statement ───────────────────────────────────────────────────
app.get('/api/mets/statement', (req, res) => {
  const logs = db.prepare('SELECT * FROM mets_audit_logs ORDER BY ts ASC, id ASC').all();

  let metsBalance = 0;
  const rows = [];

  for (const log of logs) {
    if (!log.amount || log.amount === 0) continue;
    const pool = log.pool;
    if (!pool) continue;

    const isMETS = ['committed', 'unallocated', 'allocated'].includes(pool);
    if (!isMETS) continue;

    const isCredit = log.action === 'METS Top-up';
    const isDebit  = ['METS Deduction', 'METS Reversal'].includes(log.action);
    if (!isCredit && !isDebit) continue;

    const opening = isMETS ? metsBalance : isComp ? compBalance : testBalance;
    const delta = isCredit ? log.amount : -log.amount;
    metsBalance += delta;
    const net = metsBalance;

    const classification = pool === 'committed' ? 'Committed METS' : 'Un-allocated/Allocated METS';

    let feature = '';
    if (log.channel) {
      const ch = CHANNEL_TO_FEAT[log.channel] || (log.channel.toLowerCase() === 'sms' ? 'SMS' : log.channel.charAt(0).toUpperCase() + log.channel.slice(1));
      const q  = [];
      if (log.category) q.push(log.category.charAt(0).toUpperCase() + log.category.slice(1));
      if (log.region)   q.push(log.region.includes('-') ? log.region.split('-').slice(1).join('-') : log.region);
      feature = q.length ? ch + ' (' + q.join(', ') + ')' : ch;
    } else if (log.details) {
      const idx = log.details.indexOf('\u203a');
      if (idx !== -1) feature = log.details.slice(idx + 1).trim();
    }

    rows.push({
      ts: log.ts,
      txType: isCredit ? 'Credited' : 'Deducted',
      classification,
      feature,
      credited: isCredit  ? log.amount : null,
      debited:  !isCredit ? log.amount : null,
      opening,
      net
    });
  }

  rows.reverse();
  res.json(rows);
});

// ── GET /api/mets/complementary-report ───────────────────────────────────────
app.get('/api/mets/complementary-report', (req, res) => {
  const logs = db.prepare('SELECT * FROM mets_audit_logs ORDER BY ts ASC, id ASC').all();

  let compBalance = 0;
  const rows = [];

  for (const log of logs) {
    if (!log.amount || log.amount === 0) continue;
    if (log.pool !== 'complementary') continue;

    const isCredit = log.action === 'Complementary Credits';
    const isDebit  = ['METS Deduction', 'METS Reversal'].includes(log.action);
    if (!isCredit && !isDebit) continue;

    const opening = compBalance;
    const delta   = isCredit ? log.amount : -log.amount;
    compBalance  += delta;

    let feature = '';
    if (log.channel) {
      const ch = CHANNEL_TO_FEAT[log.channel] || (log.channel.toLowerCase() === 'sms' ? 'SMS' : log.channel.charAt(0).toUpperCase() + log.channel.slice(1));
      const q  = [];
      if (log.category) q.push(log.category.charAt(0).toUpperCase() + log.category.slice(1));
      if (log.region)   q.push(log.region.includes('-') ? log.region.split('-').slice(1).join('-') : log.region);
      feature = q.length ? ch + ' (' + q.join(', ') + ')' : ch;
    } else if (log.details) {
      const idx = log.details.indexOf('\u203a');
      if (idx !== -1) feature = log.details.slice(idx + 1).trim();
    }

    rows.push({
      ts:       log.ts,
      txType:   isCredit ? 'Credited' : 'Deducted',
      feature,
      credited: isCredit  ? log.amount : null,
      debited:  !isCredit ? log.amount : null,
      opening,
      net:      compBalance
    });
  }

  rows.reverse();
  res.json(rows);
});

// ── GET /api/mets/testing-report ──────────────────────────────────────────────
app.get('/api/mets/testing-report', (req, res) => {
  const logs = db.prepare('SELECT * FROM mets_audit_logs ORDER BY ts ASC, id ASC').all();

  let testBalance = 0;
  const rows = [];

  for (const log of logs) {
    if (!log.amount || log.amount === 0) continue;
    if (log.pool !== 'testing') continue;

    const isCredit = log.action === 'METS Top-up';
    const isDebit  = ['METS Deduction', 'METS Reversal'].includes(log.action);
    if (!isCredit && !isDebit) continue;

    const opening = testBalance;
    const delta   = isCredit ? log.amount : -log.amount;
    testBalance  += delta;

    let feature = '';
    if (log.channel) {
      const ch = CHANNEL_TO_FEAT[log.channel] || (log.channel.toLowerCase() === 'sms' ? 'SMS' : log.channel.charAt(0).toUpperCase() + log.channel.slice(1));
      const q  = [];
      if (log.category) q.push(log.category.charAt(0).toUpperCase() + log.category.slice(1));
      if (log.region)   q.push(log.region.includes('-') ? log.region.split('-').slice(1).join('-') : log.region);
      feature = q.length ? ch + ' (' + q.join(', ') + ')' : ch;
    } else if (log.details) {
      const idx = log.details.indexOf('\u203a');
      if (idx !== -1) feature = log.details.slice(idx + 1).trim();
    }

    rows.push({
      ts:       log.ts,
      txType:   isCredit ? 'Credited' : 'Deducted',
      feature,
      credited: isCredit  ? log.amount : null,
      debited:  !isCredit ? log.amount : null,
      opening,
      net:      testBalance
    });
  }

  rows.reverse();
  res.json(rows);
});

// ── GET /api/mets/audit-logs ──────────────────────────────────────────────────
// Excludes 'METS Deduction' entries — those are internal report entries used
// only by View Statement / Complementary / Testing reports, not the activity feed.
// ── GET /api/mets/usage ───────────────────────────────────────────────────────
// Returns consumed transit records for the View Usage report.
app.get('/api/mets/usage', (req, res) => {
  const rows = db.prepare(`
    SELECT job_id, ts, pingback_ts, feature, channel, region, category, sms_type,
           credits_held, held_amount, source_breakdown
    FROM mets_transit
    WHERE status = 'consumed'
    ORDER BY pingback_ts DESC, ts DESC
  `).all();

  const result = rows.map(row => {
    const bd          = JSON.parse(row.source_breakdown || '{}');
    const testingCred = bd.testing      ? (bd.testing.credits      || 0) : 0;
    const compCred    = bd.complementary ? (bd.complementary.credits || 0) : 0;
    const commMets    = bd.committed    ? (bd.committed.mets        || 0) : 0;
    const unallocMets = bd.unallocated  ? (bd.unallocated.mets      || 0) : 0;
    const metsUsed    = Math.round((commMets + unallocMets) * 1e6) / 1e6;
    const { rate }    = getFeatureRate(row.feature, row.sms_type, row.category);

    return {
      ts:              row.pingback_ts || row.ts,
      type:            row.sms_type
                         ? (row.sms_type.charAt(0).toUpperCase() + row.sms_type.slice(1))
                         : 'NA',
      channel:         CHANNEL_TO_FEAT[row.channel] || row.feature,
      templateType:    row.category
                         ? (row.category.charAt(0).toUpperCase() + row.category.slice(1))
                         : '-',
      sentCount:       row.credits_held || 0,
      cpmcps:          rate,
      metsUsed:        metsUsed || null,
      compCredits:     compCred  || null,
      testingCredits:  testingCred || null,
    };
  });

  res.json(result);
});

app.get('/api/mets/audit-logs', (req, res) => {
  const logs = db.prepare(
    "SELECT * FROM mets_audit_logs WHERE action != 'METS Deduction' ORDER BY ts DESC LIMIT 200"
  ).all();
  res.json(logs);
});

// ── GET /api/mets/pricing ─────────────────────────────────────────────────────
app.get('/api/mets/pricing', (req, res) => {
  const rows = db.prepare('SELECT field, value FROM mets_pricing').all();
  const result = {};
  for (const row of rows) result[row.field] = row.value;
  res.json(result);
});

// ── POST /api/mets/pricing-change ────────────────────────────────────────────
app.post('/api/mets/pricing-change', (req, res) => {
  const { changes } = req.body;
  if (!Array.isArray(changes) || !changes.length) {
    return res.status(400).json({ error: 'Missing or empty changes array' });
  }

  // Persist updated values
  const upsert = db.prepare('INSERT INTO mets_pricing (field, value) VALUES (?, ?) ON CONFLICT(field) DO UPDATE SET value = excluded.value');
  for (const c of changes) upsert.run(c.field, String(c.newValue));

  // Write single audit log entry
  const lines = changes.map(c =>
    (c.field || '?') + ': ' + (c.oldValue ?? '0') + ' to ' + (c.newValue ?? '0')
  );
  const details = changes.map(c => c.field).join(', ');
  const description = 'Pricing updated for ' + lines.join(', ') + '.';

  stmtInsertLog.run(
    'Pricing Change', null, null, null, null,
    null, null, null, details, description,
    req.ip || null, 'Success'
  );

  res.json({ ok: true });
});

// ── Helper: resolve feature → pricing rate ────────────────────────────────────
function getFeatureRate(feature, smsType, category) {
  const staticMap = {
    'Email':        'Email (CPM)',
    'Niaa':         'Niaa (CPS)',
    'Mio AI Guide': 'Mio AI Guide (CPS)',
    'Mio AI Voice': 'Mio AI Voice Cost Per Pulse',
    'Mio AI Coach': 'Mio AI Coach (CPS)',
  };
  let field;
  if (feature === 'SMS') {
    field = (smsType === 'international') ? 'SMS International (CPS)' : 'SMS Domestic (CPS)';
  } else if (feature === 'WhatsApp') {
    const catMap = {
      service:        'WhatsApp Service (CPS)',
      marketing:      'WhatsApp Marketing (CPS)',
      utility:        'WhatsApp Utility (CPS)',
      authentication: 'WhatsApp Authentication (CPS)',
    };
    field = catMap[(category || '').toLowerCase()] || 'WhatsApp Service (CPS)';
  } else {
    field = staticMap[feature] || null;
  }
  const row = field ? db.prepare('SELECT value FROM mets_pricing WHERE field = ?').get(field) : null;
  return { field, rate: row ? (parseFloat(row.value) || 0) : 0 };
}

// ── Helper: get channel balance ───────────────────────────────────────────────
function getChannelBal(pool, channel) {
  const row = db.prepare('SELECT balance FROM mets_channels WHERE pool = ? AND channel = ?').get(pool, channel);
  return row ? (row.balance || 0) : 0;
}

// ── Helper: effective committed METS available for a channel ─────────────────
// Actual balance minus METS already soft-held in transit (prevents double-booking
// without deducting at hold time — deduction happens at pingback success).
function getEffectiveCommittedBal(channel) {
  const actual = getChannelBal('committed', channel);
  const held   = db.prepare(
    "SELECT COALESCE(SUM(json_extract(source_breakdown,'$.committed.mets')),0) AS t FROM mets_transit WHERE status='held' AND channel=?"
  ).get(channel).t;
  return Math.max(0, actual - held);
}

// ── Helper: effective unallocated METS available (global) ────────────────────
function getEffectiveUnallocBal() {
  const row    = db.prepare("SELECT total FROM mets_pools WHERE pool='unallocated'").get();
  const actual = row ? (row.total || 0) : 0;
  const held   = db.prepare(
    "SELECT COALESCE(SUM(json_extract(source_breakdown,'$.unallocated.mets')),0) AS t FROM mets_transit WHERE status='held'"
  ).get().t;
  return Math.max(0, actual - held);
}

// ── GET /api/mets/available-credits ──────────────────────────────────────────
app.get('/api/mets/available-credits', (req, res) => {
  const { feature, smsType, category } = req.query;
  const channel = FEAT_TO_CHANNEL[feature];
  if (!channel) return res.status(400).json({ error: 'Unknown feature: ' + feature });

  const { rate, field: pricingField } = getFeatureRate(feature, smsType, category);

  const testingBal   = getChannelBal('testing',       channel);
  const compBal      = getChannelBal('complementary',  channel);
  const committedBal = getChannelBal('committed',      channel);
  const unallocRow   = db.prepare("SELECT total FROM mets_pools WHERE pool = 'unallocated'").get();
  const unallocBal   = unallocRow ? (unallocRow.total || 0) : 0;

  const metsCredits  = rate > 0 ? Math.floor((committedBal + unallocBal) / rate) : 0;
  const totalCredits = testingBal + compBal + metsCredits;

  res.json({
    feature, channel, rate, pricing_field: pricingField,
    balances: { testing: testingBal, complementary: compBal, committed: committedBal, unallocated: unallocBal },
    credits:  { testing: testingBal, complementary: compBal, mets: metsCredits, total: totalCredits },
  });
});

// ── POST /api/mets/consume ────────────────────────────────────────────────────
// Accepts `credits` (not raw METS). Converts internally using feature rate.
app.post('/api/mets/consume', (req, res) => {
  const { feature, credits, smsType, region, category } = req.body;
  const creditsReq = Math.floor(Number(credits));
  if (!feature || !creditsReq || creditsReq <= 0) {
    return res.status(400).json({ error: 'Invalid feature or credits amount' });
  }

  const channel = FEAT_TO_CHANNEL[feature];
  if (!channel) return res.status(400).json({ error: 'Unknown feature: ' + feature });

  const { rate, field: pricingField } = getFeatureRate(feature, smsType, category);

  const prefixMap = {
    'Email': 'EML', 'SMS': 'SMS', 'WhatsApp': 'WA',
    'Niaa': 'NIA', 'Mio AI Guide': 'GDE', 'Mio AI Voice': 'AIV', 'Mio AI Coach': 'AIC',
  };
  const jobId = prefixMap[feature] + '-' + String(Math.floor(10000 + Math.random() * 90000));

  let creditsLeft = creditsReq;
  // breakdown[pool] = { credits, mets }
  const breakdown = {};

  // 1. Testing credits — unit-based (1 credit = 1 unit consumed, NOT monetary METS)
  const testBal = getChannelBal('testing', channel);
  if (testBal > 0 && creditsLeft > 0) {
    const take = Math.min(creditsLeft, testBal);
    db.prepare('UPDATE mets_channels SET balance = max(0, balance - ?) WHERE pool = ? AND channel = ?').run(take, 'testing', channel);
    db.prepare('UPDATE mets_pools SET total = max(0, total - ?) WHERE pool = ?').run(take, 'testing');
    breakdown.testing = { credits: take };   // credits only — no METS, these are units
    creditsLeft -= take;
  }

  // 2. Complementary credits — unit-based (1 credit = 1 unit consumed, NOT monetary METS)
  if (creditsLeft > 0) {
    const compBal = getChannelBal('complementary', channel);
    if (compBal > 0) {
      const take = Math.min(creditsLeft, compBal);
      db.prepare('UPDATE mets_channels SET balance = max(0, balance - ?) WHERE pool = ? AND channel = ?').run(take, 'complementary', channel);
      db.prepare('UPDATE mets_pools SET total = max(0, total - ?) WHERE pool = ?').run(take, 'complementary');
      breakdown.complementary = { credits: take }; // credits only — no METS, these are units
      creditsLeft -= take;
    }
  }

  // 3. Committed METS — monetary; deduct credits × rate immediately at hold time.
  //    METS are transferred from the committed pool into the soft-hold state.
  //    On failure pingback they are returned; on success they remain deducted.
  if (creditsLeft > 0 && rate > 0) {
    const commBal = getChannelBal('committed', channel);
    if (commBal > 0) {
      const maxCred  = Math.floor(commBal / rate);
      const takeCred = Math.min(creditsLeft, maxCred);
      const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
      if (takeMets > 0) {
        db.prepare('UPDATE mets_channels SET balance = max(0, balance - ?) WHERE pool = ? AND channel = ?').run(takeMets, 'committed', channel);
        db.prepare('UPDATE mets_pools SET total = max(0, total - ?) WHERE pool = ?').run(takeMets, 'committed');
        breakdown.committed = { credits: takeCred, mets: takeMets };
        creditsLeft -= takeCred;
      }
    }
  }

  // 4. Unallocated METS — monetary; deduct credits × rate immediately at hold time.
  if (creditsLeft > 0 && rate > 0) {
    const unallocRow = db.prepare("SELECT total FROM mets_pools WHERE pool = 'unallocated'").get();
    const unallocBal = unallocRow ? (unallocRow.total || 0) : 0;
    if (unallocBal > 0) {
      const maxCred  = Math.floor(unallocBal / rate);
      const takeCred = Math.min(creditsLeft, maxCred);
      const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
      if (takeMets > 0) {
        db.prepare("UPDATE mets_pools SET total = total - ? WHERE pool = 'unallocated'").run(takeMets);
        breakdown.unallocated = { credits: takeCred, mets: takeMets };
        creditsLeft -= takeCred;
      }
    }
  }

  const creditsHeld = creditsReq - creditsLeft;
  if (creditsHeld <= 0) {
    return res.status(400).json({ error: 'Insufficient credits balance across all pools' });
  }

  // held_amount = actual monetary METS held (committed + unallocated only)
  const metsHeld = (breakdown.committed   ? (breakdown.committed.mets   || 0) : 0)
                 + (breakdown.unallocated ? (breakdown.unallocated.mets || 0) : 0);

  db.prepare(`
    INSERT INTO mets_transit
      (job_id, feature, channel, region, category, sms_type, requested_amount, held_amount, credits_held, source_breakdown)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(jobId, feature, channel, region || null, category || null, smsType || null,
         creditsReq, metsHeld, creditsHeld, JSON.stringify(breakdown));

  res.json({
    ok: true, job_id: jobId,
    credits_held: creditsHeld, mets_held: metsHeld,
    source_breakdown: breakdown,
    rate, partial: creditsLeft > 0,
  });
});

// ── Helper: deduct credits from pools in priority order ──────────────────────
// Returns { breakdown: { pool: { credits, mets } }, creditsConsumed }
function consumeCreditsFromPools(channel, rate, creditsReq) {
  let creditsLeft = creditsReq;
  const bd = {};

  const testBal = getChannelBal('testing', channel);
  if (testBal > 0 && creditsLeft > 0) {
    const take = Math.min(creditsLeft, testBal);
    db.prepare('UPDATE mets_channels SET balance = max(0, balance - ?) WHERE pool = ? AND channel = ?').run(take, 'testing', channel);
    db.prepare('UPDATE mets_pools SET total = max(0, total - ?) WHERE pool = ?').run(take, 'testing');
    bd.testing = { credits: take }; // unit-based, no METS
    creditsLeft -= take;
  }
  if (creditsLeft > 0) {
    const compBal = getChannelBal('complementary', channel);
    if (compBal > 0) {
      const take = Math.min(creditsLeft, compBal);
      db.prepare('UPDATE mets_channels SET balance = max(0, balance - ?) WHERE pool = ? AND channel = ?').run(take, 'complementary', channel);
      db.prepare('UPDATE mets_pools SET total = max(0, total - ?) WHERE pool = ?').run(take, 'complementary');
      bd.complementary = { credits: take }; // unit-based, no METS
      creditsLeft -= take;
    }
  }
  if (creditsLeft > 0 && rate > 0) {
    const commBal = getChannelBal('committed', channel);
    if (commBal > 0) {
      const maxCred = Math.floor(commBal / rate);
      const takeCred = Math.min(creditsLeft, maxCred);
      const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
      if (takeMets > 0) {
        db.prepare('UPDATE mets_channels SET balance = max(0, balance - ?) WHERE pool = ? AND channel = ?').run(takeMets, 'committed', channel);
        db.prepare('UPDATE mets_pools SET total = max(0, total - ?) WHERE pool = ?').run(takeMets, 'committed');
        bd.committed = { credits: takeCred, mets: takeMets };
        creditsLeft -= takeCred;
      }
    }
  }
  if (creditsLeft > 0 && rate > 0) {
    const unallocRow = db.prepare("SELECT total FROM mets_pools WHERE pool = 'unallocated'").get();
    const unallocBal = unallocRow ? (unallocRow.total || 0) : 0;
    if (unallocBal > 0) {
      const maxCred = Math.floor(unallocBal / rate);
      const takeCred = Math.min(creditsLeft, maxCred);
      const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
      if (takeMets > 0) {
        db.prepare("UPDATE mets_pools SET total = total - ? WHERE pool = 'unallocated'").run(takeMets);
        bd.unallocated = { credits: takeCred, mets: takeMets };
        creditsLeft -= takeCred;
      }
    }
  }
  return { breakdown: bd, creditsConsumed: creditsReq - creditsLeft };
}

// ── Helper: insert METS Deduction audit log entries for View Statement ────────
// Only committed and unallocated pools generate report entries (View Statement).
// Testing / Complementary credits are consumed silently — their pool balances
// decrease but no report entry is created (those reports track allocations only).
function insertDeductionLogs(transit, poolBreakdown, jobId) {
  const fmtN = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  for (const [pool, v] of Object.entries(poolBreakdown)) {
    const credAmt = typeof v === 'object' ? (v.credits || 0) : v;
    const metsAmt = typeof v === 'object' ? (v.mets    || 0) : v;

    const isMetsBased = ['committed', 'unallocated'].includes(pool);
    const logAmt = isMetsBased ? metsAmt : credAmt; // unit-based pools log credits; METS pools log METS
    if (logAmt <= 0) continue;

    let desc;
    if (isMetsBased) {
      desc = `${fmtN(credAmt)} credits (${fmtN(metsAmt)} METS) consumed from ${pool} for ${transit.feature} — Job ${jobId}`;
    } else {
      desc = `${fmtN(credAmt)} credits consumed from ${pool} for ${transit.feature} — Job ${jobId}`;
    }

    stmtInsertLog.run(
      'METS Deduction', pool, transit.channel, transit.region, transit.category,
      logAmt, 'Consumption — Job: ' + jobId, null, jobId, desc, null, 'Success'
    );
  }
}

// ── POST /api/mets/pingback ───────────────────────────────────────────────────
// Supports partial pingback: { job_id, success_credits, failure_credits, extra_credits? }
// Legacy full pingback:       { job_id, status: 'success'|'failure' }
// extra_credits: additional credits consumed beyond the held amount (SMS / Mio AI Voice only)
app.post('/api/mets/pingback', (req, res) => {
  const { job_id, status, success_credits, failure_credits, extra_credits } = req.body;
  if (!job_id) return res.status(400).json({ error: 'job_id required' });

  const transit = db.prepare('SELECT * FROM mets_transit WHERE job_id = ?').get(job_id);
  if (!transit) return res.status(404).json({ error: 'Job not found: ' + job_id });
  if (transit.status !== 'held') {
    return res.status(400).json({ error: 'Job already settled with status: ' + transit.status });
  }

  const now        = Math.floor(Date.now() / 1000);
  const breakdown  = JSON.parse(transit.source_breakdown || '{}');
  const fmtN       = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getMets    = v => (typeof v === 'object' ? (v.mets    || 0) : v);
  const getCredits = v => (typeof v === 'object' ? (v.credits || 0) : v);
  const totalCred  = transit.credits_held || transit.held_amount;

  // Resolve success/failure credit amounts
  let sucCred, failCred;
  if (success_credits !== undefined || failure_credits !== undefined) {
    sucCred  = Math.max(0, Math.round((Number(success_credits)  || 0) * 1e6) / 1e6);
    failCred = Math.max(0, Math.round((Number(failure_credits) || 0) * 1e6) / 1e6);
  } else if (status === 'success') {
    sucCred = totalCred; failCred = 0;
  } else if (status === 'failure') {
    sucCred = 0; failCred = totalCred;
  } else {
    return res.status(400).json({ error: 'Provide status ("success"/"failure") or success_credits/failure_credits' });
  }

  if (sucCred + failCred > totalCred + 0.0001) {
    return res.status(400).json({ error: `success_credits (${sucCred}) + failure_credits (${failCred}) exceeds total held (${totalCred})` });
  }
  if (sucCred + failCred <= 0) {
    return res.status(400).json({ error: 'At least one of success_credits or failure_credits must be > 0' });
  }

  const pendingCred = Math.max(0, Math.round((totalCred - sucCred - failCred) * 1e6) / 1e6);

  // ── PRIORITY-BASED allocation ─────────────────────────────────────────────────
  // Success credits are consumed from pools in priority order:
  //   testing → complementary → committed → unallocated
  // Whatever is not consumed by success stays as "remaining held" and is then
  // split between failure (returned) and pending (kept on hold).
  const PRIORITY_POOLS = ['testing', 'complementary', 'committed', 'unallocated'];

  // Step 1: allocate sucCred in priority order → sucBreakdown
  const sucBreakdown = {};
  let sucLeft = sucCred;
  for (const pool of PRIORITY_POOLS) {
    if (!breakdown[pool] || sucLeft <= 0) continue;
    const v        = breakdown[pool];
    const heldCred = getCredits(v);
    if (heldCred <= 0) continue;
    const takeCred = Math.min(sucLeft, heldCred);
    const isMetsBased = ['committed', 'unallocated'].includes(pool);
    if (isMetsBased) {
      const takeMets = heldCred > 0 ? Math.round((takeCred / heldCred) * getMets(v) * 1e6) / 1e6 : 0;
      sucBreakdown[pool] = { credits: takeCred, mets: takeMets };
    } else {
      sucBreakdown[pool] = { credits: takeCred };
    }
    sucLeft -= takeCred;
  }

  // Step 2: compute remaining held after success
  const remainBreakdown = {};
  let remainCred = 0;
  for (const pool of PRIORITY_POOLS) {
    if (!breakdown[pool]) continue;
    const v        = breakdown[pool];
    const heldCred = getCredits(v);
    const sucCred_ = sucBreakdown[pool] ? getCredits(sucBreakdown[pool]) : 0;
    const remCred  = Math.round((heldCred - sucCred_) * 1e6) / 1e6;
    if (remCred <= 0) continue;
    const isMetsBased = ['committed', 'unallocated'].includes(pool);
    if (isMetsBased) {
      const remMets = Math.round((getMets(v) - (sucBreakdown[pool] ? getMets(sucBreakdown[pool]) : 0)) * 1e6) / 1e6;
      remainBreakdown[pool] = { credits: remCred, mets: remMets };
    } else {
      remainBreakdown[pool] = { credits: remCred };
    }
    remainCred += remCred;
  }

  // Step 3: return failCred from remainBreakdown proportionally → pools
  if (failCred > 0 && remainCred > 0) {
    const failRatio = Math.min(1, failCred / remainCred);
    for (const [pool, v] of Object.entries(remainBreakdown)) {
      const isMetsBased = ['committed', 'unallocated'].includes(pool);
      const returnAmt   = isMetsBased
        ? Math.round(getMets(v)    * failRatio * 1e6) / 1e6
        : Math.round(getCredits(v) * failRatio * 1e6) / 1e6;
      if (returnAmt <= 0) continue;
      if (pool === 'unallocated') {
        db.prepare("UPDATE mets_pools SET total = total + ? WHERE pool = 'unallocated'").run(returnAmt);
      } else {
        db.prepare('UPDATE mets_channels SET balance = balance + ? WHERE pool = ? AND channel = ?').run(returnAmt, pool, transit.channel);
        db.prepare('UPDATE mets_pools SET total = total + ? WHERE pool = ?').run(returnAmt, pool);
      }
    }
  }

  // Step 4: log deduction entries for the success portion
  if (sucCred > 0) {
    insertDeductionLogs(transit, sucBreakdown, job_id);
  }

  // Handle extra credits (overage beyond held amount) — all features supported
  let extraResult = null;
  const extraCred = Math.max(0, Math.round((Number(extra_credits) || 0) * 1e6) / 1e6);
  if (extraCred > 0) {
    const { rate } = getFeatureRate(transit.feature, transit.sms_type, transit.category);
    extraResult = consumeCreditsFromPools(transit.channel, rate, extraCred);
    if (extraResult.creditsConsumed > 0) {
      insertDeductionLogs(transit, extraResult.breakdown, job_id);
    }
  }

  if (pendingCred > 0) {
    // Partial settlement — shrink transit row to remaining pending amount
    const pendRatio    = remainCred > 0 ? pendingCred / remainCred : 0;
    const newBreakdown = {};
    for (const [pool, v] of Object.entries(remainBreakdown)) {
      const pCred = Math.round(getCredits(v) * pendRatio * 1e6) / 1e6;
      if (pCred <= 0) continue;
      const isMetsBased = ['committed', 'unallocated'].includes(pool);
      if (isMetsBased) {
        const pMets = Math.round(getMets(v) * pendRatio * 1e6) / 1e6;
        newBreakdown[pool] = { credits: pCred, mets: pMets };
      } else {
        newBreakdown[pool] = { credits: pCred };
      }
    }
    const newMetsHeld = (newBreakdown.committed   ? (newBreakdown.committed.mets   || 0) : 0)
                      + (newBreakdown.unallocated ? (newBreakdown.unallocated.mets || 0) : 0);
    db.prepare('UPDATE mets_transit SET held_amount = ?, credits_held = ?, source_breakdown = ? WHERE job_id = ?')
      .run(newMetsHeld, pendingCred, JSON.stringify(newBreakdown), job_id);

    return res.json({
      ok: true, status: 'partial',
      success_credits: sucCred, failure_credits: failCred,
      pending_credits: pendingCred, pending_mets: newMetsHeld,
      extra_credits_consumed: extraResult ? extraResult.creditsConsumed : 0,
      message: `${fmtN(sucCred)} consumed, ${fmtN(failCred)} released, ${fmtN(pendingCred)} still pending for job ${job_id}`,
    });
  }

  // Fully settled
  const finalStatus   = sucCred > 0 ? 'consumed' : 'released';
  const pingbackLabel = sucCred === totalCred ? 'success' : failCred === totalCred ? 'failure' : 'partial';
  // Merge extra credits into the final transit record so View Usage shows
  // the correct total sent count and pool breakdown.
  let finalCreditsHeld  = sucCred;
  let finalBreakdown    = { ...sucBreakdown };
  if (extraResult && extraResult.creditsConsumed > 0) {
    finalCreditsHeld += extraResult.creditsConsumed;
    for (const [pool, v] of Object.entries(extraResult.breakdown)) {
      const eCred = typeof v === 'object' ? (v.credits || 0) : v;
      const eMets = typeof v === 'object' ? (v.mets    || 0) : 0;
      if (finalBreakdown[pool]) {
        finalBreakdown[pool] = {
          credits: Math.round((getCredits(finalBreakdown[pool]) + eCred) * 1e6) / 1e6,
          ...(eMets || getMets(finalBreakdown[pool])
            ? { mets: Math.round((getMets(finalBreakdown[pool]) + eMets) * 1e6) / 1e6 }
            : {}),
        };
      } else {
        finalBreakdown[pool] = typeof v === 'object' ? { ...v } : { credits: v };
      }
    }
  }

  db.prepare('UPDATE mets_transit SET status = ?, pingback_ts = ?, pingback_status = ?, credits_held = ?, source_breakdown = ? WHERE job_id = ?')
    .run(finalStatus, now, pingbackLabel, finalCreditsHeld, JSON.stringify(finalBreakdown), job_id);

  res.json({
    ok: true, status: finalStatus,
    success_credits: sucCred, failure_credits: failCred, pending_credits: 0,
    extra_credits_consumed: extraResult ? extraResult.creditsConsumed : 0,
    message: sucCred > 0
      ? `${fmtN(sucCred)} credits permanently consumed for job ${job_id}`
      : `${fmtN(failCred)} credits released back to pools for job ${job_id}`,
  });
});

// ── GET /api/mets/transit ─────────────────────────────────────────────────────
app.get('/api/mets/transit', (req, res) => {
  const rows = db.prepare(`
    SELECT job_id, ts, feature, channel, region, category, sms_type,
           requested_amount, held_amount, credits_held, source_breakdown, status
    FROM mets_transit
    WHERE status = 'held'
    ORDER BY ts DESC
  `).all();

  res.json(rows.map(row => ({
    ...row,
    created_at:       row.ts,
    credits_held:     row.credits_held || row.held_amount,
    source_breakdown: JSON.parse(row.source_breakdown || '{}'),
  })));
});

// ── DELETE /api/mets/audit-logs ───────────────────────────────────────────────
app.delete('/api/mets/audit-logs', (req, res) => {
  db.exec('DELETE FROM mets_audit_logs');
  res.json({ ok: true });
});

// ── METS Settings ─────────────────────────────────────────────────────────────
app.get('/api/mets/settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM mets_settings').all();
    const out = {};
    rows.forEach(r => { try { out[r.key] = JSON.parse(r.value); } catch(e) { out[r.key] = null; } });
    res.json({ ok: true, settings: out });
  } catch(e) {
    res.json({ ok: true, settings: {} });
  }
});

app.post('/api/mets/settings', (req, res) => {
  try {
    const upsert = db.prepare('INSERT OR REPLACE INTO mets_settings (key, value) VALUES (?, ?)');
    const { settings } = req.body;
    if (settings && typeof settings === 'object') {
      Object.keys(settings).forEach(k => {
        upsert.run(k, JSON.stringify(settings[k]));
      });
    }
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── Fallback → index.html ─────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Meritto Admin → http://localhost:${PORT}\n`);
});
