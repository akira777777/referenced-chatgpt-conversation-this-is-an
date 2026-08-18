import { chromium } from "playwright";

async function test() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  page.on("pageerror", err => console.error("PAGE ERROR:", err));
  page.on("console", msg => {
    if (msg.type() === "error") console.error("CONSOLE ERROR:", msg.text());
  });

  const results = [];

  try {
    // Test 1: Homepage loads
    console.log("\n=== Test 1: Homepage ===");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForSelector(".brand-logo", { timeout: 10000 });
    console.log("✔ Homepage loaded");
    results.push({ test: "Homepage loads", pass: true });

    // Test 2: Language switcher buttons
    console.log("\n=== Test 2: Language Switcher ===");
    const langBtns = await page.locator(".lang-btn").all();
    console.log(`Found ${langBtns.length} language buttons`);
    // Click RU button
    const ruBtn = page.locator("button[aria-label='Switch to RU']").first();
    await ruBtn.click();
    await page.waitForTimeout(500);
    const heroText = await page.locator(".hero-headline").textContent();
    const ruWorks = heroText.includes("Работает как новый");
    console.log(`RU switch works: ${ruWorks} (hero: "${heroText.substring(0, 40)}...")`);
    results.push({ test: "Language switcher RU", pass: ruWorks });

    // Switch back to EN
    const enBtn = page.locator("button[aria-label='Switch to EN']").first();
    await enBtn.click();
    await page.waitForTimeout(500);
    const heroTextEn = await page.locator(".hero-headline").textContent();
    const enWorks = heroTextEn.includes("Working like new");
    console.log(`EN switch works: ${enWorks}`);
    results.push({ test: "Language switcher EN", pass: enWorks });

    // Test 3: Theme toggle
    console.log("\n=== Test 3: Theme Toggle ===");
    const themeBtn = page.locator("button[title='Toggle theme']").first();
    const wasDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    await themeBtn.click();
    await page.waitForTimeout(300);
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    const themeWorks = wasDark !== isDark;
    console.log(`Theme toggle works: ${themeWorks} (was dark: ${wasDark}, now dark: ${isDark})`);
    results.push({ test: "Theme toggle", pass: themeWorks });

    // Test 4: Search button
    console.log("\n=== Test 4: Search Button ===");
    const searchBtn = page.locator("button[title='Search devices']").first();
    await searchBtn.click();
    await page.waitForTimeout(300);
    const searchModal = await page.locator(".search-modal").isVisible();
    console.log(`Search modal visible after click: ${searchModal}`);
    results.push({ test: "Search button opens modal", pass: searchModal });
    if (searchModal) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const modalGone = !(await page.locator(".search-modal").isVisible());
      console.log(`Search modal closed after Escape: ${modalGone}`);
      results.push({ test: "Search modal closes with Escape", pass: modalGone });
    }

    // Test 5: Interactive Diagnostic buttons
    console.log("\n=== Test 5: Diagnostic Symptom Buttons ===");
    const symptomBtns = await page.locator(".symptom-card").all();
    console.log(`Found ${symptomBtns.length} symptom buttons`);
    if (symptomBtns.length > 1) {
      const firstTitle = await symptomBtns[0].locator("strong").textContent();
      await symptomBtns[1].click();
      await page.waitForTimeout(300);
      const resultTitle = await page.locator(".result-header h3").textContent();
      const diagWorks = resultTitle !== firstTitle;
      console.log(`Diagnostic buttons work: ${diagWorks}`);
      console.log(`  First: "${firstTitle}", After click: "${resultTitle}"`);
      results.push({ test: "Diagnostic symptom buttons", pass: diagWorks });
    }

    // Test 6: Repair Wizard - full flow
    console.log("\n=== Test 6: Repair Wizard Flow ===");
    await page.goto("http://localhost:3000/repair", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForSelector(".choice-grid", { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for hydration

    // Step 0: Brand
    console.log("Step 0: Clicking Apple brand...");
    const appleBtn = page.locator(".choice:has-text('Apple')").first();
    await appleBtn.click();
    await page.waitForTimeout(500);
    const step1Visible = await page.locator(".choice:has-text('iPhone')").first().isVisible();
    console.log(`  Step 1 (category) visible: ${step1Visible}`);
    results.push({ test: "Wizard Step 0→1 (brand)", pass: step1Visible });

    // Step 1: Category
    console.log("Step 1: Clicking iPhone category...");
    const iphoneBtn = page.locator(".choice:has-text('iPhone')").first();
    await iphoneBtn.click();
    await page.waitForTimeout(500);
    const step2Visible = await page.locator(".model-btn").first().isVisible();
    console.log(`  Step 2 (model) visible: ${step2Visible}`);
    results.push({ test: "Wizard Step 1→2 (category)", pass: step2Visible });

    // Step 2: Model
    console.log("Step 2: Clicking first model...");
    const modelBtn = page.locator(".model-btn").first();
    await modelBtn.click();
    await page.waitForTimeout(500);
    const step3Visible = await page.locator(".repair-list button").first().isVisible();
    console.log(`  Step 3 (repairs) visible: ${step3Visible}`);
    results.push({ test: "Wizard Step 2→3 (model)", pass: step3Visible });

    // Step 3: Repairs
    console.log("Step 3: Clicking first repair...");
    const repairBtn = page.locator(".repair-list button").first();
    await repairBtn.click();
    await page.waitForTimeout(300);
    const nextBtn = page.locator(".wizard-nav button").last();
    const nextDisabled = await nextBtn.isDisabled();
    console.log(`  Next button disabled after selecting repair: ${nextDisabled}`);
    results.push({ test: "Wizard Step 3 Next enabled after repair select", pass: !nextDisabled });
    await nextBtn.click();
    await page.waitForTimeout(500);

    // Step 4: Delivery
    console.log("Step 4: Clicking delivery method...");
    const methodBtn = page.locator(".method-list button").first();
    await methodBtn.waitFor({ state: "visible", timeout: 5000 });
    await methodBtn.click();
    await page.waitForTimeout(300);
    const nextBtn2 = page.locator(".wizard-nav button").last();
    await nextBtn2.click();
    await page.waitForTimeout(500);

    // Step 5: Form
    console.log("Step 5: Filling form...");
    await page.locator("input[name='firstName']").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("input[name='firstName']").fill("Test");
    await page.locator("input[name='lastName']").fill("User");
    await page.locator("input[name='email']").fill("test@example.com");
    await page.locator("input[name='phone']").fill("+420737000000");
    await page.locator("input[name='consent']").check({ force: true });
    await page.waitForTimeout(300);
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();
    await page.waitForTimeout(500);

    // Step 6: Confirm
    console.log("Step 6: Clicking confirm...");
    const confirmBtn = page.locator(".confirm-btn");
    await confirmBtn.waitFor({ state: "visible", timeout: 5000 });
    const confirmDisabled = await confirmBtn.isDisabled();
    console.log(`  Confirm button disabled: ${confirmDisabled}`);
    await confirmBtn.click();

    // Wait for navigation
    console.log("Waiting for navigation to /order/success...");
    await page.waitForURL(/\/order\/success/, { timeout: 10000 });
    console.log(`✔ Navigated to: ${page.url()}`);
    results.push({ test: "Wizard full flow to /order/success", pass: true });

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
    results.push({ test: "Last test", pass: false, error: err.message });
  } finally {
    await browser.close();
  }

  console.log("\n=== RESULTS SUMMARY ===");
  for (const r of results) {
    console.log(`${r.pass ? "✔" : "❌"} ${r.test}${r.error ? ` - ${r.error}` : ""}`);
  }
}

test();
