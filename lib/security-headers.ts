/**
 * Shared security-header configuration.
 *
 * This is the single source of truth for the HTTP response headers the
 * application emits. `next.config.ts`, `middleware.ts`, and `worker/index.ts`
 * all import from here so the layers can't drift.
 *
 * Layering:
 *   1. `middleware.ts` — generates a per-request CSP nonce, sets the CSP
 *      request header (vinext reads it and applies the nonce to every
 *      script it emits) and the CSP response header. THIS OWNS THE CSP.
 *   2. `next.config.ts` headers() — static baseline headers for every route.
 *   3. `worker/index.ts` — re-applies the baseline at the edge and only adds
 *      a fallback CSP when the response carries none (e.g. static assets).
 *
 * CSP mode: ENFORCED. The previous Report-Only soak found no violations
 * (verified in headless Chromium via tests/csp-nonce.browser.mjs). Roll back
 * by setting CSP_REPORT_ONLY = true and redeploying.
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
 * dynamic segments. Used by next.config.ts. Intentionally does NOT include
 * the CSP: the CSP is per-request (nonce) and owned by middleware.ts.
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

// ─── Content-Security-Policy ─────────────────────────────────────────────────

/**
 * Emergency rollback switch. `false` = enforce (production default).
 * Set to `true` to demote the policy to Report-Only without touching the
 * directives themselves.
 */
export const CSP_REPORT_ONLY = false;

export const CSP_HEADER_NAME = CSP_REPORT_ONLY
  ? "Content-Security-Policy-Report-Only"
  : "Content-Security-Policy";

/** Header the middleware uses to pass the nonce to server components. */
export const NONCE_REQUEST_HEADER = "x-csp-nonce";

/**
 * Build the full CSP header value for a given nonce.
 *
 * script-src: 'self' (same-origin modules) + 'nonce-X' (inline scripts
 * emitted by vinext, the theme bootstrap, and JSON-LD). 'unsafe-inline' is
 * gone — an injected inline script without the nonce is blocked.
 *
 * style-src keeps 'unsafe-inline': next/font and React style attributes
 * both rely on it, and style-based injection has a much smaller blast
 * radius than script injection.
 */
export function buildCspHeaderValue(nonce: string): string {
  const directives: string[] = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
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
    // Violations are still reported in enforce mode (blocked AND reported).
    "report-uri /api/csp-report",
  ];
  return directives.join("; ");
}

/**
 * Static fallback CSP for responses that bypass the middleware (e.g. the
 * worker serving a static asset directly). Report-only and nonce-less: its
 * job is telemetry, not enforcement — enforcing without a nonce would break
 * any HTML that slips past the middleware.
 */
export const CSP_FALLBACK = {
  key: "Content-Security-Policy-Report-Only",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "report-uri /api/csp-report",
  ].join("; "),
};

/** @deprecated kept for tests/back-compat; prefer buildCspHeaderValue(). */
export const CSP_HEADER = {
  key: CSP_FALLBACK.key,
  value: CSP_FALLBACK.value,
};

/**
 * Generate a cryptographically random nonce, base64-encoded.
 *
 * 16 random bytes → 24 base64 chars. Base64 is safe inside an HTML
 * attribute and never contains the characters vinext rejects
 * (`&`, `>`, `<`, U+2028, U+2029 — see vinext/dist/server/csp.js).
 * Works in both Workers and Node (Web Crypto is global in both).
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    const webCrypto = (globalThis as unknown as { crypto?: { getRandomValues: (b: Uint8Array) => Uint8Array } }).crypto;
    if (webCrypto?.getRandomValues) {
      webCrypto.getRandomValues(bytes);
    }
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Apply the security-header set to an arbitrary Response, returning a new
 * Response. The original is left untouched so retries and downstream
 * consumers see an unchanged view.
 *
 * CSP handling: if the response already carries a Content-Security-Policy
 * (or Report-Only) header — as set by middleware.ts — it is preserved.
 * Otherwise the static report-only fallback is attached so unmiddled
 * responses still generate telemetry.
 */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS_MAP)) {
    headers.set(key, value);
  }
  const hasCsp =
    headers.has("content-security-policy") ||
    headers.has("content-security-policy-report-only");
  if (!hasCsp) {
    headers.set(CSP_FALLBACK.key, CSP_FALLBACK.value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
