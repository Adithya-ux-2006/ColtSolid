import { getApiUrl } from './api.js';

const interpretationCache = new Map();
const CACHE_TTL_MS = 20 * 60 * 1000;
const inflightRequests = new Map();

function getCachedResult(key) {
  const entry = interpretationCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    interpretationCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCacheResult(key, value) {
  if (interpretationCache.size > 200) {
    const oldestKey = interpretationCache.keys().next().value;
    interpretationCache.delete(oldestKey);
  }
  interpretationCache.set(key, { value, timestamp: Date.now() });
}

export async function fetchGeminiInterpretation(query, symptoms) {
  if (!query || query.trim().length < 2) return null;
  if (!symptoms?.length) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `${normalizedQuery}::${symptoms.length}`;
  const cached = getCachedResult(cacheKey);
  if (cached) return cached;

  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const symptomCatalog = symptoms.map(s => ({ id: s.id, label: s.label }));

      console.log('[GEMINI-CLIENT] Fetching interpretation for:', normalizedQuery);
      const response = await fetch(getApiUrl('/api/gemini-nlu'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: normalizedQuery,
          symptoms: symptomCatalog,
        }),
      });

      const payload = await response.json();
      console.log('[GEMINI-CLIENT] Response status:', response.status, 'source:', payload.source, 'has interpretation:', Boolean(payload.interpretation));

      if (!response.ok || !payload.interpretation) {
        console.log('[GEMINI-CLIENT] No interpretation. reason:', payload.reason || 'response not ok');
        return null;
      }

      setCacheResult(cacheKey, payload.interpretation);
      return payload.interpretation;
    } catch (err) {
      console.error('[GEMINI-CLIENT] Fetch failed:', err?.message || err);
      return null;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  inflightRequests.set(cacheKey, promise);
  return promise;
}
