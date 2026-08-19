/**
 * Unit tests for the shared security-headers configuration.
 *
 * Pins the single source of truth in lib/security-headers.ts so
 * next.config.ts, middleware.ts, and worker/index.ts can't drift, and so a
 * reviewer is forced to acknowledge any change to the baseline header set,
 * the CSP construction, nonce generation, or withSecurityHeaders().
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

test("SECURITY_HEADER_RULES does not include a CSP (owned by middleware)", () => {
  // The CSP is per-request (nonce) and must never be baked into the static
  // next.config headers — a static CSP without the matching nonce would
  // break every page.
  for (const rule of shared.SECURITY_HEADER_RULES) {
    for (const h of rule.headers) {
      assert.ok(
        !/^content-security-policy/i.test(h.key),
        "next.config must not set a CSP"
      );
    }
  }
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

// ─── Nonce generation ────────────────────────────────────────────────────────

test("generateNonce returns 24-char base64 strings", () => {
  const nonce = shared.generateNonce();
  // 16 bytes -> 24 base64 chars (2 padding chars included).
  assert.equal(nonce.length, 24);
  assert.match(nonce, /^[A-Za-z0-9+/]+==$/);
});

test("generateNonce never emits characters vinext rejects", () => {
  // vinext/dist/server/csp.js throws when a nonce contains &, >, <,
  // U+2028 or U+2029. Base64 can't contain them, but verify anyway over
  // a large sample since this is the security backbone.
  for (let i = 0; i < 2000; i++) {
    const n = shared.generateNonce();
    assert.doesNotMatch(n, /[&<>\u2028\u2029]/);
  }
});

test("generateNonce produces unique values", () => {
  const seen = new Set();
  for (let i = 0; i < 1000; i++) seen.add(shared.generateNonce());
  assert.equal(seen.size, 1000, "1000 generated nonces must all differ");
});

// ─── CSP construction ────────────────────────────────────────────────────────

test("buildCspHeaderValue embeds the nonce and bans inline scripts", () => {
  const nonce = shared.generateNonce();
  const csp = shared.buildCspHeaderValue(nonce);
  assert.match(csp, new RegExp(`script-src 'self' 'nonce-${nonce.replace(/[+/=]/g, "\\$&")}'`));
  // The whole point of the nonce: no 'unsafe-inline' for scripts.
  assert.ok(!/script-src[^;]*'unsafe-inline'/.test(csp));
});

test("buildCspHeaderValue contains the required directives", () => {
  const csp = shared.buildCspHeaderValue("TESTNONCE");
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /style-src 'self' 'unsafe-inline'/);
  assert.match(csp, /img-src[^;]*https:\/\/\*\.supabase\.co/);
  assert.match(csp, /connect-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'self'/);
  assert.match(csp, /form-action 'self'/);
  assert.match(csp, /report-uri \/api\/csp-report/);
});

test("CSP is in ENFORCE mode (CSP_REPORT_ONLY=false)", () => {
  assert.equal(shared.CSP_REPORT_ONLY, false);
  assert.equal(shared.CSP_HEADER_NAME, "Content-Security-Policy");
});

test("CSP_FALLBACK stays report-only and is the legacy CSP_HEADER", () => {
  assert.equal(shared.CSP_FALLBACK.key, "Content-Security-Policy-Report-Only");
  assert.match(shared.CSP_FALLBACK.value, /report-uri \/api\/csp-report/);
  assert.equal(shared.CSP_HEADER.key, shared.CSP_FALLBACK.key);
  assert.equal(shared.CSP_HEADER.value, shared.CSP_FALLBACK.value);
});

// ─── withSecurityHeaders helper (worker layer) ──────────────────────────────

test("withSecurityHeaders adds baseline + fallback CSP to a bare response", async () => {
  const out = shared.withSecurityHeaders(
    new Response("hello", { status: 201, headers: { "x-custom": "preserved" } })
  );
  assert.equal(out.status, 201);
  assert.equal(await out.text(), "hello");
  assert.equal(out.headers.get("x-custom"), "preserved");
  for (const { key, value } of shared.SECURITY_HEADER_PAIRS) {
    assert.equal(out.headers.get(key), value, `missing ${key}`);
  }
  // No CSP on the input -> report-only fallback is attached.
  assert.equal(
    out.headers.get("content-security-policy-report-only"),
    shared.CSP_FALLBACK.value
  );
});

test("withSecurityHeaders PRESERVES a nonce CSP set by middleware", () => {
  const nonceCsp = shared.buildCspHeaderValue("MW2345678901234567890a");
  const out = shared.withSecurityHeaders(
    new Response("ok", { headers: { "content-security-policy": nonceCsp } })
  );
  assert.equal(out.headers.get("content-security-policy"), nonceCsp);
  // And must not add a second, conflicting report-only CSP.
  assert.equal(out.headers.get("content-security-policy-report-only"), null);
});

test("withSecurityHeaders overwrites pre-existing baseline headers", () => {
  const out = shared.withSecurityHeaders(
    new Response("ok", { headers: { "X-Frame-Options": "SAMEORIGIN" } })
  );
  assert.equal(out.headers.get("X-Frame-Options"), "DENY");
});

test("withSecurityHeaders does not mutate the input Headers", () => {
  const original = new Response("ok", { headers: { "X-Frame-Options": "SAMEORIGIN" } });
  shared.withSecurityHeaders(original);
  assert.equal(original.headers.get("X-Frame-Options"), "SAMEORIGIN");
  assert.equal(original.headers.get("X-Content-Type-Options"), null);
});

// ─── Cross-file contract: middleware uses the shared helpers ────────────────

test("middleware.ts wires the shared nonce helpers", async () => {
  const fs = await import("node:fs/promises");
  const src = await fs.readFile(new URL("../middleware.ts", import.meta.url), "utf8");
  assert.match(src, /generateNonce/);
  assert.match(src, /buildCspHeaderValue/);
  assert.match(src, /NONCE_REQUEST_HEADER/);
  // The response header must be the enforced CSP name.
  assert.match(src, /response\.headers\.set\("Content-Security-Policy"/);
});
