// netlify/functions/track-interaction.js
// Records anonymous remedy interaction events (favorite, schedule_add, detail_view)
// for usage-based popularity re-ranking. No user_id needed — aggregate signal only.

import { parseBody } from './_parseBody.js';
import { applySecurity, buildResponse, getCORSHeaders } from './_middleware.js';

const VALID_EVENT_TYPES = ['favorite', 'schedule_add', 'detail_view'];
const MAX_BATCH_SIZE = 10;

function getSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function insertInteractions(supabase, events) {
  const rows = events.map(({ symptomId, remedyId, eventType }) => ({
    symptom_id: symptomId,
    remedy_id: remedyId,
    event_type: eventType,
  }));

  const response = await fetch(`${supabase.url}/rest/v1/remedy_interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabase.key,
      'Authorization': `Bearer ${supabase.key}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${text}`);
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCORSHeaders(event), body: '' };
  }

  const sec = applySecurity(event, { ai: false });
  if (sec) return sec;
  if (event.httpMethod !== 'POST') {
    return buildResponse(405, { error: 'Method not allowed.' });
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return buildResponse(200, { tracked: 0, source: 'unavailable' });
    }

    const body = await parseBody(event);

    // Support single event or batch
    const rawEvents = Array.isArray(body.events) ? body.events : [body];
    if (rawEvents.length === 0 || rawEvents.length > MAX_BATCH_SIZE) {
      return buildResponse(400, { error: `Events must be 1-${MAX_BATCH_SIZE}.` });
    }

    // Validate all events
    const validEvents = [];
    for (const evt of rawEvents) {
      const { symptomId, remedyId, eventType } = evt;
      if (!symptomId || !remedyId || !VALID_EVENT_TYPES.includes(eventType)) {
        continue; // Skip invalid events silently
      }
      validEvents.push({
        symptomId: String(symptomId).slice(0, 50),
        remedyId: String(remedyId).slice(0, 50),
        eventType,
      });
    }

    if (validEvents.length === 0) {
      return buildResponse(400, { error: 'No valid events provided.' });
    }

    await insertInteractions(supabase, validEvents);

    return buildResponse(200, { tracked: validEvents.length });
  } catch (err) {
    console.error('[TRACK-INTERACTION] Error:', err?.message || err);
    return buildResponse(200, { tracked: 0, error: 'Internal error' });
  }
}
