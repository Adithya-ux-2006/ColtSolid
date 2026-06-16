/* global process */

const CATEGORIES = ['headache', 'cold', 'anxiety', 'insomnia', 'nausea', 'stress'];
const FALLBACK_PATTERNS = {
  headache: ['headache', 'migraine', 'head pain', 'temple'],
  cold: ['cold', 'cough', 'congestion', 'sore throat', 'fever', 'runny'],
  anxiety: ['anxiety', 'anxious', 'panic', 'worried', 'nervous'],
  insomnia: ['insomnia', 'sleep', 'sleepless', 'awake', 'cant sleep', "can't sleep"],
  nausea: ['nausea', 'nauseous', 'vomit', 'queasy', 'stomach'],
  stress: ['stress', 'stressed', 'overwhelmed', 'burned out', 'tense'],
};

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function fallbackCategory(query) {
  const normalized = query.toLowerCase();
  return Object.entries(FALLBACK_PATTERNS).find(([, patterns]) => patterns.some((pattern) => normalized.includes(pattern)))?.[0] || 'none';
}

async function askClaude(query) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const prompt = `A student searched for: '${query}'
Our remedy database covers these symptom categories: headache, cold, anxiety, insomnia, nausea, stress.
Which ONE category best matches what they're looking for?
Reply with ONLY the category id or 'none' if nothing matches.
No explanation.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 12,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Claude request failed with ${response.status}`);
  const payload = await response.json();
  const text = payload.content?.[0]?.text?.trim().toLowerCase();
  return CATEGORIES.includes(text) ? text : 'none';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

  try {
    const body = await parseBody(req);
    const query = body.query?.trim();
    if (!query) return json(res, 400, { error: 'Query is required.' });

    let category = null;
    try {
      category = await askClaude(query);
    } catch {
      category = null;
    }

    return json(res, 200, { category: category || fallbackCategory(query) });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to match symptom.' });
  }
}
