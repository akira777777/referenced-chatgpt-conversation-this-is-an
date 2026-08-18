/**
 * Lightweight in-process rate limiter.
 * Uses a sliding-window counter per IP.
 * Works in Vercel Edge/Node serverless (each instance has its own memory).
 * For multi-instance production, replace with Redis/Upstash.
 */

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();

export interface RateLimitOptions {
  /** Max requests in the window */
  limit: number;
  /** Window size in seconds */
  windowSec: number;
}

/**
 * Returns { ok: true } if under limit, { ok: false, retryAfter } if exceeded.
 */
export function rateLimit(
  ip: string,
  opts: RateLimitOptions
): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = ip;
  const win = store.get(key);

  if (!win || now > win.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowSec * 1_000 });
    return { ok: true };
  }

  if (win.count >= opts.limit) {
    return { ok: false, retryAfter: Math.ceil((win.resetAt - now) / 1_000) };
  }

  win.count++;
  return { ok: true };
}

/** Extract real IP from Vercel/proxy headers */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}
