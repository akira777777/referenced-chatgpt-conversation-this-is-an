/**
 * Browser verification of the enforced nonce CSP.
 *
 * Starts the standalone production server, drives headless Chromium, and
 * asserts that:
 *   1. No CSP violations are logged on any major page (enforced mode blocks
 *      scripts, so a violation would mean broken functionality).
 *   2. Hydration works — the language switcher changes the hero headline,
 *      which is only possible if every hydration script executed. This is
 *      the end-to-end proof that vinext stamped valid nonces on all its
 *      inline/module scripts.
 *   3. The CSP header nonce matches the nonce attributes in the HTML.
 *   4. Every request gets a fresh nonce.
 *
 * Run: node tests/csp-nonce.browser.mjs   (requires a production build)
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { chromium } from "playwright";

const PORT = 4199;

function waitForPort(port, timeout = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      if (Date.now() - start > timeout) {
        reject(new Error(`Server not ready on ${port} within ${timeout}ms`));
        return;
      }
      const socket = createConnection(port, "localhost");
      socket.once("connect", () => { socket.end(); resolve(); });
      socket.once("error", () => setTimeout(tryConnect, 250));
    };
    tryConnect();
  });
}

async function main() {
  console.log("🚀 Starting production server for CSP nonce verification...");
  const server = spawn("node", ["dist/standalone/server.js"], {
    stdio: "ignore",
    env: { ...process.env, PORT: String(PORT) },
  });
  await waitForPort(PORT);
  const baseUrl = `http://localhost:${PORT}`;
  console.log(`✅ Server ready on ${baseUrl}`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const violations = [];

  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    // Capture CSP violations. Chromium logs them as console errors starting
    // with "Refused to" (scripts/styles/etc.) or as securitypolicyviolation
    // events.
    page.on("console", (msg) => {
      const text = msg.text();
      if (msg.type() === "error" && /refused to|content security policy/i.test(text)) {
        violations.push(text);
      }
    });
    await page.addInitScript(() => {
      window.__cspViolations = [];
      document.addEventListener("securitypolicyviolation", (e) => {
        window.__cspViolations.push(
          `${e.violatedDirective} blocked ${e.blockedURI} (${e.sourceFile || "inline"}:${e.lineNumber})`
        );
      });
    });

    // ── 1. Homepage: headers + nonce match + hydration ────────────────────
    console.log("▶ [1/4] Homepage: enforced CSP + hydration...");
    const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    const csp = response.headers()["content-security-policy"] ?? "";
    assert.ok(csp.length > 0, "Content-Security-Policy header must be present");
    assert.ok(!csp.includes("Report-Only"), "must be enforced, not report-only");
    assert.ok(!/script-src[^;]*'unsafe-inline'/.test(csp), "script-src must not contain 'unsafe-inline'");
    const headerNonce = (csp.match(/'nonce-([^']+)'/) ?? [])[1];
    assert.ok(headerNonce, "CSP must carry a nonce");

    // The theme bootstrap + JSON-LD scripts in the HTML must carry the nonce.
    // NOTE: browsers deliberately hide the nonce *content attribute* from
    // innerHTML/serialization (to prevent leakage), so we read the `nonce`
    // IDL property instead — that is exactly what the CSP engine checks.
    await page.waitForSelector(".hero-headline", { timeout: 15000 });
    const domNonces = await page.evaluate(() =>
      Array.from(document.querySelectorAll("script")).map(s => s.nonce).filter(Boolean)
    );
    assert.ok(domNonces.length > 0, "scripts in the DOM should expose a nonce");
    assert.ok(
      domNonces.every(n => n === headerNonce),
      `all DOM nonces (${new Set(domNonces).size} unique) must equal the header nonce`
    );

    // Hydration proof: switch language to Russian and check the headline
    // actually changed. If CSP blocked the hydration bundle, the click
    // handler would never run and the headline would stay in Czech.
    const headlineBefore = await page.locator(".hero-headline").first().textContent();
    await page.waitForFunction(() => {
      const btn = document.querySelector("button[aria-label='Switch to RU']");
      if (btn) btn.click();
      return document.querySelector(".hero-headline")?.textContent !== null;
    }, { timeout: 10000 });
    await page.waitForTimeout(500);
    const headlineAfter = await page.locator(".hero-headline").first().textContent();
    assert.notEqual(headlineAfter, headlineBefore, "language switch must change the headline (hydration works)");
    console.log("  ✔ Hydration works — language switch executed client JS");

    // ── 2. Client-side RSC navigation (/prices, /faq, /repair/apple) ──────
    console.log("▶ [2/4] Client-side navigation pages...");
    for (const path of ["/prices", "/faq", "/repair/apple", "/track"]) {
      const r = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
      const pageCsp = r.headers()["content-security-policy"] ?? "";
      assert.ok(pageCsp.includes("'nonce-"), `${path}: CSP with nonce expected`);
      await page.waitForTimeout(300);
    }
    console.log("  ✔ /prices, /faq, /repair/apple, /track all served nonce CSP");

    // ── 3. FAQ page schema is present (moved to server layout) ────────────
    console.log("▶ [3/4] FAQ JSON-LD survives the move to the server layout...");
    await page.goto(`${baseUrl}/faq`, { waitUntil: "domcontentloaded" });
    const faqHtml = await page.content();
    assert.match(faqHtml, /FAQPage/);
    console.log("  ✔ FAQPage schema rendered server-side");

    // ── 4. Fresh nonce across requests ────────────────────────────────────
    console.log("▶ [4/4] Fresh nonce per request...");
    const n1 = (await page.goto(baseUrl, { waitUntil: "domcontentloaded" }))
      .headers()["content-security-policy"].match(/'nonce-([^']+)'/)[1];
    const n2 = (await page.goto(baseUrl, { waitUntil: "domcontentloaded" }))
      .headers()["content-security-policy"].match(/'nonce-([^']+)'/)[1];
    assert.notEqual(n1, n2, "consecutive requests must get different nonces");
    console.log("  ✔ Nonces rotate per request");

    // ── Violation summary ─────────────────────────────────────────────────
    const domViolations = await page.evaluate(() => window.__cspViolations ?? []);
    violations.push(...domViolations);
    assert.deepEqual(violations, [], `CSP violations detected:\n${violations.join("\n")}`);

    console.log("\n=======================================================");
    console.log("🎉 ENFORCED NONCE CSP VERIFIED — zero violations, hydration OK");
    console.log("=======================================================");
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("❌ CSP NONCE VERIFICATION FAILED:", err);
  process.exit(1);
});
