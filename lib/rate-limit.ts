/**
 * Lightweight in-process rate limiter.
 * Uses a sliding-window counter per IP.
 * Works in Vercel Edge/Node serverless (each instance has its own memory).
 * For multi-instance production, replace with Redis/Upstash.
 *
 * The in-memory store is bounded by a small periodic sweep that drops
 * expired entries, so a long-running instance cannot leak memory as new
 * IPs come and go.
 */

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();

// Sweep at most this many expired entries on every Nth call. Cheap and
// keeps the Map size proportional to currently-active IPs.
const SWEEP_EVERY = 1000;
let callsSinceSweep = 0;

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
    maybeSweep(now);
    return { ok: true };
  }

  if (win.count >= opts.limit) {
    maybeSweep(now);
    return { ok: false, retryAfter: Math.ceil((win.resetAt - now) / 1_000) };
  }

  win.count++;
  maybeSweep(now);
  return { ok: true };
}

/**
 * Drop entries whose window has expired. Called at most once per
 * SWEEP_EVERY rateLimit() calls so the hot path stays O(1).
 */
function maybeSweep(now: number): void {
  callsSinceSweep++;
  if (callsSinceSweep < SWEEP_EVERY) return;
  callsSinceSweep = 0;
  for (const [key, win] of store) {
    if (now > win.resetAt) store.delete(key);
  }
}

/** Extract real IP from Vercel/proxy headers */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

/** Test-only: clear the in-memory store. Not exported in production code paths. */
export function __resetRateLimitStoreForTests(): void {
  store.clear();
  callsSinceSweep = 0;
}
