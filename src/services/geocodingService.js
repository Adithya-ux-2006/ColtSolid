const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const CACHE_KEY = 'clotsolid_geocode_cache';
const CACHE_TTL = 3600000; // 1 hour
const MIN_INTERVAL_MS = 1100; // Respect Nominatim 1 req/sec policy
const REQUEST_TIMEOUT_MS = 10000;

let lastRequestTime = 0;

function getCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function setCacheEntry(key, value) {
  try {
    const cache = getCache();
    cache[key] = { value, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

function getCachedResult(query) {
  const cache = getCache();
  const normalised = query.toLowerCase().trim();
  const entry = cache[normalised];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.value;
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function geocodeLocation(query) {
  if (!query || query.trim().length < 2) {
    throw new Error('Please enter a valid location');
  }

  const normalised = query.toLowerCase().trim();
  const cached = getCachedResult(normalised);
  if (cached) return cached;

  // Enforce minimum interval between requests (Nominatim policy)
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await sleep(MIN_INTERVAL_MS - elapsed);
  }

  lastRequestTime = Date.now();

  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    limit: '1',
    addressdetails: '1',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      throw new Error('Location not found. Try a different search term.');
    }

    const result = results[0];
    const geoResult = {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name || query.trim(),
    };

    setCacheEntry(normalised, geoResult);

    return geoResult;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Location request timed out. Please try again.', { cause: err });
    }
    throw err;
  }
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('LOCATION_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('LOCATION_DENIED'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('LOCATION_UNAVAILABLE'));
            break;
          case error.TIMEOUT:
            reject(new Error('LOCATION_TIMEOUT'));
            break;
          default:
            reject(new Error('LOCATION_ERROR'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}
