// api/ai-reminder-copy.js
// Generates a short, warm reminder line for remedy schedule emails.
// Called by the Edge Function before sending each reminder email.
// Falls back to a static string if Claude API is unavailable.

/* global process */
import { applySecurity, json, sanitizeInput } from './middleware.js';

const SYSTEM_PROMPT = `You are a friendly health reminder assistant for curA, an evidence-based remedy app.

Given a remedy name, the symptom it treats, and when it's due, write ONE short reminder line (max 30 words).

Rules:
- Warm, encouraging tone — like a caring friend, not a robot
- Mention the remedy name and briefly why it helps
- No medical advice, no diagnoses, no prescriptions
- No emojis
- Just the reminder text, no headers or formatting`;

const FALLBACK_REMINDERS = {
  default: (remedyName) => `Time to take your ${remedyName}. Stay consistent for best results.`,
  headache: (remedyName) => `Reminder: your ${remedyName} is due. It can help ease your headache.`,
  nausea: (remedyName) => `Time for your ${remedyName} — it can help settle your stomach.`,
  insomnia: (remedyName) => `Your ${remedyName} is due. It may help you rest more easily tonight.`,
  stress: (remedyName) => `Reminder: take your ${remedyName}. A small step toward feeling calmer.`,
  fatigue: (remedyName) => `Time for your ${remedyName} — it can help boost your energy.`,
  anxiety: (remedyName) => `Your ${remedyName} is due. It may help ease feelings of anxiety.`,
  back_pain: (remedyName) => `Reminder: your ${remedyName} is due. It can help ease your back pain.`,
  period_cramps: (remedyName) => `Time for your ${remedyName} — it can help relieve your cramps.`,
  low_libido: (remedyName) => `Your ${remedyName} is due. Consistency is key for this one.`,
  vaginal_dryness: (remedyName) => `Reminder: your ${remedyName} is due. It can help with comfort.`,
  painful_intercourse: (remedyName) => `Your ${remedyName} is due. It may help reduce discomfort.`,
  erectile_difficulty: (remedyName) => `Time for your ${remedyName}. Small, consistent steps make a difference.`,
};

function getFallback(remedyName, symptomId) {
  const generator = FALLBACK_REMINDERS[symptomId] || FALLBACK_REMINDERS.default;
  return generator(remedyName);
}

async function generateCopy(remedyName, symptomId) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const userMessage = `Remedy: ${remedyName}\nSymptom: ${symptomId || 'general'}\nDue: now`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 60,
      temperature: 0.4,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) return null;
  const payload = await response.json();
  return payload.content?.[0]?.text?.trim() || null;
}

export default async function handler(req, res) {
  const sec = applySecurity(req, res, { ai: true });
  if (sec.handled) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

  try {
    const body = JSON.parse(req.body || '{}');
    const remedyName = sanitizeInput(body.remedyName || '', { maxLength: 100 });
    const symptomId = sanitizeInput(body.symptomId || '', { maxLength: 50 });

    if (!remedyName) return json(res, 400, { error: 'remedyName is required.' });

    let copy = null;
    try {
      copy = await generateCopy(remedyName, symptomId);
    } catch {
      copy = null;
    }

    return json(res, 200, { copy: copy || getFallback(remedyName, symptomId) });
  } catch {
    return json(res, 500, { error: 'Unable to generate reminder copy.' });
  }
}
