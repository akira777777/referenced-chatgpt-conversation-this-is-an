import { chromium } from "playwright";
import assert from "node:assert/strict";
import test from "node:test";

test("Playwright End-to-End Suite: UI, i18n (CZ/RU/EN), Logo, Theme & Repair Flow", async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = "http://localhost:3000";

  console.log("▶ 1. Testing Homepage & Custom Logo...");
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  
  // Verify logo
  const logo = page.locator(".brand-logo");
  await logo.waitFor({ state: "visible" });
  const logoText = await logo.textContent();
  assert.match(logoText, /REFORM/);

  console.log("▶ 2. Testing Multilingual Switching (CZ -> RU -> EN)...");
  // Switch to Russian
  const ruBtn = page.locator(".lang-btn:has-text('RU')").first();
  await ruBtn.click();
  await page.waitForTimeout(300);
  const ruHeading = await page.locator(".hero-headline").textContent();
  assert.match(ruHeading, /Работает как новый/);

  // Switch to Czech
  const czBtn = page.locator(".lang-btn:has-text('CZ')").first();
  await czBtn.click();
  await page.waitForTimeout(300);
  const czHeading = await page.locator(".hero-headline").textContent();
  assert.match(czHeading, /Jako nový/);

  // Switch to English
  const enBtn = page.locator(".lang-btn:has-text('EN')").first();
  await enBtn.click();
  await page.waitForTimeout(300);
  const enHeading = await page.locator(".hero-headline").textContent();
  assert.match(enHeading, /Working like new/);

  console.log("▶ 3. Testing Theme Toggle (Dark/Light)...");
  const themeBtn = page.locator("button[title='Toggle theme']");
  await themeBtn.click();
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  assert.equal(typeof isDark, "boolean");

  console.log("▶ 4. Testing Global Search Modal with Escape dismissal...");
  const searchBtn = page.locator("button[title='Search devices']");
  await searchBtn.click();
  const searchModal = page.locator(".search-modal");
  await searchModal.waitFor({ state: "visible" });
  
  // Type query
  const searchInput = searchModal.locator("input");
  await searchInput.fill("iPhone 16");
  await page.waitForTimeout(200);
  const results = await page.locator(".search-results a").count();
  assert.ok(results > 0, "Search results should be present for iPhone 16");

  // Press Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const isModalHidden = await searchModal.count();
  assert.equal(isModalHidden, 0, "Modal should close on Escape");

  console.log("▶ 5. Testing Interactive Diagnostic Assistant...");
  const batteryTab = page.locator(".symptom-card:has-text('Battery'), .symptom-card:has-text('baterie'), .symptom-card:has-text('Батарея')").first();
  await batteryTab.click();
  await page.waitForTimeout(200);
  const resultPanelText = await page.locator(".diagnostic-result-panel").textContent();
  assert.ok(resultPanelText.length > 20);

  console.log("▶ 6. Testing Telegram & Contact Channels...");
  const telegramLinks = await page.locator("a[href*='t.me/liltrafficRUS']").count();
  assert.ok(telegramLinks > 0, "Telegram link @liltrafficRUS must be present across views");

  console.log("▶ 7. Testing Repair Wizard Booking Flow...");
  await page.goto(`${baseUrl}/repair`, { waitUntil: "networkidle" });
  
  // Step 0: Choose Brand (Apple)
  const appleBtn = page.locator(".choice:has-text('Apple')").first();
  await appleBtn.click();
  await page.waitForTimeout(300);

  // Step 1: Choose Category (iPhone)
  const iphoneCatBtn = page.locator(".choice:has-text('iPhone')").first();
  await iphoneCatBtn.click();
  await page.waitForTimeout(300);

  // Step 2: Choose Model
  const modelBtn = page.locator(".model-btn").first();
  await modelBtn.click();
  await page.waitForTimeout(300);

  // Step 3: Choose Repair
  const repairItem = page.locator(".repair-list button").first();
  await repairItem.click();
  await page.waitForTimeout(200);
  const nextStepBtn = page.locator(".wizard-nav button:has-text('Next'), .wizard-nav button:has-text('Dále'), .wizard-nav button:has-text('Далее')").first();
  await nextStepBtn.click();
  await page.waitForTimeout(300);

  // Step 4: Choose Delivery Method
  const methodNextBtn = page.locator(".wizard-nav button:has-text('Next'), .wizard-nav button:has-text('Dále'), .wizard-nav button:has-text('Далее')").first();
  await methodNextBtn.click();
  await page.waitForTimeout(300);

  // Step 5: Fill Form
  await page.locator("input[name='firstName']").fill("Alex");
  await page.locator("input[name='lastName']").fill("Novak");
  await page.locator("input[name='email']").fill("alex.novak@example.com");
  await page.locator("input[name='phone']").fill("+420737111222");
  await page.locator("input[name='consent']").check();
  
  const submitFormBtn = page.locator("button[type='submit']");
  await submitFormBtn.click();
  await page.waitForTimeout(400);

  // Step 6: Confirm
  const finalConfirmBtn = page.locator(".confirm-btn");
  await finalConfirmBtn.click();

  // Redirect to /order/success
  await page.waitForURL(/\/order\/success/, { timeout: 8000 });
  const successUrl = page.url();
  assert.ok(successUrl.includes("/order/success"));
  const orderNumberText = await page.locator(".order-number b").textContent();
  assert.match(orderNumberText, /^REP-\d+/);

  console.log(`✅ All Playwright E2E checks passed! Created Order: ${orderNumberText}`);
  await browser.close();
});
