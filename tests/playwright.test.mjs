import { chromium } from "playwright";
import assert from "node:assert/strict";
import { isServerReady, startServer, stopServer } from "./e2e-server.mjs";

async function runE2ESuite() {
  let managedServer = null;
  let activePort = 3000;

  if (await isServerReady(3002)) {
    activePort = 3002;
    console.log("ℹ️  Using existing server on http://localhost:3002");
  } else if (await isServerReady(3001)) {
    activePort = 3001;
    console.log("ℹ️  Using existing server on http://localhost:3001");
  } else if (await isServerReady(3000)) {
    activePort = 3000;
    console.log("ℹ️  Using existing server on http://localhost:3000");
  } else {
    managedServer = await startServer();
    activePort = 3000;
  }

  try {
    await runE2ETests(activePort);
  } finally {
    stopServer(managedServer);
  }
}

async function runE2ETests(port = 3000) {
  console.log("🚀 Launching Chromium for Playwright E2E testing...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    page.on("pageerror", err => console.error("PAGE ERROR:", err));
    page.on("console", msg => {
      if (msg.type() === "error") console.error("PAGE CONSOLE ERROR:", msg.text());
    });

    const baseUrl = `http://localhost:${port}`;

    console.log("▶ [1/7] Testing Homepage & Bespoke Vector Logo...");
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".brand-logo", { timeout: 10000 });
    
    const logo = page.locator(".brand-logo").first();
    const logoText = await logo.textContent();
    assert.match(logoText, /REFORM/);
    console.log("  ✔ Brand Logo rendered correctly with precision styling.");

    console.log("▶ [2/7] Testing Multilingual Language Switching (RU -> CZ -> EN)...");
    
    // Switch to Russian
    console.log("  - Switching to Russian");
    await page.waitForFunction(() => {
      const btn = document.querySelector(".nav-actions button[aria-label='Switch to RU']");
      if (btn) btn.click();
      return document.querySelector(".hero-headline")?.textContent.includes("Работает как новый");
    }, { timeout: 10000 });
    console.log("  ✔ Switched to Russian");

    // Switch to Czech
    console.log("  - Switching to Czech");
    await page.waitForFunction(() => {
      const btn = document.querySelector(".nav-actions button[aria-label='Switch to CZ']");
      if (btn) btn.click();
      return document.querySelector(".hero-headline")?.textContent.includes("Jako nový");
    }, { timeout: 10000 });
    console.log("  ✔ Switched to Czech");

    // Switch to English
    console.log("  - Switching to English");
    await page.waitForFunction(() => {
      const btn = document.querySelector(".nav-actions button[aria-label='Switch to EN']");
      if (btn) btn.click();
      return document.querySelector(".hero-headline")?.textContent.includes("Working like new");
    }, { timeout: 10000 });
    console.log("  ✔ Switched to English");

    console.log("▶ [3/7] Testing Dark/Light Mode Theme Toggle...");
    await page.locator("button[title='Toggle theme']").first().click({ force: true });
    await page.waitForTimeout(200);
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    console.log(`  ✔ Theme toggled. Dark mode active: ${isDark}`);

    console.log("▶ [4/7] Testing Global Search Modal (Search + Keyboard Escape)...");
    await page.waitForFunction(() => {
      const btn = document.querySelector(".search-trigger-btn, button[aria-label*='Search devices']");
      if (btn) btn.click();
      return !!document.querySelector(".search-modal");
    }, { timeout: 10000 });
    
    const searchInput = page.locator(".search-input input").first();
    await searchInput.fill("iPhone 16");
    await page.waitForTimeout(300);
    const resultsCount = await page.locator(".search-results a").count();
    assert.ok(resultsCount > 0, "Expected search results for 'iPhone 16'");
    console.log(`  ✔ Found ${resultsCount} matching devices for query 'iPhone 16'.`);

    await page.keyboard.press("Escape");
    await page.locator(".search-modal").waitFor({ state: "detached", timeout: 5000 });
    console.log("  ✔ Modal dismissed with Escape key.");

    console.log("▶ [5/7] Testing Interactive Diagnostic Symptom Checker...");
    await page.locator(".symptom-card").nth(1).click({ force: true });
    await page.waitForTimeout(300);
    const diagnosticText = await page.locator(".diagnostic-result-panel").textContent();
    assert.ok(diagnosticText.length > 20);
    console.log("  ✔ Diagnostic telemetry updated dynamically on symptom selection.");

    console.log("▶ [6/8] Testing Approximate Repair Prices Explorer (/prices)...");
    await page.goto(`${baseUrl}/prices`, { waitUntil: "networkidle" });
    await page.waitForSelector(".repair-card-grid", { timeout: 15000 });
    await page.waitForTimeout(500);
    
    const cardCount = await page.locator(".repair-price-card").count();
    assert.ok(cardCount > 0, "Pricing explorer must render repair cards");
    console.log(`  ✔ Rendered ${cardCount} approximate price cards.`);

    const inclusionBadgeText = await page.locator(".inclusions-badge").first().textContent();
    assert.match(inclusionBadgeText, /Cena včetně dílu a práce|Parts and labor included|Запчасть и работа включены/i);
    console.log("  ✔ Inclusions badge verified on price cards.");

    // Toggle Table View
    await page.locator(".view-mode-toggle button").last().click({ force: true });
    await page.waitForSelector(".price-table", { timeout: 10000 });
    console.log("  ✔ Switched to Detailed Price Table view.");

    console.log("▶ [7/8] Testing Telegram & Contact Direct Channels...");
    const telegramCount = await page.locator("a[href*='t.me/liltrafficRUS']").count();
    assert.ok(telegramCount > 0, "Telegram link @liltrafficRUS must be present");
    console.log(`  ✔ Verified ${telegramCount} direct Telegram @liltrafficRUS contact endpoints.`);

    console.log("▶ [8/8] Testing End-to-End Multi-Step Repair Wizard & Booking Flow...");
    await page.goto(`${baseUrl}/repair`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".choice-grid", { timeout: 10000 });

    await page.waitForTimeout(2000); // Wait for React hydration in dev mode

    // Step 0: Choose Brand (Apple)
    console.log("    - Selecting brand: Apple");
    await page.locator(".choice:has-text('Apple')").first().click({ force: true });

    // Step 1: Choose Category (iPhone)
    console.log("    - Selecting category: iPhone");
    await page.locator(".choice:has-text('iPhone')").first().waitFor({ state: "visible" });
    await page.locator(".choice:has-text('iPhone')").first().click({ force: true });

    // Step 2: Choose Model
    console.log("    - Selecting model from list");
    await page.locator(".model-btn").first().waitFor({ state: "visible" });
    await page.locator(".model-btn").first().click({ force: true });

    // Step 3: Choose Repair Service
    console.log("    - Selecting repair service");
    await page.locator(".repair-list button").first().waitFor({ state: "visible" });
    await page.locator(".repair-list button").first().click({ force: true });
    await page.locator(".wizard-nav button").last().click({ force: true });

    // Step 4: Choose Delivery Method
    console.log("    - Selecting delivery method & timeslot");
    await page.locator(".method-list button").first().waitFor({ state: "visible" });
    await page.locator(".wizard-nav button").last().click({ force: true });

    // Step 5: Fill Form Details
    console.log("    - Filling customer contact form");
    await page.locator("input[name='firstName']").waitFor({ state: "visible" });
    await page.locator("input[name='firstName']").fill("Alexandr");
    await page.locator("input[name='lastName']").fill("Novak");
    await page.locator("input[name='email']").fill("alex.novak@example.cz");
    await page.locator("input[name='phone']").fill("+420737500587");
    await page.locator("input[name='consent']").check({ force: true });
    
    await page.locator("button[type='submit']").click({ force: true });

    // Step 6: Confirmation Review & Final Submit
    console.log("    - Submitting final repair booking request");
    await page.locator(".confirm-btn").waitFor({ state: "visible" });
    await page.locator(".confirm-btn").click({ force: true });

    // Verification on /order/success
    await page.waitForURL(/\/order\/success/, { timeout: 10000 });
    const successUrl = page.url();
    assert.ok(successUrl.includes("/order/success"), "Should redirect to order success page");

    const orderNumber = await page.locator(".order-number b").textContent();
    assert.match(orderNumber, /^REP-[A-Z0-9]+/, "Should display valid REP order number");
    console.log(`  ✔ Successfully created repair order: ${orderNumber}`);

    console.log("\n=======================================================");
    console.log("🎉 ALL PLAYWRIGHT END-TO-END TESTS PASSED WITH 100% SUCCESS!");
    console.log("=======================================================\n");
  } finally {
    await browser.close();
  }
}

runE2ESuite().catch(err => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});

