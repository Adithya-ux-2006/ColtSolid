const PLACE_SEARCHES = [
  { label: 'Pharmacy', querySuffix: 'pharmacy' },
  { label: 'Medical Store', querySuffix: 'medical store' },
  { label: 'Ayurvedic Store', querySuffix: 'ayurvedic store' },
  { label: 'Herbal Store', querySuffix: 'herbal store' },
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

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(fromLat, fromLng, toLat, toLng) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function searchPlaces(apiKey, remedyName, latitude, longitude, radiusMeters, placeSearch) {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.rating',
        'places.userRatingCount',
        'places.googleMapsUri',
        'places.currentOpeningHours.openNow',
        'places.businessStatus',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: `${remedyName} ${placeSearch.querySuffix}`,
      maxResultCount: 5,
      locationBias: {
        circle: {
          center: { latitude, longitude },
          radius: radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}`);
  }

  const payload = await response.json();
  return payload.places || [];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return json(res, 500, { error: 'Missing GOOGLE_MAPS_API_KEY.' });
    }

    const body = await parseBody(req);
    const remedyName = body.remedyName?.trim();
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const radiusMeters = 5000;

    if (!remedyName || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return json(res, 400, { error: 'Remedy name and coordinates are required.' });
    }

    const results = await Promise.all(
      PLACE_SEARCHES.map(async (placeSearch) => {
        const places = await searchPlaces(apiKey, remedyName, latitude, longitude, radiusMeters, placeSearch);
        return places.map((place) => ({ place, placeSearch }));
      })
    );

    const merged = new Map();

    results.flat().forEach(({ place, placeSearch }) => {
      const existing = merged.get(place.id);
      const distanceKm = calculateDistanceKm(latitude, longitude, place.location.latitude, place.location.longitude);

      if (distanceKm > 5) return;

      const nextPlace = {
        id: place.id,
        name: place.displayName?.text || 'Nearby store',
        address: place.formattedAddress || '',
        rating: place.rating || null,
        reviewCount: place.userRatingCount || 0,
        distanceKm: Number(distanceKm.toFixed(1)),
        isOpen: place.currentOpeningHours?.openNow ?? null,
        directionsUrl: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text || '')}`,
        categories: existing ? [...existing.categories] : [],
      };

      if (!nextPlace.categories.includes(placeSearch.label)) {
        nextPlace.categories.push(placeSearch.label);
      }

      merged.set(place.id, nextPlace);
    });

    const places = Array.from(merged.values())
      .sort((a, b) => a.distanceKm - b.distanceKm || (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);

    return json(res, 200, { places });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to fetch nearby shops.' });
  }
}
