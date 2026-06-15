import { getApiUrl } from './api.js';

export async function fetchNearbyShops({ remedyName, latitude, longitude }) {
  const response = await fetch(getApiUrl('/api/nearby-shops'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ remedyName, latitude, longitude }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to find nearby shops.');
  }

  return payload.places || [];
}
