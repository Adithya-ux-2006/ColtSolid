// netlify/functions/semantic-fallback.js
// Embeds a user query using Gemini text-embedding-004 and finds the most similar
// symptom via pgvector cosine similarity search. Last-resort fallback only.

import { GoogleGenAI } from '@google/genai';
import { parseBody } from './_parseBody.js';
import { applySecurity, buildResponse, sanitizeInput, isValidQuery, getCORSHeaders } from './_middleware.js';

const EMBEDDING_MODEL = 'text-embedding-004';
const TIMEOUT_MS = 8000;
const SIMILARITY_THRESHOLD = 0.75;

function getSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function embedQuery(query, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: query,
      config: {
        taskType: 'RETRIEVAL_QUERY',
      },
      signal: controller.signal,
    });

    const embedding = response.embedding?.values;
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      throw new Error('Empty embedding response');
    }

    return embedding;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function findSimilarSymptom(supabase, embedding) {
  // Use pgvector cosine distance operator <=>
  // similarity = 1 - distance
  const embeddingStr = `[${embedding.join(',')}]`;

  const response = await fetch(
    `${supabase.url}/rest/v1/symptom_embeddings?select=symptom_id,label,embedding&order=embedding <=> '${embeddingStr}'&limit=1`,
    {
      headers: {
        'apikey': supabase.key,
        'Authorization': `Bearer ${supabase.key}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase query failed (${response.status}): ${text}`);
  }

  const rows = await response.json();
  if (!rows || rows.length === 0) return null;

  // Compute cosine similarity from the returned embedding
  const stored = rows[0].embedding;
  const similarity = 1 - cosineDistance(embedding, stored);

  if (similarity < SIMILARITY_THRESHOLD) return null;

  return {
    symptomId: rows[0].symptom_id,
    label: rows[0].label,
    score: Math.round(similarity * 1000) / 1000,
  };
}

function cosineDistance(a, b) {
  if (a.length !== b.length) return 1;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 1;
  return 1 - dot / denom;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCORSHeaders(event), body: '' };
  }

  const sec = applySecurity(event, { ai: true });
  if (sec) return sec;
  if (event.httpMethod !== 'POST') {
    return buildResponse(405, { error: 'Method not allowed.' });
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return buildResponse(200, { match: null, source: 'unavailable' });
    }

    const body = await parseBody(event);
    const rawQuery = body.query?.trim();

    if (!rawQuery || !isValidQuery(rawQuery)) {
      return buildResponse(400, { error: 'Valid query is required.' });
    }

    const query = sanitizeInput(rawQuery, { maxLength: 200 });

    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || '').trim();
    if (!apiKey) {
      return buildResponse(200, { match: null, source: 'unavailable' });
    }

    // Embed the query
    const embedding = await embedQuery(query, apiKey);

    // Find most similar symptom via pgvector
    const match = await findSimilarSymptom(supabase, embedding);

    return buildResponse(200, {
      match,
      source: match ? 'semantic' : 'no_match',
    });
  } catch (err) {
    console.error('[SEMANTIC-FALLBACK] Error:', err?.message || err);
    return buildResponse(200, { match: null, source: 'error' });
  }
}
