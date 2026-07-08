const MAX_BODY_SIZE = 100_000; // 100KB limit

/**
 * Parse request body from Vercel serverless function.
 * Handles pre-parsed objects, string bodies, and stream-based bodies.
 * Enforces a maximum body size to prevent memory exhaustion.
 */
export function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string' && req.body) {
    if (req.body.length > MAX_BODY_SIZE) {
      throw new Error('Request body too large.');
    }
    return JSON.parse(req.body);
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error('Request body too large.'));
        return;
      }
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
