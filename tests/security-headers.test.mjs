/**
 * Unit tests for the shared security-headers configuration.
 *
 * These tests pin the single source of truth in lib/security-headers.ts so
 * next.config.ts and worker/index.ts can't drift from each other, and so a
 * reviewer is forced to acknowledge any change to the baseline header set,
 * the CSP, or the withSecurityHeaders() helper.
 */
import assert from "node:assert/strict";
import test from "node:test";

const shared = await import("../lib/security-headers.ts");

// ─── Header set (used by both next.config and the worker) ────────────────────

test("SECURITY_HEADER_RULES has exactly one catch-all rule", () => {
  assert.ok(Array.isArray(shared.SECURITY_HEADER_RULES));
  assert.equal(shared.SECURITY_HEADER_RULES.length, 1);
  assert.equal(shared.SECURITY_HEADER_RULES[0].source, "/:path*");
});

test("SECURITY_HEADER_PAIRS contains the documented baseline", () => {
  const map = Object.fromEntries(
    shared.SECURITY_HEADER_PAIRS.map((h) => [h.key, h.value])
  );
  assert.equal(
    map["Strict-Transport-Security"],
    "max-age=31536000; includeSubDomains"
  );
  assert.equal(map["X-Content-Type-Options"], "nosniff");
  assert.equal(map["X-Frame-Options"], "DENY");
  assert.equal(map["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(map["Permissions-Policy"], /camera=\(\)/);
  assert.equal(map["Cross-Origin-Opener-Policy"], "same-origin");
});

test("SECURITY_HEADERS_MAP is a frozen superset of SECURITY_HEADER_PAIRS", () => {
  for (const { key, value } of shared.SECURITY_HEADER_PAIRS) {
    assert.equal(shared.SECURITY_HEADERS_MAP[key], value);
  }
  assert.equal(Object.isFrozen(shared.SECURITY_HEADERS_MAP), true);
});

// ─── Content-Security-Policy (Report-Only by default) ───────────────────────

test("CSP_HEADER is set to Report-Only by default", () => {
  assert.equal(
    shared.CSP_HEADER.key,
    "Content-Security-Policy-Report-Only"
  );
});

test("CSP_HEADER value contains the required directives", () => {
  const v = shared.CSP_HEADER.value;
  // The default-src sets the fallback for every fetch type.
  assert.match(v, /default-src 'self'/);
  // Inline script/style allowed (TODO: replace with nonces).
  assert.match(v, /script-src 'self' 'unsafe-inline'/);
  assert.match(v, /style-src 'self' 'unsafe-inline'/);
  // Supabase storage for user-uploaded images.
  assert.match(v, /img-src[^;]*https:\/\/\*\.supabase\.co/);
  // No iframes/embeds on the site.
  assert.match(v, /frame-ancestors 'none'/);
  assert.match(v, /object-src 'none'/);
  // Reporting endpoint is configured.
  assert.match(v, /report-uri \/api\/csp-report/);
});

// ─── withSecurityHeaders helper ─────────────────────────────────────────────

test("withSecurityHeaders adds the baseline to an existing response", async () => {
  const original = new Response("hello", {
    status: 201,
    headers: { "x-custom": "preserved" },
  });
  const out = shared.withSecurityHeaders(original);
  assert.equal(out.status, 201);
  assert.equal(await out.text(), "hello");
  assert.equal(out.headers.get("x-custom"), "preserved");
  for (const { key, value } of shared.SECURITY_HEADER_PAIRS) {
    assert.equal(out.headers.get(key), value, `missing ${key}`);
  }
});

test("withSecurityHeaders overwrites pre-existing security headers", async () => {
  // A lower layer must not be able to weaken the contract; the worker
  // layer is the last word.
  const original = new Response("ok", {
    headers: { "X-Frame-Options": "SAMEORIGIN" },
  });
  const out = shared.withSecurityHeaders(original);
  assert.equal(out.headers.get("X-Frame-Options"), "DENY");
});

test("withSecurityHeaders does not mutate the input Headers", () => {
  const original = new Response("ok", {
    headers: { "X-Frame-Options": "SAMEORIGIN" },
  });
  shared.withSecurityHeaders(original);
  // Original is left untouched.
  assert.equal(original.headers.get("X-Frame-Options"), "SAMEORIGIN");
  assert.equal(original.headers.get("X-Content-Type-Options"), null);
});
