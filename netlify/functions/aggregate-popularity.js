// netlify/functions/aggregate-popularity.js
// Scheduled Netlify function: computes popularity scores from remedy_interactions
// and upserts into remedy_popularity table. Runs daily via Netlify cron.
//
// Weighting: favorite ×3, schedule_add ×2, detail_view ×1
// Normalized to 0-10 scale per symptom.

const CRON_SECRET = process.env.CRON_SECRET;

function getSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function computePopularity(supabase) {
  // Query interactions from last 30 days, weighted by event type
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const response = await fetch(
    `${supabase.url}/rest/v1/rpc/aggregate_remedy_popularity`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabase.key,
        'Authorization': `Bearer ${supabase.key}`,
      },
      body: JSON.stringify({ since: thirtyDaysAgo }),
    }
  );

  // If the RPC function doesn't exist, fall back to raw query
  if (!response.ok) {
    return await computePopularityFallback(supabase, thirtyDaysAgo);
  }

  return await response.json();
}

async function computePopularityFallback(supabase, since) {
  // Raw SQL fallback: aggregate with weighted scoring
  const query = `
    SELECT
      symptom_id,
      remedy_id,
      SUM(CASE WHEN event_type = 'favorite' THEN 3
               WHEN event_type = 'schedule_add' THEN 2
               WHEN event_type = 'detail_view' THEN 1
               ELSE 0 END) AS raw_score,
      COUNT(*) AS interaction_count
    FROM public.remedy_interactions
    WHERE created_at >= '${since}'
    GROUP BY symptom_id, remedy_id
  `;

  const response = await fetch(
    `${supabase.url}/rest/v1/rpc/exec_sql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabase.key,
        'Authorization': `Bearer ${supabase.key}`,
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    // Last resort: direct REST query with manual aggregation
    return await computePopularityDirect(supabase, since);
  }

  return await response.json();
}

async function computePopularityDirect(supabase, since) {
  // Fetch all recent interactions and compute in-memory
  const response = await fetch(
    `${supabase.url}/rest/v1/remedy_interactions?created_at=gte.${since}&select=symptom_id,remedy_id,event_type`,
    {
      headers: {
        'apikey': supabase.key,
        'Authorization': `Bearer ${supabase.key}`,
      },
    }
  );

  if (!response.ok) return [];

  const rows = await response.json();
  const grouped = {};

  for (const row of rows) {
    const key = `${row.symptom_id}::${row.remedy_id}`;
    if (!grouped[key]) {
      grouped[key] = { symptom_id: row.symptom_id, remedy_id: row.remedy_id, raw_score: 0, count: 0 };
    }
    grouped[key].raw_score += row.event_type === 'favorite' ? 3
      : row.event_type === 'schedule_add' ? 2 : 1;
    grouped[key].count += 1;
  }

  return Object.values(grouped).map(g => ({
    symptom_id: g.symptom_id,
    remedy_id: g.remedy_id,
    raw_score: g.raw_score,
    interaction_count: g.count,
  }));
}

function normalizeScores(rows) {
  // Group by symptom to normalize per-symptom
  const bySymptom = {};
  for (const row of rows) {
    if (!bySymptom[row.symptom_id]) bySymptom[row.symptom_id] = [];
    bySymptom[row.symptom_id].push(row);
  }

  const results = [];
  for (const [, entries] of Object.entries(bySymptom)) {
    const maxScore = Math.max(...entries.map(e => e.raw_score), 1);
    for (const entry of entries) {
      results.push({
        symptom_id: entry.symptom_id,
        remedy_id: entry.remedy_id,
        popularity_score: Math.round((entry.raw_score / maxScore) * 10 * 100) / 100,
        interaction_count: entry.interaction_count,
      });
    }
  }

  return results;
}

async function upsertPopularity(supabase, scores) {
  if (scores.length === 0) return;

  // Batch upsert in chunks of 100
  const CHUNK = 100;
  for (let i = 0; i < scores.length; i += CHUNK) {
    const chunk = scores.slice(i, i + CHUNK).map(s => ({
      symptom_id: s.symptom_id,
      remedy_id: s.remedy_id,
      popularity_score: s.popularity_score,
      interaction_count: s.interaction_count,
      last_computed: new Date().toISOString(),
    }));

    const response = await fetch(`${supabase.url}/rest/v1/remedy_popularity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabase.key,
        'Authorization': `Bearer ${supabase.key}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(chunk),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[AGGREGATE-POPULARITY] Upsert chunk ${i}-${i + CHUNK} failed:`, text);
    }
  }
}

export async function handler(event) {
  // Verify cron secret for scheduled invocations
  const authHeader = event.headers.authorization;
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    // Also allow manual invocation from dashboard (no auth check)
    if (!event.queryStringParameters?.force) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { statusCode: 200, body: JSON.stringify({ error: 'Supabase not configured' }) };
    }

    console.log('[AGGREGATE-POPULARITY] Starting daily aggregation...');
    const rawScores = await computePopularity(supabase);
    const normalized = normalizeScores(rawScores);

    console.log(`[AGGREGATE-POPULARITY] Computed ${normalized.length} popularity scores`);
    await upsertPopularity(supabase, normalized);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        scoresComputed: normalized.length,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (err) {
    console.error('[AGGREGATE-POPULARITY] Error:', err?.message || err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Aggregation failed' }) };
  }
}
