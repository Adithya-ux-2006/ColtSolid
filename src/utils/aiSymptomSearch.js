import { getApiUrl } from './api.js';

export async function detectSymptomsFromText(query, symptoms) {
  const response = await fetch(getApiUrl('/api/ai-symptom-search'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, symptoms }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to analyze symptoms.');
  }

  return payload;
}
