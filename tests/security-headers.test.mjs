/**
 * Unit tests for the Next.js security-headers configuration.
 *
 * Locks in the contract of next.config.ts `headers()` so a future refactor
 * can't silently drop HSTS, clickjacking protection, or referrer policy.
 */
import assert from "node:assert/strict";
import test from "node:test";

// next.config.ts is TypeScript; the test runner strips types at import time.
const configModule = await import("../next.config.ts");
const nextConfig = configModule.default;

test("next.config exports a headers() function", () => {
  assert.equal(typeof nextConfig.headers, "function");
});

test("headers() returns at least one rule covering all routes", async () => {
  const rules = await nextConfig.headers();
  assert.ok(Array.isArray(rules), "headers() should return an array");
  assert.ok(rules.length >= 1, "headers() should return at least one rule");
  const catchAll = rules.find((r) => r.source === "/:path*");
  assert.ok(catchAll, "expected a catch-all rule with source '/:path*'");
  assert.ok(Array.isArray(catchAll.headers), "rule should have a headers array");
});

test("headers include the baseline security set", async () => {
  const rules = await nextConfig.headers();
  const rule = rules.find((r) => r.source === "/:path*");
  const headerMap = Object.fromEntries(rule.headers.map((h) => [h.key, h.value]));

  // Each header is a hard requirement; if any of these is removed the test
  // must fail so a reviewer is forced to acknowledge the regression.
  assert.equal(
    headerMap["Strict-Transport-Security"],
    "max-age=31536000; includeSubDomains",
    "HSTS must be enabled with at least 1 year and includeSubDomains"
  );
  assert.equal(headerMap["X-Content-Type-Options"], "nosniff");
  assert.equal(headerMap["X-Frame-Options"], "DENY");
  assert.equal(headerMap["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(headerMap["Permissions-Policy"], /camera=\(\)/);
  assert.match(headerMap["Permissions-Policy"], /microphone=\(\)/);
  assert.match(headerMap["Permissions-Policy"], /geolocation=\(\)/);
  assert.equal(headerMap["Cross-Origin-Opener-Policy"], "same-origin");
});
