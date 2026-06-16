/* global process */

const SYSTEM_PROMPT = `You are a helpful health assistant for college students using ClotSolid, an evidence-based remedy app.

When a student describes symptoms:
1. Identify the likely symptoms from: headache, cold, anxiety, insomnia, nausea, stress, back pain, sore throat, eye strain, period cramps, fever, skin rash, ear pain, bloating, hangover, fatigue
2. Suggest 2-3 relevant remedies from our Natural, TCM, and Lifestyle categories
3. Always end with a disclaimer if symptoms sound serious
4. Keep responses SHORT - max 150 words
5. Format with bold headers and bullet points
6. Include navigation links in format: [View remedies →](/results?symptom=X)
7. Never diagnose. Never prescribe.
8. If the user describes an emergency (chest pain, difficulty breathing, severe injury) - immediately say to call emergency services.

Tone: warm, caring, like a knowledgeable friend. Not clinical. Not robotic.`;

const FALLBACK_REPLIES = [
  {
    patterns: ['chest pain', 'cant breathe', "can't breathe", 'difficulty breathing', 'severe injury'],
    text: '**Emergency warning:**\n- Chest pain or trouble breathing can be urgent. Call emergency services now or ask someone nearby for immediate help.\n- Do not wait for home remedies.',
  },
  {
    patterns: ['back', 'lower back', 'backache'],
    text: '**For back pain:**\n- Heat Therapy for Back Pain - eases tight lower-back muscles.\n- Cat-Cow Mobility Break - gentle movement after long sitting.\n\n[View remedies →](/results?symptom=back_pain)\n\nIf pain is severe, follows injury, or causes numbness, see a clinician.',
  },
  {
    patterns: ['sleep', 'insomnia', 'cant sleep', "can't sleep"],
    text: '**For sleep trouble:**\n- Melatonin 1-3 mg - helpful for shifted sleep timing.\n- Stimulus Control Routine - retrains your bed for sleep.\n\n[View remedies →](/results?symptom=insomnia)\n\nIf this persists for weeks or affects safety, talk with a clinician.',
  },
  {
    patterns: ['nausea', 'nauseous', 'stomach', 'queasy'],
    text: '**For nausea:**\n- Ginger Capsules - well-studied for mild nausea.\n- P6 Wrist Acupressure - quick, low-risk pressure-point support.\n\n[View remedies →](/results?symptom=nausea)\n\nSeek care for severe dehydration, blood, or persistent vomiting.',
  },
  {
    patterns: ['headache', 'migraine', 'head is pounding'],
    text: '**For headache:**\n- Peppermint Oil Roll-On - cooling relief for tension headaches.\n- Hydration Reset - useful after missed meals, heat, or caffeine.\n\n[View remedies →](/results?symptom=headache)\n\nIf sudden, severe, or lasting more than 48 hours, please see a doctor.',
  },
];

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

function fallbackReply(messages) {
  const text = messages.map((message) => message.content).join(' ').toLowerCase();
  return FALLBACK_REPLIES.find((reply) => reply.patterns.some((pattern) => text.includes(pattern)))?.text
    || '**A few options that may help:**\n- Try searching your main symptom in ClotSolid for evidence-based remedies.\n- If symptoms feel severe, unusual, or keep getting worse, check with a clinician.\n\n[View remedies →](/search)';
}

async function askClaude(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 280,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10).map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      })),
    }),
  });

  if (!response.ok) throw new Error(`Claude request failed with ${response.status}`);
  const payload = await response.json();
  return payload.content?.[0]?.text || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

  try {
    const body = await parseBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) return json(res, 400, { error: 'Messages are required.' });

    let reply = null;
    try {
      reply = await askClaude(messages);
    } catch {
      reply = null;
    }

    return json(res, 200, { reply: reply || fallbackReply(messages) });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to answer right now.' });
  }
}
