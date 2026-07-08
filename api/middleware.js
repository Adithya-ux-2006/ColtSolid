/* global process */

// ─── Rate Limiting (in-memory token bucket per IP) ──────────────────────────
const rateLimitBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // requests per window per IP
const RATE_LIMIT_AI_MAX = 5; // stricter limit for AI endpoints

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function getRateLimitBucket(key, max) {
  const now = Date.now();
  let bucket = rateLimitBuckets.get(key);

  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    bucket = { windowStart: now, count: 0, max };
    rateLimitBuckets.set(key, bucket);
  }

  return bucket;
}

// Note: In serverless environments (Vercel), each cold start creates a fresh Map.
// Rate limiting works per-instance, which is still effective against burst attacks.
// For distributed rate limiting, use Redis or Vercel KV.

/**
 * Apply rate limiting. Returns null on success, or a response object on limit exceeded.
 */
export function applyRateLimit(req, res, { max = RATE_LIMIT_MAX } = {}) {
  const ip = getClientIp(req);
  const bucket = getRateLimitBucket(ip, max);

  bucket.count += 1;
  const remaining = Math.max(0, bucket.count - 1);
  const resetAt = bucket.windowStart + RATE_LIMIT_WINDOW_MS;

  res.setHeader('X-RateLimit-Limit', String(max));
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));

  if (bucket.count > max) {
    return { statusCode: 429, error: 'Too many requests. Please try again later.' };
  }

  return null;
}

/**
 * Apply rate limit specifically for AI-heavy endpoints (stricter).
 */
export function applyAIRateLimit(req, res) {
  return applyRateLimit(req, res, { max: RATE_LIMIT_AI_MAX });
}

// ─── CORS ────────────────────────────────────────────────────────────────────
const DEFAULT_ORIGINS = [
  'https://cura-health.vercel.app',
  'https://cura-health-git-main.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : DEFAULT_ORIGINS;

/**
 * Set CORS headers. Returns true if the request origin is allowed.
 */
export function applyCORS(req, res) {
  const origin = req.headers.origin || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost');

  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  return isAllowed;
}

// ─── Security Headers ────────────────────────────────────────────────────────
export function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

// ─── JSON Response Helper ────────────────────────────────────────────────────
export function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

// ─── Input Sanitization ──────────────────────────────────────────────────────
/**
 * Strip potentially dangerous characters from user input.
 * Prevents prompt injection by limiting input to safe characters.
 */
export function sanitizeInput(str, { maxLength = 2000 } = {}) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLength)
    // Remove null bytes and control characters (keep newlines for readability)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit consecutive newlines
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Validate that a string looks like a reasonable symptom query.
 */
export function isValidQuery(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 1 || trimmed.length > 500) return false;
  // Reject queries that are mostly special characters (potential injection)
  const alphaRatio = (trimmed.replace(/[^a-zA-Z0-9]/g, '').length) / trimmed.length;
  return alphaRatio >= 0.3;
}

// ─── Combined Middleware ──────────────────────────────────────────────────────
/**
 * Apply all security middleware to a request.
 * Returns a response object if the request should be rejected, null if ok.
 */
export function applySecurity(req, res, { ai = false } = {}) {
  // 1. Handle preflight
  if (req.method === 'OPTIONS') {
    applyCORS(req, res);
    applySecurityHeaders(res);
    json(res, 204, '');
    return { handled: true };
  }

  // 2. CORS
  applyCORS(req, res);

  // 3. Security headers
  applySecurityHeaders(res);

  // 4. Rate limiting
  const rateLimitResult = ai ? applyAIRateLimit(req, res) : applyRateLimit(req, res);
  if (rateLimitResult) {
    json(res, rateLimitResult.statusCode, { error: rateLimitResult.error });
    return { handled: true };
  }

  return { handled: false };
}
