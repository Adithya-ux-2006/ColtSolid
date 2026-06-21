/* global process */

const FALLBACK_SYMPTOM_PATTERNS = {
  headache: ['headache', 'migraine', 'temple pain', 'head pain', 'pressure in my head', 'head hurting', 'pounding head'],
  cold: ['cold', 'fever', 'sore throat', 'throat hurts', 'cough', 'runny nose', 'congestion', 'chills', 'common cold', 'getting sick'],
  congestion: ['congestion', 'stuffed nose', 'stuffy nose', 'blocked nose', 'nasal congestion', 'nose blocked', 'clogged nose', 'chest congestion'],
  sinus_pressure: ['sinus pressure', 'sinus pain', 'sinus headache', 'facial pain', 'sinusitis', 'pressure behind eyes'],
  brain_fog: ['brain fog', 'brainfog', 'mental fog', 'cant focus', 'can\'t focus', 'foggy head', 'cloudy head', 'hard to concentrate', 'can\'t think', 'lack of focus'],
  low_energy: ['low energy', 'low stamina', 'no energy'],
  burnout: ['burnout', 'burned out', 'depleted', 'burnt out'],
  anxiety: ['anxious', 'anxiety', 'panic', 'overthinking', 'restless', 'worried', 'racing thoughts', 'feeling anxious'],
  insomnia: ['cannot sleep', 'cant sleep', 'insomnia', 'trouble sleeping', 'awake all night', 'sleep issues', 'difficulty sleeping'],
  nausea: ['nausea', 'nauseous', 'feel sick', 'vomit', 'upset stomach', 'queasy', 'puking'],
  stress: ['stress', 'stressed', 'burned out', 'overwhelmed', 'tense', 'stressed out'],
  back_pain: ['back pain', 'backache', 'lower back pain', 'back hurt', 'back ache', 'sore back'],
  leg_pain: ['leg pain', 'leg hurt', 'leg ache', 'leg cramp', 'shin splints', 'sore leg'],
  knee_pain: ['knee pain', 'knee hurt', 'knee ache', 'sore knee', 'pain in knee'],
  neck_pain: ['neck pain', 'stiff neck', 'neck hurt', 'cervical pain', 'sore neck'],
  shoulder_pain: ['shoulder pain', 'shoulder hurt', 'sore shoulder', 'frozen shoulder'],
  eye_pain: ['eye pain', 'eye hurt', 'eye ache', 'eyes hurt', 'hurting eyes', 'pain in eyes'],
  eye_strain: ['eye strain', 'tired eyes', 'screen fatigue', 'dry eyes', 'strained eyes', 'digital strain'],
  ear_pain: ['ear pain', 'earache', 'ear hurt', 'ear infection', 'blocked ear', 'ear ache'],
  sore_throat: ['sore throat', 'scratchy throat', 'throat pain', 'raw throat', 'swollen throat', 'throat hurts', 'hurts to swallow'],
  period_cramps: ['period cramps', 'menstrual pain', 'period pain', 'cramps', 'dysmenorrhea', 'menstrual cramp', 'monthly cramps'],
  fever: ['fever', 'high temperature', 'high temp', 'running a temp', 'feeling feverish'],
  skin_rash: ['skin rash', 'rash', 'itchy skin', 'hives', 'skin irritation', 'red rash', 'itchy rash'],
  bloating: ['bloating', 'bloated', 'gas', 'gassy', 'distended', 'bloated belly'],
  hangover: ['hangover', 'hungover'],
  fatigue: ['fatigue', 'tired', 'low energy', 'exhausted', 'drained', 'wiped out'],
  dehydration: ['dehydration', 'dehydrated', 'thirsty', 'dry mouth'],
  muscle_pain: ['muscle pain', 'muscle ache', 'sore muscles', 'body ache', 'body pain', 'aching muscles'],
  joint_pain: ['joint pain', 'joint ache', 'sore joints', 'arthritis pain', 'aching joints'],
  indigestion: ['indigestion', 'upset stomach', 'dyspepsia', 'bad digestion'],
  heartburn: ['heartburn', 'acid reflux', 'burning chest', 'gerd', 'reflux'],
  constipation: ['constipation', 'constipated', 'irregular bowels', 'hard stools', 'blocked up'],
  diarrhea: ['diarrhea', 'loose stools', 'runny stools', 'diarrhoea'],
  stomach_ache: ['stomach ache', 'stomach pain', 'belly ache', 'tummy ache', 'belly pain'],
  cough: ['cough', 'hacking cough', 'dry cough', 'wet cough', 'chesty cough', 'persistent cough'],
  dry_skin: ['dry skin', 'flaky skin', 'rough skin', 'chapped skin', 'peeling skin'],
  acne: ['acne', 'breakout', 'pimples', 'spots', 'zits', 'break outs'],
  pms: ['pms', 'premenstrual', 'pms symptoms', 'pre menstrual'],
  menopause: ['menopause', 'perimenopause', 'hot flashes', 'night sweats', 'hot flushes'],
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

    req.on('data', (chunk) => {
      raw += chunk;
    });

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

function fallbackDetectSymptoms(query) {
  const normalized = query.toLowerCase();

  return Object.entries(FALLBACK_SYMPTOM_PATTERNS)
    .filter(([, patterns]) => patterns.some((pattern) => normalized.includes(pattern)))
    .map(([symptomId]) => symptomId);
}

async function detectWithOpenAI(query, symptoms) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const prompt = [
    'You extract symptom ids from a short user health description.',
    'Return strict JSON only in this shape: {"symptoms":["id1","id2"]}.',
    'Only use ids from the allowed list.',
    'Return an empty array if nothing confidently matches.',
    `Allowed symptoms: ${JSON.stringify(symptoms)}`,
    `User query: ${query}`,
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a precise medical symptom classifier constrained to a fixed taxonomy.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  return Array.isArray(parsed.symptoms) ? parsed.symptoms : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const body = await parseBody(req);
    const query = body.query?.trim();
    const symptoms = Array.isArray(body.symptoms) ? body.symptoms : [];

    if (!query) {
      return json(res, 400, { error: 'Query is required.' });
    }

    if (symptoms.length === 0) {
      return json(res, 400, { error: 'Symptom catalog is required.' });
    }

    const allowedIds = new Set(symptoms.map((symptom) => symptom.id));

    let detectedSymptoms = [];

    try {
      const aiResult = await detectWithOpenAI(query, symptoms.map(({ id, label }) => ({ id, label })));
      if (Array.isArray(aiResult)) {
        detectedSymptoms = aiResult.filter((symptomId) => allowedIds.has(symptomId));
      }
    } catch {
      detectedSymptoms = [];
    }

    if (detectedSymptoms.length === 0) {
      detectedSymptoms = fallbackDetectSymptoms(query).filter((symptomId) => allowedIds.has(symptomId));
    }

    return json(res, 200, {
      detectedSymptoms,
      source: process.env.OPENAI_API_KEY ? 'ai' : 'fallback',
    });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to analyze symptoms.' });
  }
}
