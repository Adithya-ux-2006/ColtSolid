// src/engine/semanticFallback.js
// Client-side semantic search fallback. Calls the semantic-fallback Netlify function
// to embed the query and find the most similar symptom via pgvector cosine search.
// Only invoked when the deterministic engine and Gemini NLU both fail to resolve a match.

let inflightRequest = null;

/**
 * Find the best semantic match for a query using Gemini embeddings + pgvector.
 * @param {string} query - The user's search query
 * @returns {Promise<{ symptomId: string, label: string, score: number } | null>}
 */
export async function findBestSemanticMatch(query) {
  if (!query || query.trim().length < 3) return null;

  // Deduplicate concurrent requests for the same query
  if (inflightRequest?.query === query) {
    return inflightRequest.promise;
  }

  const promise = executeSemanticSearch(query);
  inflightRequest = { query, promise };

  try {
    return await promise;
  } finally {
    inflightRequest = null;
  }
}

async function executeSemanticSearch(query) {
  try {
    const response = await fetch('/api/semantic-fallback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.trim() }),
    });

    if (!response.ok) {
      console.log('[SEMANTIC-FALLBACK] Request failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.match && data.match.symptomId && data.match.score >= 0.75) {
      console.log(`[SEMANTIC-FALLBACK] Resolved "${query}" → ${data.match.label} (score: ${data.match.score})`);
      return data.match;
    }

    console.log(`[SEMANTIC-FALLBACK] No match for "${query}" (source: ${data.source})`);
    return null;
  } catch (err) {
    console.error('[SEMANTIC-FALLBACK] Network error:', err?.message || err);
    return null;
  }
}
