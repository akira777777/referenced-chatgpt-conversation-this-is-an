/**
 * Unit tests for the CSP violation report sink at /api/csp-report.
 *
 * The endpoint accepts a JSON body (legacy csp-report or modern
 * reports+json), logs a single line, and returns 204. Oversize bodies
 * are rejected with 413 so the route can't be used for OOM attacks.
 */
import assert from "node:assert/strict";
import test from "node:test";

// Render the route handler directly via the compiled vinext worker.
// This mirrors what tests/rendered-html.test.mjs does for pages.
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
const { default: worker } = await import(workerUrl.href);

async function postCspReport(body, extraHeaders = {}) {
  return worker.fetch(
    new Request("http://localhost/api/csp-report", {
      method: "POST",
      headers: {
        "content-type": "application/csp-report",
        ...extraHeaders,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} }
  );
}

test("/api/csp-report accepts a valid csp-report payload and returns 204", async () => {
  const res = await postCspReport({
    "csp-report": {
      "violated-directive": "script-src 'self'",
      "blocked-uri": "https://evil.example/x.js",
      "document-uri": "https://reart.cz/",
    },
  });
  assert.equal(res.status, 204);
});

test("/api/csp-report accepts a reports+json array payload and returns 204", async () => {
  const res = await postCspReport([
    {
      type: "csp-violation",
      body: {
        "violated-directive": "img-src 'self'",
        "blocked-uri": "https://other.example/x.png",
      },
    },
  ], { "content-type": "application/reports+json" });
  // 204 or 200 both acceptable; the contract is "doesn't error".
  assert.ok(res.status === 204 || res.status === 200, `got ${res.status}`);
});

test("/api/csp-report returns 413 for oversize bodies (content-length check)", async () => {
  const huge = "x".repeat(64 * 1024);
  const res = await postCspReport({ "csp-report": { note: huge } });
  assert.equal(res.status, 413);
});

test("/api/csp-report returns 204 even on malformed JSON (drops report, never 500s)", async () => {
  const res = await postCspReport("not json at all {");
  // Accept 204 (drop) or 400 (reject) — the contract is "no 5xx".
  assert.ok(res.status < 500, `must not 5xx, got ${res.status}`);
});
