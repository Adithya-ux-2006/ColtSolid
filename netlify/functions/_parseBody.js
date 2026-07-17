const MAX_BODY_SIZE = 100_000;

/**
 * Parse request body from Netlify function event.
 * Netlify always provides event.body as a string (or null).
 */
export function parseBody(event) {
  const raw = event.body;
  if (!raw) return {};
  if (raw.length > MAX_BODY_SIZE) {
    throw new Error('Request body too large.');
  }
  return JSON.parse(raw);
}
