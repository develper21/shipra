// Sliding window rate limiter (In-Memory with Redis protocol readiness)

interface RateLimitEntry {
  tokens: number[];
}

const memoryStore = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for an identifier (IP, token, or user)
 * @param key unique identifier (e.g. `login:ip_123` or `token:apl_live_abc`)
 * @param limit max allowed requests in window
 * @param windowSeconds time window in seconds
 */
export function checkRateLimit(
  key: string,
  limit = 60,
  windowSeconds = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  const entry = memoryStore.get(key) || { tokens: [] };
  // Filter out expired timestamps
  const validTokens = entry.tokens.filter((timestamp) => timestamp > cutoff);

  const reset = Math.ceil(
    (validTokens.length > 0 ? validTokens[0] + windowMs : now + windowMs) / 1000
  );

  if (validTokens.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  validTokens.push(now);
  memoryStore.set(key, { tokens: validTokens });

  return {
    success: true,
    limit,
    remaining: limit - validTokens.length,
    reset,
  };
}

export function applyRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult
): void {
  headers.set("X-RateLimit-Limit", result.limit.toString());
  headers.set("X-RateLimit-Remaining", Math.max(0, result.remaining).toString());
  headers.set("X-RateLimit-Reset", result.reset.toString());
}
