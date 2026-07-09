require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: function(origin, cb) {
    if (!origin) return cb(null, true);
    if (/localhost|127\.0\.0\.1|\.pages\.dev|\.workers\.dev/.test(origin)) return cb(null, true);
    cb(null, true);
  },
  credentials: true
}));
app.use(express.json());

const FRONTEND = path.join(__dirname, '..', 'frontend');

// ── Database ──────────────────────────────────────────────────────────────────
// Local  → Supabase staging  (DATABASE_URL in backend/.env)
// Render → Supabase production (DATABASE_URL in Render environment)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function q(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows;
}
async function q1(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}
async function withTx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
const tq  = (c, sql, p = []) => c.query(sql, p).then(r => r.rows);
const tq1 = (c, sql, p = []) => c.query(sql, p).then(r => r.rows[0] || null);

// ── Feature ↔ channel maps ────────────────────────────────────────────────────
const FEAT_TO_CHANNEL = {
  'Email':        'email',
  'SMS':          'sms',
  'WhatsApp':     'whatsapp',
  'Niaa':         'niaa',
  'Mio AI Guide': 'guide',
  'Mio AI Voice': 'voice',
  'Mio AI Coach': 'coach',
};
const CHANNEL_TO_FEAT = Object.fromEntries(
  Object.entries(FEAT_TO_CHANNEL).map(([f, c]) => [c, f])
);

// ── Serve frontend ────────────────────────────────────────────────────────────
app.use(express.static(FRONTEND));

// ── GET /api/mets/balances ────────────────────────────────────────────────────
app.get('/api/mets/balances', async (req, res) => {
  try {
    const poolRows = await q('SELECT pool, label, total FROM mets_pools');
    const chanRows = await q('SELECT pool, channel, balance FROM mets_channels');

    const chanMap = {};
    for (const row of chanRows) {
      if (!chanMap[row.pool]) chanMap[row.pool] = {};
      chanMap[row.pool][row.channel] = row.balance;
    }

    const result = {};
    for (const row of poolRows) {
      const hasChannels = !!chanMap[row.pool];
      result[row.pool] = { label: row.label, total: row.total, hasChannels };
      if (hasChannels) result[row.pool].channels = chanMap[row.pool];
    }

    const shRow = await q1("SELECT COALESCE(SUM(held_amount),0) AS t FROM mets_transit WHERE status='held'");
    result._softHoldTotal = shRow ? (parseFloat(shRow.t) || 0) : 0;

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/mets/topup ──────────────────────────────────────────────────────
app.post('/api/mets/topup', async (req, res) => {
  const { pool: poolKey, features, totalAmount, poti, notes } = req.body;
  if (!poolKey || !totalAmount || totalAmount <= 0) {
    return res.status(400).json({ error: 'Invalid pool or amount' });
  }

  try {
    await withTx(async (client) => {
      const poolRow = await tq1(client, 'SELECT pool, total FROM mets_pools WHERE pool = $1', [poolKey]);
      if (!poolRow) throw Object.assign(new Error('Unknown pool: ' + poolKey), { status: 400 });

      const totalRow = await tq1(client,
        "SELECT COALESCE(SUM(total),0) AS t FROM mets_pools WHERE pool IN ('committed','unallocated','allocated')"
      );
      const totalMETSBefore = parseFloat(totalRow.t) || 0;
      const totalMETSAfter  = totalMETSBefore + totalAmount;
      const poolBefore = parseFloat(poolRow.total) || 0;
      const poolAfter  = poolBefore + totalAmount;

      const isComplementary = (poolKey === 'complementary');
      const isTesting       = (poolKey === 'testing');

      await tq(client, 'UPDATE mets_pools SET total = total + $1 WHERE pool = $2', [totalAmount, poolKey]);

      if (Array.isArray(features)) {
        for (const feat of features) {
          const ch = FEAT_TO_CHANNEL[feat.name];
          if (ch && feat.amount > 0) {
            await tq(client,
              'UPDATE mets_channels SET balance = balance + $1 WHERE pool = $2 AND channel = $3',
              [feat.amount, poolKey, ch]
            );
            if (!isComplementary && feat.name === 'WhatsApp' && feat.region && feat.category) {
              await tq(client,
                `INSERT INTO mets_wa_region_balances (pool, region, category, balance) VALUES ($1,$2,$3,$4)
                 ON CONFLICT (pool, region, category) DO UPDATE SET balance = mets_wa_region_balances.balance + $4`,
                [poolKey, feat.region, feat.category, feat.amount]
              );
            }
            if (feat.name === 'SMS' && feat.smsType) {
              await tq(client,
                `INSERT INTO mets_sms_type_balances (pool, sms_type, balance) VALUES ($1,$2,$3)
                 ON CONFLICT (pool, sms_type) DO UPDATE SET balance = mets_sms_type_balances.balance + $3`,
                [poolKey, feat.smsType, feat.amount]
              );
            }
          }
        }
      }

      const fmtBal = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const poolDisplayNames = { committed:'Committed', allocated:'Allocated', unallocated:'Unallocated', complementary:'Complementary', testing:'Testing' };
      const poolDisplayName = poolDisplayNames[poolKey] || (poolKey.charAt(0).toUpperCase() + poolKey.slice(1));
      const featNames  = (features || []).map(f => f.name).filter(Boolean);
      const typeLabel  = poolKey.charAt(0).toUpperCase() + poolKey.slice(1);
      const details    = typeLabel + (featNames.length ? ' \u203a ' + featNames.join(', ') : '');
      const action     = isComplementary ? 'Complementary Credits' : 'METS Top-up';
      const showTotal  = (poolKey === 'committed' || poolKey === 'unallocated');

      const hasPoti  = poti  && String(poti).trim();
      const hasNotes = notes && String(notes).trim();
      let withClause = '';
      if (hasPoti || hasNotes) {
        const parts = [];
        if (hasPoti)  parts.push('PO/TI: ' + String(poti).trim());
        if (hasNotes) parts.push('Notes: ' + String(notes).trim());
        withClause = ' with ' + parts.join(' and ');
      }

      const featClause = (poolKey === 'committed' && (features || []).length)
        ? ' in ' + (features || []).filter(f => f.name && f.amount > 0).map(f => {
            let label = f.name;
            const q2 = [];
            if (f.name === 'SMS' && f.smsType) q2.push(f.smsType.charAt(0).toUpperCase() + f.smsType.slice(1));
            if (f.name === 'WhatsApp') {
              if (f.region)   q2.push(f.region.includes('-') ? f.region.split('-').slice(1).join('-') : f.region);
              if (f.category) q2.push(f.category.charAt(0).toUpperCase() + f.category.slice(1));
            }
            if (q2.length) label += ' (' + q2.join(', ') + ')';
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
          + (showTotal ? ' Total available METS updated from ' + fmtBal(totalMETSBefore) + ' to ' + fmtBal(totalMETSAfter) + '.' : '');
      }

      await tq(client,
        `INSERT INTO mets_audit_logs
           (action, pool, channel, region, category, amount, reason, notes, details, description, ip, status, user_name, department)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Rahul Anand','Admin')`,
        [action, poolKey, null, null, null, totalAmount, poti||null, notes||null, details, description, req.ip||null, 'Success']
      );
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── POST /api/mets/reversal ───────────────────────────────────────────────────
app.post('/api/mets/reversal', async (req, res) => {
  const { pool: poolKey, channel, amount, reason, notes, region, category, smsType } = req.body;
  if (!poolKey || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid pool or amount' });
  }

  try {
    await withTx(async (client) => {
      const poolRow = await tq1(client, 'SELECT total, label FROM mets_pools WHERE pool = $1', [poolKey]);
      if (!poolRow) throw Object.assign(new Error('Unknown pool: ' + poolKey), { status: 400 });
      if (parseFloat(poolRow.total) < amount) throw Object.assign(new Error('Insufficient pool balance for ' + poolKey), { status: 400 });

      if (['complementary', 'testing', 'committed'].includes(poolKey) && channel) {
        const chanRow = await tq1(client, 'SELECT balance FROM mets_channels WHERE pool = $1 AND channel = $2', [poolKey, channel]);
        if (!chanRow || parseFloat(chanRow.balance) < amount) {
          throw Object.assign(new Error('Insufficient channel balance for ' + poolKey + ' / ' + channel), { status: 400 });
        }
      }

      await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool = $2', [amount, poolKey]);

      if (channel) {
        await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool = $2 AND channel = $3', [amount, poolKey, channel]);
        if (channel === 'whatsapp' && region && category) {
          await tq(client, 'UPDATE mets_wa_region_balances SET balance = balance - $1 WHERE pool = $2 AND region = $3 AND category = $4', [amount, poolKey, region, category]);
        }
        if (channel === 'sms' && smsType) {
          await tq(client, 'UPDATE mets_sms_type_balances SET balance = balance - $1 WHERE pool = $2 AND sms_type = $3', [amount, poolKey, smsType]);
        }
      }

      const fmtAmt = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const revPoolNames = { committed:'Committed', allocated:'Allocated', unallocated:'Unallocated', complementary:'Complementary', testing:'Testing' };
      const poolLabel   = revPoolNames[poolKey] || (poolKey.charAt(0).toUpperCase() + poolKey.slice(1));
      const channelName = channel ? (channel.charAt(0).toUpperCase() + channel.slice(1)) : null;
      const qualifiers  = [];
      if (channelName) qualifiers.push(channelName);
      if (channel === 'sms' && smsType)  qualifiers.push(smsType.charAt(0).toUpperCase() + smsType.slice(1));
      if (channel === 'whatsapp') {
        if (category) qualifiers.push(category.charAt(0).toUpperCase() + category.slice(1));
        if (region)   qualifiers.push(region.includes('-') ? region.split('-').slice(1).join('-') : region);
      }
      const featureClause = channelName ? ' (' + qualifiers.join(', ') + ')' : '';

      const hasReason = reason && String(reason).trim();
      const hasNotes2 = notes  && String(notes).trim();
      let withClause  = '';
      if (hasReason || hasNotes2) {
        const parts = [];
        if (hasReason) parts.push('Reason: ' + String(reason).trim());
        if (hasNotes2) parts.push('Additional Notes: ' + String(notes).trim());
        withClause = ' with ' + parts.join(' and ');
      }

      const isRevComp    = (poolKey === 'complementary');
      const isRevTesting = (poolKey === 'testing');
      const showRevMETS  = ['committed','unallocated','allocated'].includes(poolKey);

      let totalClause = '';
      if (showRevMETS) {
        const metsRow = await tq1(client, "SELECT COALESCE(SUM(total),0) AS t FROM mets_pools WHERE pool IN ('committed','unallocated','allocated')");
        const metsAfter  = parseFloat(metsRow.t) || 0;
        const metsBefore = metsAfter + amount;
        totalClause = ' Total Available METS updated from ' + fmtAmt(metsBefore) + ' to ' + fmtAmt(metsAfter) + '.';
      } else if (isRevComp || isRevTesting) {
        const creditLabel = isRevComp ? 'Complementary' : 'Testing';
        const poolBefore2 = parseFloat(poolRow.total);
        const poolAfter2  = poolBefore2 - amount;
        totalClause = ' Total ' + creditLabel + ' credits updated from ' + fmtAmt(poolBefore2) + ' to ' + fmtAmt(poolAfter2) + '.';
      }

      const crumb       = poolLabel + (channelName ? ' › ' + qualifiers.join(', ') : '');
      const description = fmtAmt(amount) + ' deducted from ' + poolLabel + featureClause + withClause + '.' + totalClause;

      await tq(client,
        `INSERT INTO mets_audit_logs
           (action, pool, channel, region, category, amount, reason, notes, details, description, ip, status, user_name, department)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Rahul Anand','Admin')`,
        ['METS Deduction', poolKey, channel||null, region||null, category||null, amount, reason||null, notes||null, crumb, description, req.ip||null, 'Success']
      );
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── GET /api/mets/wa-region-balances ─────────────────────────────────────────
app.get('/api/mets/wa-region-balances', async (req, res) => {
  try {
    const poolKey = req.query.pool;
    const rows = poolKey
      ? await q('SELECT region, category, balance FROM mets_wa_region_balances WHERE pool = $1 AND balance > 0', [poolKey])
      : await q('SELECT pool, region, category, balance FROM mets_wa_region_balances WHERE balance > 0');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/sms-type-balances ──────────────────────────────────────────
app.get('/api/mets/sms-type-balances', async (req, res) => {
  try {
    const poolKey = req.query.pool;
    const rows = poolKey
      ? await q('SELECT sms_type, balance FROM mets_sms_type_balances WHERE pool = $1 AND balance > 0', [poolKey])
      : await q('SELECT pool, sms_type, balance FROM mets_sms_type_balances WHERE balance > 0');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/statement ───────────────────────────────────────────────────
app.get('/api/mets/statement', async (req, res) => {
  try {
    const logs = await q('SELECT * FROM mets_audit_logs ORDER BY ts ASC, id ASC');
    let metsBalance = 0;
    const rows = [];

    for (const log of logs) {
      if (!log.amount || log.amount === 0) continue;
      const poolKey = log.pool;
      if (!poolKey) continue;
      if (!['committed','unallocated','allocated'].includes(poolKey)) continue;

      const isCredit = log.action === 'METS Top-up';
      const isDebit  = ['METS Deduction','METS Reversal'].includes(log.action);
      if (!isCredit && !isDebit) continue;

      const opening = metsBalance;
      metsBalance  += isCredit ? log.amount : -log.amount;

      const classification = poolKey === 'committed' ? 'Committed METS' : 'Un-allocated/Allocated METS';
      let feature = '';
      if (log.channel) {
        const ch = CHANNEL_TO_FEAT[log.channel] || (log.channel.charAt(0).toUpperCase() + log.channel.slice(1));
        const qp = [];
        if (log.category) qp.push(log.category.charAt(0).toUpperCase() + log.category.slice(1));
        if (log.region)   qp.push(log.region.includes('-') ? log.region.split('-').slice(1).join('-') : log.region);
        feature = qp.length ? ch + ' (' + qp.join(', ') + ')' : ch;
      } else if (log.details) {
        const idx = log.details.indexOf('\u203a');
        if (idx !== -1) feature = log.details.slice(idx + 1).trim();
      }

      rows.push({
        ts: log.ts, txType: isCredit ? 'Credited' : 'Deducted',
        classification, feature,
        credited: isCredit  ? log.amount : null,
        debited:  !isCredit ? log.amount : null,
        opening, net: metsBalance,
      });
    }

    rows.reverse();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/complementary-report ───────────────────────────────────────
app.get('/api/mets/complementary-report', async (req, res) => {
  try {
    const logs = await q('SELECT * FROM mets_audit_logs ORDER BY ts ASC, id ASC');
    let compBalance = 0;
    const rows = [];

    for (const log of logs) {
      if (!log.amount || log.amount === 0) continue;
      if (log.pool !== 'complementary') continue;

      const isCredit = log.action === 'Complementary Credits';
      const isDebit  = ['METS Deduction','METS Reversal'].includes(log.action);
      if (!isCredit && !isDebit) continue;

      const opening = compBalance;
      compBalance  += isCredit ? log.amount : -log.amount;

      let feature = '';
      if (log.channel) {
        const ch = CHANNEL_TO_FEAT[log.channel] || (log.channel.charAt(0).toUpperCase() + log.channel.slice(1));
        const qp = [];
        if (log.category) qp.push(log.category.charAt(0).toUpperCase() + log.category.slice(1));
        if (log.region)   qp.push(log.region.includes('-') ? log.region.split('-').slice(1).join('-') : log.region);
        feature = qp.length ? ch + ' (' + qp.join(', ') + ')' : ch;
      } else if (log.details) {
        const idx = log.details.indexOf('\u203a');
        if (idx !== -1) feature = log.details.slice(idx + 1).trim();
      }

      rows.push({ ts: log.ts, txType: isCredit ? 'Credited' : 'Deducted', feature,
        credited: isCredit ? log.amount : null, debited: !isCredit ? log.amount : null,
        opening, net: compBalance });
    }

    rows.reverse();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/testing-report ─────────────────────────────────────────────
app.get('/api/mets/testing-report', async (req, res) => {
  try {
    const logs = await q('SELECT * FROM mets_audit_logs ORDER BY ts ASC, id ASC');
    let testBalance = 0;
    const rows = [];

    for (const log of logs) {
      if (!log.amount || log.amount === 0) continue;
      if (log.pool !== 'testing') continue;

      const isCredit = log.action === 'METS Top-up';
      const isDebit  = ['METS Deduction','METS Reversal'].includes(log.action);
      if (!isCredit && !isDebit) continue;

      const opening = testBalance;
      testBalance  += isCredit ? log.amount : -log.amount;

      let feature = '';
      if (log.channel) {
        const ch = CHANNEL_TO_FEAT[log.channel] || (log.channel.charAt(0).toUpperCase() + log.channel.slice(1));
        const qp = [];
        if (log.category) qp.push(log.category.charAt(0).toUpperCase() + log.category.slice(1));
        if (log.region)   qp.push(log.region.includes('-') ? log.region.split('-').slice(1).join('-') : log.region);
        feature = qp.length ? ch + ' (' + qp.join(', ') + ')' : ch;
      } else if (log.details) {
        const idx = log.details.indexOf('\u203a');
        if (idx !== -1) feature = log.details.slice(idx + 1).trim();
      }

      rows.push({ ts: log.ts, txType: isCredit ? 'Credited' : 'Deducted', feature,
        credited: isCredit ? log.amount : null, debited: !isCredit ? log.amount : null,
        opening, net: testBalance });
    }

    rows.reverse();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/audit-logs ──────────────────────────────────────────────────
app.get('/api/mets/audit-logs', async (req, res) => {
  try {
    const logs = await q("SELECT * FROM mets_audit_logs WHERE action != 'METS Deduction' ORDER BY ts DESC LIMIT 200");
    res.json(logs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/usage ───────────────────────────────────────────────────────
app.get('/api/mets/usage', async (req, res) => {
  try {
    const rows = await q(`
      SELECT job_id, ts, pingback_ts, feature, channel, region, category, sms_type,
             credits_held, held_amount, source_breakdown
      FROM mets_transit
      WHERE status = 'consumed'
      ORDER BY pingback_ts DESC NULLS LAST, ts DESC
    `);

    const result = rows.map(row => {
      const bd          = row.source_breakdown || {};
      const testingCred = bd.testing       ? (bd.testing.credits      || 0) : 0;
      const compCred    = bd.complementary ? (bd.complementary.credits || 0) : 0;
      const commMets    = bd.committed     ? (bd.committed.mets        || 0) : 0;
      const unallocMets = bd.unallocated   ? (bd.unallocated.mets      || 0) : 0;
      const metsUsed    = Math.round((commMets + unallocMets) * 1e6) / 1e6;
      const { rate }    = getFeatureRate(row.feature, row.sms_type, row.category);

      return {
        ts:             row.pingback_ts || row.ts,
        type:           row.sms_type ? (row.sms_type.charAt(0).toUpperCase() + row.sms_type.slice(1)) : 'NA',
        channel:        CHANNEL_TO_FEAT[row.channel] || row.feature,
        templateType:   row.category ? (row.category.charAt(0).toUpperCase() + row.category.slice(1)) : '-',
        sentCount:      row.credits_held || 0,
        cpmcps:         rate,
        metsUsed:       metsUsed || null,
        compCredits:    compCred  || null,
        testingCredits: testingCred || null,
      };
    });

    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/mets/pricing ─────────────────────────────────────────────────────
app.get('/api/mets/pricing', async (req, res) => {
  try {
    const rows = await q('SELECT field, value FROM mets_pricing');
    const result = {};
    for (const row of rows) result[row.field] = row.value;
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/mets/pricing-change ────────────────────────────────────────────
app.post('/api/mets/pricing-change', async (req, res) => {
  const { changes } = req.body;
  if (!Array.isArray(changes) || !changes.length) {
    return res.status(400).json({ error: 'Missing or empty changes array' });
  }

  try {
    await withTx(async (client) => {
      for (const c of changes) {
        await tq(client,
          'INSERT INTO mets_pricing (field, value) VALUES ($1,$2) ON CONFLICT (field) DO UPDATE SET value = $2',
          [c.field, String(c.newValue)]
        );
      }

      const lines       = changes.map(c => (c.field||'?') + ': ' + (c.oldValue??'0') + ' to ' + (c.newValue??'0'));
      const details     = changes.map(c => c.field).join(', ');
      const description = 'Pricing updated for ' + lines.join(', ') + '.';

      await tq(client,
        `INSERT INTO mets_audit_logs
           (action, pool, channel, region, category, amount, reason, notes, details, description, ip, status, user_name, department)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Rahul Anand','Admin')`,
        ['Pricing Change', null, null, null, null, null, null, null, details, description, req.ip||null, 'Success']
      );
    });

    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Helper: resolve feature → pricing rate ────────────────────────────────────
function getFeatureRate(feature, smsType, category) {
  const staticMap = {
    'Email': 'Email (CPM)', 'Niaa': 'Niaa (CPS)',
    'Mio AI Guide': 'Mio AI Guide (CPS)', 'Mio AI Voice': 'Mio AI Voice Cost Per Pulse',
    'Mio AI Coach': 'Mio AI Coach (CPS)',
  };
  let field;
  if (feature === 'SMS') {
    field = (smsType === 'international') ? 'SMS International (CPS)' : 'SMS Domestic (CPS)';
  } else if (feature === 'WhatsApp') {
    const catMap = { service:'WhatsApp Service (CPS)', marketing:'WhatsApp Marketing (CPS)',
                     utility:'WhatsApp Utility (CPS)', authentication:'WhatsApp Authentication (CPS)' };
    field = catMap[(category || '').toLowerCase()] || 'WhatsApp Service (CPS)';
  } else {
    field = staticMap[feature] || null;
  }
  return { field, rate: 0 }; // rate resolved async in routes that need it
}

// Async version that hits the DB
async function getFeatureRateAsync(feature, smsType, category) {
  const { field } = getFeatureRate(feature, smsType, category);
  if (!field) return { field: null, rate: 0 };
  const row = await q1('SELECT value FROM mets_pricing WHERE field = $1', [field]);
  return { field, rate: row ? (parseFloat(row.value) || 0) : 0 };
}

// ── Helper: get channel balance (within transaction) ──────────────────────────
async function getChannelBal(client, poolKey, channel) {
  const row = await tq1(client, 'SELECT balance FROM mets_channels WHERE pool = $1 AND channel = $2', [poolKey, channel]);
  return row ? (parseFloat(row.balance) || 0) : 0;
}

// ── GET /api/mets/available-credits ──────────────────────────────────────────
app.get('/api/mets/available-credits', async (req, res) => {
  try {
    const { feature, smsType, category } = req.query;
    const channel = FEAT_TO_CHANNEL[feature];
    if (!channel) return res.status(400).json({ error: 'Unknown feature: ' + feature });

    const { rate, field: pricingField } = await getFeatureRateAsync(feature, smsType, category);

    const testingBal   = (await q1('SELECT balance FROM mets_channels WHERE pool=$1 AND channel=$2', ['testing',       channel]))?.balance || 0;
    const compBal      = (await q1('SELECT balance FROM mets_channels WHERE pool=$1 AND channel=$2', ['complementary', channel]))?.balance || 0;
    const committedBal = (await q1('SELECT balance FROM mets_channels WHERE pool=$1 AND channel=$2', ['committed',     channel]))?.balance || 0;
    const unallocRow   = await q1("SELECT total FROM mets_pools WHERE pool = 'unallocated'");
    const unallocBal   = unallocRow ? (parseFloat(unallocRow.total) || 0) : 0;

    const metsCredits  = rate > 0 ? Math.floor((parseFloat(committedBal) + unallocBal) / rate) : 0;
    const totalCredits = parseFloat(testingBal) + parseFloat(compBal) + metsCredits;

    res.json({
      feature, channel, rate, pricing_field: pricingField,
      balances: { testing: testingBal, complementary: compBal, committed: committedBal, unallocated: unallocBal },
      credits:  { testing: testingBal, complementary: compBal, mets: metsCredits, total: totalCredits },
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST /api/mets/consume ────────────────────────────────────────────────────
app.post('/api/mets/consume', async (req, res) => {
  const { feature, credits, smsType, region, category } = req.body;
  const creditsReq = Math.floor(Number(credits));
  if (!feature || !creditsReq || creditsReq <= 0) {
    return res.status(400).json({ error: 'Invalid feature or credits amount' });
  }

  const channel = FEAT_TO_CHANNEL[feature];
  if (!channel) return res.status(400).json({ error: 'Unknown feature: ' + feature });

  const prefixMap = { 'Email':'EML', 'SMS':'SMS', 'WhatsApp':'WA', 'Niaa':'NIA', 'Mio AI Guide':'GDE', 'Mio AI Voice':'AIV', 'Mio AI Coach':'AIC' };
  const jobId = prefixMap[feature] + '-' + String(Math.floor(10000 + Math.random() * 90000));

  try {
    const { rate, field: pricingField } = await getFeatureRateAsync(feature, smsType, category);

    const result = await withTx(async (client) => {
      let creditsLeft = creditsReq;
      const breakdown = {};

      // 1. Testing credits
      const testBal = await getChannelBal(client, 'testing', channel);
      if (testBal > 0 && creditsLeft > 0) {
        const take = Math.min(creditsLeft, testBal);
        await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool=$2 AND channel=$3', [take, 'testing', channel]);
        await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool=$2', [take, 'testing']);
        breakdown.testing = { credits: take };
        creditsLeft -= take;
      }

      // 2. Complementary credits
      if (creditsLeft > 0) {
        const compBal = await getChannelBal(client, 'complementary', channel);
        if (compBal > 0) {
          const take = Math.min(creditsLeft, compBal);
          await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool=$2 AND channel=$3', [take, 'complementary', channel]);
          await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool=$2', [take, 'complementary']);
          breakdown.complementary = { credits: take };
          creditsLeft -= take;
        }
      }

      // 3. Committed METS
      if (creditsLeft > 0 && rate > 0) {
        const commBal = await getChannelBal(client, 'committed', channel);
        if (commBal > 0) {
          const maxCred  = Math.floor(commBal / rate);
          const takeCred = Math.min(creditsLeft, maxCred);
          const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
          if (takeMets > 0) {
            await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool=$2 AND channel=$3', [takeMets, 'committed', channel]);
            await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool=$2', [takeMets, 'committed']);
            breakdown.committed = { credits: takeCred, mets: takeMets };
            creditsLeft -= takeCred;
          }
        }
      }

      // 4. Unallocated METS
      if (creditsLeft > 0 && rate > 0) {
        const unallocRow = await tq1(client, "SELECT total FROM mets_pools WHERE pool='unallocated'");
        const unallocBal = unallocRow ? (parseFloat(unallocRow.total) || 0) : 0;
        if (unallocBal > 0) {
          const maxCred  = Math.floor(unallocBal / rate);
          const takeCred = Math.min(creditsLeft, maxCred);
          const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
          if (takeMets > 0) {
            await tq(client, "UPDATE mets_pools SET total = total - $1 WHERE pool='unallocated'", [takeMets]);
            breakdown.unallocated = { credits: takeCred, mets: takeMets };
            creditsLeft -= takeCred;
          }
        }
      }

      const creditsHeld = creditsReq - creditsLeft;
      if (creditsHeld <= 0) throw Object.assign(new Error('Insufficient credits balance across all pools'), { status: 400 });

      const metsHeld = (breakdown.committed   ? (breakdown.committed.mets   || 0) : 0)
                     + (breakdown.unallocated ? (breakdown.unallocated.mets || 0) : 0);

      await tq(client,
        `INSERT INTO mets_transit
           (job_id, feature, channel, region, category, sms_type, requested_amount, held_amount, credits_held, source_breakdown)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [jobId, feature, channel, region||null, category||null, smsType||null, creditsReq, metsHeld, creditsHeld, JSON.stringify(breakdown)]
      );

      return { job_id: jobId, credits_held: creditsHeld, mets_held: metsHeld, source_breakdown: breakdown, rate, partial: creditsLeft > 0 };
    });

    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── Helper: consume credits from pools inside a transaction ───────────────────
async function consumeCreditsFromPools(client, channel, rate, creditsReq) {
  let creditsLeft = creditsReq;
  const bd = {};

  const testBal = await getChannelBal(client, 'testing', channel);
  if (testBal > 0 && creditsLeft > 0) {
    const take = Math.min(creditsLeft, testBal);
    await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool=$2 AND channel=$3', [take, 'testing', channel]);
    await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool=$2', [take, 'testing']);
    bd.testing = { credits: take };
    creditsLeft -= take;
  }
  if (creditsLeft > 0) {
    const compBal = await getChannelBal(client, 'complementary', channel);
    if (compBal > 0) {
      const take = Math.min(creditsLeft, compBal);
      await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool=$2 AND channel=$3', [take, 'complementary', channel]);
      await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool=$2', [take, 'complementary']);
      bd.complementary = { credits: take };
      creditsLeft -= take;
    }
  }
  if (creditsLeft > 0 && rate > 0) {
    const commBal = await getChannelBal(client, 'committed', channel);
    if (commBal > 0) {
      const maxCred = Math.floor(commBal / rate); const takeCred = Math.min(creditsLeft, maxCred);
      const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
      if (takeMets > 0) {
        await tq(client, 'UPDATE mets_channels SET balance = GREATEST(0, balance - $1) WHERE pool=$2 AND channel=$3', [takeMets, 'committed', channel]);
        await tq(client, 'UPDATE mets_pools SET total = GREATEST(0, total - $1) WHERE pool=$2', [takeMets, 'committed']);
        bd.committed = { credits: takeCred, mets: takeMets };
        creditsLeft -= takeCred;
      }
    }
  }
  if (creditsLeft > 0 && rate > 0) {
    const unallocRow = await tq1(client, "SELECT total FROM mets_pools WHERE pool='unallocated'");
    const unallocBal = unallocRow ? (parseFloat(unallocRow.total) || 0) : 0;
    if (unallocBal > 0) {
      const maxCred = Math.floor(unallocBal / rate); const takeCred = Math.min(creditsLeft, maxCred);
      const takeMets = Math.round(takeCred * rate * 1e6) / 1e6;
      if (takeMets > 0) {
        await tq(client, "UPDATE mets_pools SET total = total - $1 WHERE pool='unallocated'", [takeMets]);
        bd.unallocated = { credits: takeCred, mets: takeMets };
        creditsLeft -= takeCred;
      }
    }
  }
  return { breakdown: bd, creditsConsumed: creditsReq - creditsLeft };
}

// ── Helper: insert deduction audit log entries ────────────────────────────────
async function insertDeductionLogs(client, transit, poolBreakdown, jobId) {
  const fmtN = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  for (const [pool, v] of Object.entries(poolBreakdown)) {
    const credAmt = typeof v === 'object' ? (v.credits || 0) : v;
    const metsAmt = typeof v === 'object' ? (v.mets    || 0) : v;
    const isMetsBased = ['committed','unallocated'].includes(pool);
    const logAmt = isMetsBased ? metsAmt : credAmt;
    if (logAmt <= 0) continue;
    const desc = isMetsBased
      ? `${fmtN(credAmt)} credits (${fmtN(metsAmt)} METS) consumed from ${pool} for ${transit.feature} — Job ${jobId}`
      : `${fmtN(credAmt)} credits consumed from ${pool} for ${transit.feature} — Job ${jobId}`;
    await tq(client,
      `INSERT INTO mets_audit_logs
         (action, pool, channel, region, category, amount, reason, notes, details, description, ip, status, user_name, department)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Rahul Anand','Admin')`,
      ['METS Deduction', pool, transit.channel, transit.region, transit.category, logAmt, 'Consumption — Job: '+jobId, null, jobId, desc, null, 'Success']
    );
  }
}

// ── POST /api/mets/pingback ───────────────────────────────────────────────────
app.post('/api/mets/pingback', async (req, res) => {
  const { job_id, status, success_credits, failure_credits, extra_credits } = req.body;
  if (!job_id) return res.status(400).json({ error: 'job_id required' });

  try {
    const result = await withTx(async (client) => {
      const transit = await tq1(client, 'SELECT * FROM mets_transit WHERE job_id = $1', [job_id]);
      if (!transit) throw Object.assign(new Error('Job not found: ' + job_id), { status: 404 });
      if (transit.status !== 'held') throw Object.assign(new Error('Job already settled with status: ' + transit.status), { status: 400 });

      const now        = Math.floor(Date.now() / 1000);
      const breakdown  = transit.source_breakdown || {};
      const fmtN       = n => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const getMets    = v => (typeof v === 'object' ? (v.mets    || 0) : v);
      const getCredits = v => (typeof v === 'object' ? (v.credits || 0) : v);
      const totalCred  = parseFloat(transit.credits_held) || parseFloat(transit.held_amount);

      let sucCred, failCred;
      if (success_credits !== undefined || failure_credits !== undefined) {
        sucCred  = Math.max(0, Math.round((Number(success_credits)  || 0) * 1e6) / 1e6);
        failCred = Math.max(0, Math.round((Number(failure_credits) || 0) * 1e6) / 1e6);
      } else if (status === 'success') {
        sucCred = totalCred; failCred = 0;
      } else if (status === 'failure') {
        sucCred = 0; failCred = totalCred;
      } else {
        throw Object.assign(new Error('Provide status or success_credits/failure_credits'), { status: 400 });
      }

      if (sucCred + failCred > totalCred + 0.0001) throw Object.assign(new Error(`success+failure exceeds held (${totalCred})`), { status: 400 });
      if (sucCred + failCred <= 0) throw Object.assign(new Error('At least one of success_credits or failure_credits must be > 0'), { status: 400 });

      const pendingCred = Math.max(0, Math.round((totalCred - sucCred - failCred) * 1e6) / 1e6);
      const PRIORITY    = ['testing','complementary','committed','unallocated'];

      // Success breakdown
      const sucBreakdown = {};
      let sucLeft = sucCred;
      for (const pool of PRIORITY) {
        if (!breakdown[pool] || sucLeft <= 0) continue;
        const v = breakdown[pool]; const heldCred = getCredits(v);
        if (heldCred <= 0) continue;
        const takeCred = Math.min(sucLeft, heldCred);
        const isM = ['committed','unallocated'].includes(pool);
        sucBreakdown[pool] = isM
          ? { credits: takeCred, mets: heldCred > 0 ? Math.round((takeCred/heldCred)*getMets(v)*1e6)/1e6 : 0 }
          : { credits: takeCred };
        sucLeft -= takeCred;
      }

      // Remaining after success
      const remainBreakdown = {};
      let remainCred = 0;
      for (const pool of PRIORITY) {
        if (!breakdown[pool]) continue;
        const v = breakdown[pool]; const heldCred = getCredits(v);
        const sucCred_ = sucBreakdown[pool] ? getCredits(sucBreakdown[pool]) : 0;
        const remCred  = Math.round((heldCred - sucCred_) * 1e6) / 1e6;
        if (remCred <= 0) continue;
        const isM = ['committed','unallocated'].includes(pool);
        remainBreakdown[pool] = isM
          ? { credits: remCred, mets: Math.round((getMets(v)-(sucBreakdown[pool]?getMets(sucBreakdown[pool]):0))*1e6)/1e6 }
          : { credits: remCred };
        remainCred += remCred;
      }

      // Return failed credits
      if (failCred > 0 && remainCred > 0) {
        const failRatio = Math.min(1, failCred / remainCred);
        for (const [pool, v] of Object.entries(remainBreakdown)) {
          const isM = ['committed','unallocated'].includes(pool);
          const returnAmt = isM
            ? Math.round(getMets(v) * failRatio * 1e6) / 1e6
            : Math.round(getCredits(v) * failRatio * 1e6) / 1e6;
          if (returnAmt <= 0) continue;
          if (pool === 'unallocated') {
            await tq(client, "UPDATE mets_pools SET total = total + $1 WHERE pool='unallocated'", [returnAmt]);
          } else {
            await tq(client, 'UPDATE mets_channels SET balance = balance + $1 WHERE pool=$2 AND channel=$3', [returnAmt, pool, transit.channel]);
            await tq(client, 'UPDATE mets_pools SET total = total + $1 WHERE pool=$2', [returnAmt, pool]);
          }
        }
      }

      if (sucCred > 0) await insertDeductionLogs(client, transit, sucBreakdown, job_id);

      // Extra credits
      let extraResult = null;
      const extraCred = Math.max(0, Math.round((Number(extra_credits)||0)*1e6)/1e6);
      if (extraCred > 0) {
        const { rate } = await getFeatureRateAsync(transit.feature, transit.sms_type, transit.category);
        extraResult = await consumeCreditsFromPools(client, transit.channel, rate, extraCred);
        if (extraResult.creditsConsumed > 0) await insertDeductionLogs(client, transit, extraResult.breakdown, job_id);
      }

      if (pendingCred > 0) {
        const pendRatio = remainCred > 0 ? pendingCred / remainCred : 0;
        const newBreakdown = {};
        for (const [pool, v] of Object.entries(remainBreakdown)) {
          const pCred = Math.round(getCredits(v) * pendRatio * 1e6) / 1e6;
          if (pCred <= 0) continue;
          const isM = ['committed','unallocated'].includes(pool);
          newBreakdown[pool] = isM ? { credits: pCred, mets: Math.round(getMets(v)*pendRatio*1e6)/1e6 } : { credits: pCred };
        }
        const newMetsHeld = (newBreakdown.committed   ? (newBreakdown.committed.mets   || 0) : 0)
                          + (newBreakdown.unallocated ? (newBreakdown.unallocated.mets || 0) : 0);
        await tq(client,
          'UPDATE mets_transit SET held_amount=$1, credits_held=$2, source_breakdown=$3 WHERE job_id=$4',
          [newMetsHeld, pendingCred, JSON.stringify(newBreakdown), job_id]
        );
        return { status:'partial', success_credits:sucCred, failure_credits:failCred, pending_credits:pendingCred, pending_mets:newMetsHeld,
          extra_credits_consumed: extraResult ? extraResult.creditsConsumed : 0,
          message: `${fmtN(sucCred)} consumed, ${fmtN(failCred)} released, ${fmtN(pendingCred)} still pending for job ${job_id}` };
      }

      const finalStatus   = sucCred > 0 ? 'consumed' : 'released';
      const pingbackLabel = sucCred === totalCred ? 'success' : failCred === totalCred ? 'failure' : 'partial';
      let finalCreditsHeld = sucCred;
      let finalBreakdown   = { ...sucBreakdown };
      if (extraResult && extraResult.creditsConsumed > 0) {
        finalCreditsHeld += extraResult.creditsConsumed;
        for (const [pool, v] of Object.entries(extraResult.breakdown)) {
          const eCred = typeof v === 'object' ? (v.credits||0) : v;
          const eMets = typeof v === 'object' ? (v.mets||0) : 0;
          if (finalBreakdown[pool]) {
            finalBreakdown[pool] = {
              credits: Math.round((getCredits(finalBreakdown[pool])+eCred)*1e6)/1e6,
              ...(eMets || getMets(finalBreakdown[pool]) ? { mets: Math.round((getMets(finalBreakdown[pool])+eMets)*1e6)/1e6 } : {}),
            };
          } else {
            finalBreakdown[pool] = typeof v === 'object' ? { ...v } : { credits: v };
          }
        }
      }

      await tq(client,
        'UPDATE mets_transit SET status=$1, pingback_ts=$2, pingback_status=$3, credits_held=$4, source_breakdown=$5 WHERE job_id=$6',
        [finalStatus, now, pingbackLabel, finalCreditsHeld, JSON.stringify(finalBreakdown), job_id]
      );

      return { status: finalStatus, success_credits: sucCred, failure_credits: failCred, pending_credits: 0,
        extra_credits_consumed: extraResult ? extraResult.creditsConsumed : 0,
        message: sucCred > 0 ? `${fmtN(sucCred)} credits permanently consumed for job ${job_id}` : `${fmtN(failCred)} credits released back to pools for job ${job_id}` };
    });

    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── GET /api/mets/transit ─────────────────────────────────────────────────────
app.get('/api/mets/transit', async (req, res) => {
  try {
    const rows = await q(`
      SELECT job_id, ts, feature, channel, region, category, sms_type,
             requested_amount, held_amount, credits_held, source_breakdown, status
      FROM mets_transit WHERE status='held' ORDER BY ts DESC
    `);
    res.json(rows.map(row => ({
      ...row,
      created_at:       row.ts,
      credits_held:     row.credits_held || row.held_amount,
      source_breakdown: row.source_breakdown || {},
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DELETE /api/mets/audit-logs ───────────────────────────────────────────────
app.delete('/api/mets/audit-logs', async (req, res) => {
  try {
    await pool.query('DELETE FROM mets_audit_logs');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── METS Settings ─────────────────────────────────────────────────────────────
app.get('/api/mets/settings', async (req, res) => {
  try {
    const rows = await q('SELECT key, value FROM mets_settings');
    const out = {};
    rows.forEach(r => { try { out[r.key] = JSON.parse(r.value); } catch(e) { out[r.key] = null; } });
    res.json({ ok: true, settings: out });
  } catch(e) { res.json({ ok: true, settings: {} }); }
});

app.post('/api/mets/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    if (settings && typeof settings === 'object') {
      for (const k of Object.keys(settings)) {
        await pool.query(
          'INSERT INTO mets_settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2',
          [k, JSON.stringify(settings[k])]
        );
      }
    }
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ── Fallback → index.html ─────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Meritto Admin → http://localhost:${PORT}\n`);
});
