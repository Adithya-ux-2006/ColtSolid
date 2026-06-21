/* global process */

const CATEGORIES = ['headache', 'cold', 'congestion', 'cough', 'anxiety', 'insomnia', 'nausea', 'stress',
  'back_pain', 'sore_throat', 'eye_strain', 'eye_pain', 'period_cramps', 'fever', 'skin_rash', 'ear_pain',
  'bloating', 'hangover', 'fatigue', 'brain_fog', 'burnout', 'low_energy', 'leg_pain', 'knee_pain',
  'neck_pain', 'shoulder_pain', 'joint_pain', 'muscle_pain', 'indigestion', 'heartburn', 'constipation',
  'diarrhea', 'stomach_ache', 'gas', 'dehydration', 'pms', 'menopause', 'dry_skin', 'acne'];
const FALLBACK_PATTERNS = {
  headache: ['headache', 'migraine', 'head pain', 'temple', 'head hurting', 'pounding head'],
  cold: ['cold', 'cough', 'congestion', 'sore throat', 'fever', 'runny', 'flu', 'common cold'],
  congestion: ['congestion', 'stuffed nose', 'stuffy nose', 'blocked nose', 'nasal congestion', 'nose blocked', 'clogged nose'],
  cough: ['cough', 'hacking cough', 'dry cough', 'chesty cough', 'persistent cough', 'wet cough'],
  anxiety: ['anxiety', 'anxious', 'panic', 'worried', 'nervous', 'racing thoughts', 'feeling anxious'],
  insomnia: ['insomnia', 'sleep', 'sleepless', 'awake', 'cant sleep', "can't sleep", 'trouble sleeping'],
  nausea: ['nausea', 'nauseous', 'vomit', 'queasy', 'stomach', 'feel sick', 'puking'],
  stress: ['stress', 'stressed', 'overwhelmed', 'burned out', 'tense', 'stressed out', 'burnout'],
  back_pain: ['back pain', 'backache', 'lower back', 'back hurt', 'back ache', 'sore back'],
  sore_throat: ['sore throat', 'scratchy throat', 'throat pain', 'raw throat', 'hurts to swallow'],
  eye_strain: ['eye strain', 'tired eyes', 'screen fatigue', 'dry eyes', 'strained eyes', 'digital strain'],
  eye_pain: ['eye pain', 'eye hurt', 'eyes hurt', 'hurting eyes', 'pain in eyes', 'eye ache'],
  period_cramps: ['period cramps', 'menstrual pain', 'period pain', 'cramps', 'dysmenorrhea'],
  fever: ['fever', 'high temperature', 'high temp', 'running a temp', 'feeling feverish'],
  skin_rash: ['skin rash', 'rash', 'itchy skin', 'hives', 'skin irritation'],
  ear_pain: ['ear pain', 'earache', 'ear hurt', 'ear infection', 'blocked ear'],
  bloating: ['bloating', 'bloated', 'gas', 'gassy', 'distended'],
  hangover: ['hangover', 'hungover'],
  fatigue: ['fatigue', 'tired', 'low energy', 'exhausted', 'drained', 'wiped out'],
  brain_fog: ['brain fog', 'brainfog', 'mental fog', 'cant focus', "can't focus", 'foggy head', 'hard to concentrate'],
  burnout: ['burnout', 'burned out', 'depleted', 'burnt out'],
  low_energy: ['low energy', 'low stamina', 'no energy'],
  leg_pain: ['leg pain', 'leg hurt', 'leg ache', 'leg cramp', 'shin splints', 'sore leg'],
  knee_pain: ['knee pain', 'knee hurt', 'knee ache', 'sore knee', 'pain in knee'],
  neck_pain: ['neck pain', 'stiff neck', 'neck hurt', 'cervical pain', 'sore neck'],
  shoulder_pain: ['shoulder pain', 'shoulder hurt', 'sore shoulder', 'frozen shoulder'],
  joint_pain: ['joint pain', 'joint ache', 'sore joints', 'arthritis pain', 'aching joints'],
  muscle_pain: ['muscle pain', 'muscle ache', 'sore muscles', 'body ache', 'body pain'],
  indigestion: ['indigestion', 'upset stomach', 'dyspepsia', 'bad digestion'],
  heartburn: ['heartburn', 'acid reflux', 'burning chest', 'gerd', 'reflux'],
  constipation: ['constipation', 'constipated', 'irregular bowels', 'hard stools', 'blocked up'],
  diarrhea: ['diarrhea', 'loose stools', 'runny stools', 'diarrhoea'],
  stomach_ache: ['stomach ache', 'stomach pain', 'belly ache', 'tummy ache', 'belly pain'],
  gas: ['gas pain', 'trapped wind', 'flatulence'],
  dehydration: ['dehydration', 'dehydrated', 'thirsty', 'dry mouth'],
  pms: ['pms', 'premenstrual', 'pms symptoms', 'pre menstrual'],
  menopause: ['menopause', 'perimenopause', 'hot flashes', 'night sweats', 'hot flushes'],
  dry_skin: ['dry skin', 'flaky skin', 'rough skin', 'chapped skin', 'peeling skin'],
  acne: ['acne', 'breakout', 'pimples', 'spots', 'zits', 'break outs'],
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

  const allCategories = CATEGORIES.join(', ');
  const prompt = `A student searched for: '${query}'
Our remedy database covers these symptom categories: ${allCategories}.
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
