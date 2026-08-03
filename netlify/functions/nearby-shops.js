import { applySecurity, buildResponse, getCORSHeaders } from './_middleware.js';

const GEOAPIFY_BASE = 'https://api.geoapify.com/v2/places';
const MAX_RADIUS = 10000;
const DEFAULT_RADIUS = 3000;
const MAX_LIMIT = 20;

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: getCORSHeaders(event),
      body: '',
    };
  }

  const sec = applySecurity(event);
  if (sec) return sec;
  if (event.httpMethod !== 'POST') return buildResponse(405, { error: 'Method not allowed.' });

  try {
    const body = JSON.parse(event.body || '{}');
    const { lat, lon, radius, limit } = body;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return buildResponse(400, { error: 'lat and lon are required.' });
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return buildResponse(400, { error: 'Invalid coordinates.' });
    }

    const apiKey = process.env.GEOAPIFY_KEY;
    if (!apiKey) {
      return buildResponse(500, { error: 'Geoapify API key not configured.' });
    }

    const searchRadius = Math.min(Math.max(Number(radius) || DEFAULT_RADIUS, 100), MAX_RADIUS);
    const searchLimit = Math.min(Math.max(Number(limit) || 10, 1), MAX_LIMIT);

    const params = new URLSearchParams({
      categories: 'healthcare.pharmacy',
      filter: `circle:${lon},${lat},${searchRadius}`,
      limit: String(searchLimit),
      apiKey,
    });

    const response = await fetch(`${GEOAPIFY_BASE}?${params}`);
    if (!response.ok) {
      const text = await response.text();
      return buildResponse(502, { error: 'Geoapify API request failed.', details: text });
    }

    const data = await response.json();
    const shops = (data.features || []).map((f) => ({
      name: f.properties.name || 'Unnamed pharmacy',
      address: f.properties.formatted || '',
      lat: f.properties.lat,
      lon: f.properties.lon,
      distance: f.properties.distance,
      openingHours: f.properties.opening_hours || null,
      categories: f.properties.categories || [],
    }));

    return buildResponse(200, { shops });
  } catch {
    return buildResponse(500, { error: 'Unable to fetch nearby shops.' });
  }
}
