/* global process */
import { parseBody } from './_parseBody.js';
import { applySecurity, buildResponse, sanitizeInput, isValidQuery, getCORSHeaders } from './_middleware.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 1;
const CACHE_TTL_MS = 20 * 60 * 1000;

const interpretationCache = new Map();

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
  if (interpretationCache.size > 500) {
    const oldestKey = interpretationCache.keys().next().value;
    interpretationCache.delete(oldestKey);
  }
  interpretationCache.set(key, { value, timestamp: Date.now() });
}

function buildNLUPrompt(query, symptomCatalog) {
  return `You are a medical language parser. Your ONLY job is to convert a user's free-text health description into structured JSON.

You must NEVER:
- Diagnose conditions
- Recommend treatments or remedies
- Provide medical advice
- Hallucinate symptoms not described

You must ONLY extract what the user literally describes.

Return ONLY valid JSON in this exact shape. No markdown. No prose. No explanation.

{
  "primarySymptoms": ["symptom_id_from_catalog"],
  "secondarySymptoms": ["symptom_id_from_catalog"],
  "bodyLocations": ["body location mentioned"],
  "sensations": ["sensation described"],
  "duration": "how long if mentioned, else empty string",
  "severity": "mild|moderate|severe if mentioned, else empty string",
  "possibleContexts": ["temporal or positional context like after eating, at night"],
  "confidence": 0.95
}

Rules:
- primarySymptoms: symptom IDs from the catalog that the user IS describing (the main complaint)
- secondarySymptoms: symptom IDs for symptoms mentioned alongside or related but not the primary focus
- bodyLocations: raw body part terms the user mentioned (e.g. "lower back", "behind eyes")
- sensations: raw sensation terms (e.g. "burning", "throbbing", "sharp")
- duration: extract temporal expressions ("for 3 days", "since yesterday", "all week")
- severity: infer from language ("slight" = mild, "bad" = moderate, "unbearable" = severe)
- possibleContexts: situational context ("after eating", "when I wake up", "during exercise")
- confidence: 0.0-1.0 based on how clearly the query maps to catalog symptoms
- Use empty arrays for fields with no information
- Only use symptom IDs that exist in the provided catalog
- If the query is vague or non-medical, return low confidence and empty arrays

Allowed symptom catalog (JSON array of {id, label}):
${JSON.stringify(symptomCatalog)}

User query: "${query}"`;
}

async function callGemini(prompt, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Gemini API error ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');

    const parsed = JSON.parse(text);
    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

function validateInterpretation(obj) {
  if (!obj || typeof obj !== 'object') return false;

  const requiredArrays = ['primarySymptoms', 'secondarySymptoms', 'bodyLocations', 'sensations', 'possibleContexts'];
  for (const field of requiredArrays) {
    if (!Array.isArray(obj[field])) return false;
  }

  if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1) {
    obj.confidence = 0.5;
  }

  if (typeof obj.duration !== 'string') obj.duration = '';
  if (typeof obj.severity !== 'string') obj.severity = '';

  const validSeverity = ['mild', 'moderate', 'severe'];
  if (obj.severity && !validSeverity.includes(obj.severity)) obj.severity = '';

  return true;
}

async function interpretWithGemini(query, symptomCatalog, apiKey) {
  const prompt = buildNLUPrompt(query, symptomCatalog);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await callGemini(prompt, apiKey);
      if (validateInterpretation(result)) return result;
    } catch {
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }
  return null;
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
    const body = await parseBody(event);
    const rawQuery = body.query?.trim();
    const symptomCatalog = Array.isArray(body.symptoms) ? body.symptoms : [];

    if (!rawQuery || !isValidQuery(rawQuery)) {
      return buildResponse(400, { error: 'Valid query is required.' });
    }

    const query = sanitizeInput(rawQuery, { maxLength: 200 });

    if (symptomCatalog.length === 0) {
      return buildResponse(400, { error: 'Symptom catalog is required.' });
    }

    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      return buildResponse(200, {
        interpretation: null,
        source: 'unavailable',
        reason: 'API key not configured',
      });
    }

    const cacheKey = `${query}::${symptomCatalog.length}`;
    const cached = getCachedResult(cacheKey);
    if (cached) {
      return buildResponse(200, { interpretation: cached, source: 'cache' });
    }

    const interpretation = await interpretWithGemini(query, symptomCatalog, apiKey);

    if (!interpretation) {
      return buildResponse(200, {
        interpretation: null,
        source: 'fallback',
        reason: 'Gemini unavailable or returned invalid response',
      });
    }

    setCacheResult(cacheKey, interpretation);

    return buildResponse(200, { interpretation, source: 'gemini' });
  } catch {
    return buildResponse(200, {
      interpretation: null,
      source: 'fallback',
      reason: 'Unexpected error',
    });
  }
}
