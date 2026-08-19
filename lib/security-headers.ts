/**
 * Shared security-header configuration.
 *
 * This is the single source of truth for the HTTP response headers the
 * application emits. Both `next.config.ts` and `worker/index.ts` import
 * from here so the two layers can't drift.
 *
 * Why two layers?
 *   - `next.config.ts` headers() covers most responses but is bypassed by
 *     some RSC streaming paths (notably the home route's pre-rendered
 *     response, observed via curl -I on the production build).
 *   - The Cloudflare worker sits in front of every response, so re-applying
 *     the headers there guarantees the contract end-to-end.
 *
 * The set is deliberately conservative: every header is a production-grade
 * recommendation from MDN / OWASP, and the values are chosen so they work
 * without changes to the current page contents.
 */

export interface HeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

export const SECURITY_HEADER_PAIRS: { key: string; value: string }[] = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/**
 * A single catch-all rule covering every route, including /api/* and
 * dynamic segments. Used by next.config.ts.
 */
export const SECURITY_HEADER_RULES: HeaderRule[] = [
  { source: "/:path*", headers: SECURITY_HEADER_PAIRS },
];

/**
 * A frozen map of the same headers for the worker to apply on every
 * response. Keep in sync with SECURITY_HEADER_PAIRS — the security-headers
 * test enforces this.
 */
export const SECURITY_HEADERS_MAP: Readonly<Record<string, string>> =
  Object.freeze(
    Object.fromEntries(SECURITY_HEADER_PAIRS.map((h) => [h.key, h.value]))
  );

/**
 * Content-Security-Policy (Report-Only) — the site has no CSP today, which
 * leaves it open to stored-XSS regressions. Before enforcing, we ship a
 * Report-Only policy and watch the browser's CSP violation reports. After
 * a soak period with no legitimate violations, flip to enforce mode by
 * setting CSP_REPORT_ONLY = false.
 *
 * Sources audited and allowed:
 *   - 'self' for app-owned JS / CSS / fonts
 *   - Supabase storage (https://*.supabase.co) for user-uploaded images
 *   - t.me for Telegram deeplinks
 *   - google.com/maps, maps.apple.com, waze.com for the studio map links
 *   - 'unsafe-inline' for <style> and the theme-bootstrap script
 *     (TODO: replace with nonces/hashes for a strict policy)
 */
const CSP_REPORT_ONLY = true;

const CSP_DIRECTIVES: string[] = [
  "default-src 'self'",
  // 'unsafe-inline' is required for the inline theme-bootstrap <script> in
  // app/layout.tsx and the inline <style> blocks emitted by Next/font.
  // Remove it once we add per-request nonces (see worker/index.ts TODO).
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
  // API + RSC fetch endpoints stay same-origin only.
  "connect-src 'self'",
  // No embeds on the site; deny plugins and frames.
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Reporting endpoint. The route handler at /api/csp-report accepts the
  // browser's POST and logs a single line; the field can be swapped for an
  // external collector (Sentry, report-uri.com, a CF Worker) by changing
  // only this string.
  "report-uri /api/csp-report",
];

export const CSP_HEADER = {
  key: CSP_REPORT_ONLY
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy",
  value: CSP_DIRECTIVES.join("; "),
};

/**
 * Apply the security-header set to an arbitrary Response, returning a new
 * Response. The original is left untouched so retries and downstream
 * consumers see an unchanged view.
 */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS_MAP)) {
    headers.set(key, value);
  }
  // CSP goes in too. The mode (enforce vs report-only) is controlled by
  // CSP_REPORT_ONLY above.
  headers.set(CSP_HEADER.key, CSP_HEADER.value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
