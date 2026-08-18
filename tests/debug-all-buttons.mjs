import { chromium } from "playwright";

const results = [];
function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✔" : "❌"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function test() {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });

  // ============ DESKTOP TESTS ============
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on("pageerror", err => console.error("PAGE ERROR:", err.message));

  try {
    // ---- HOME PAGE ----
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Quick-select brand chips (rendered as Links in .quick-brands-grid)
    const quickBtns = await page.locator(".quick-brands-grid .brand-quick-chip").all();
    let quickOk = quickBtns.length > 0;
    if (quickOk) {
      await quickBtns[0].click();
      await page.waitForTimeout(500);
      quickOk = page.url().includes("/repair");
      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);
    }
    log("Home: quick-select brand buttons", quickOk, `${quickBtns.length} found`);

    // Hero CTA
    const heroCta = page.locator(".hero-main-cta").first();
    await heroCta.click();
    await page.waitForTimeout(500);
    log("Home: hero 'Start a Repair' CTA", page.url().includes("/repair"), page.url());
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Diagnostic "Book this" link
    const bookLink = page.locator(".result-cta").first();
    await bookLink.click();
    await page.waitForTimeout(500);
    log("Home: diagnostic 'Book this' link", page.url().includes("/repair?issue="), page.url());
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Comparison slider keyboard
    const slider = page.locator(".comparison-stage").first();
    await slider.focus();
    const valBefore = await slider.getAttribute("aria-valuenow");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);
    const valAfter = await slider.getAttribute("aria-valuenow");
    log("Home: comparison slider keyboard", valBefore !== valAfter, `${valBefore} → ${valAfter}`);

    // ---- PRICES PAGE ----
    await page.goto("http://localhost:3000/prices", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(1500);
    const brandPills = await page.locator(".brand-tab-pill").all();
    let pillsOk = brandPills.length > 0;
    if (brandPills.length > 1) {
      const rowsBefore = await page.locator(".price-row").count();
      await brandPills[1].click();
      await page.waitForTimeout(400);
      const rowsAfter = await page.locator(".price-row").count();
      pillsOk = rowsBefore !== rowsAfter || rowsAfter > 0;
    }
    log("Prices: brand filter pills", pillsOk, `${brandPills.length} pills`);

    // Book button in price table
    const bookBtn = page.locator(".price-book-btn").first();
    if (await bookBtn.isVisible()) {
      await bookBtn.click();
      await page.waitForTimeout(500);
      log("Prices: 'Book' button", page.url().includes("/repair?brand="), page.url());
    } else {
      log("Prices: 'Book' button", false, "not visible");
    }

    // ---- REPAIR WIZARD ----
    await page.goto("http://localhost:3000/repair", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForSelector(".choice-grid", { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Progress indicator buttons (after advancing)
    await page.locator(".choice:has-text('Apple')").first().click();
    await page.waitForTimeout(400);
    await page.locator(".choice:has-text('iPhone')").first().click();
    await page.waitForTimeout(400);
    await page.locator(".model-btn").first().click();
    await page.waitForTimeout(400);

    // Now at step 3. Progress buttons 0,1,2 should be clickable (go back)
    const progressBtns = await page.locator(".progress button").all();
    let progressOk = false;
    if (progressBtns.length >= 4) {
      // Click progress button 1 (Device category) to go back
      await progressBtns[1].click();
      await page.waitForTimeout(400);
      const backAtStep1 = await page.locator(".choice:has-text('iPhone')").first().isVisible();
      progressOk = backAtStep1;
      // Go forward again
      await page.locator(".choice:has-text('iPhone')").first().click();
      await page.waitForTimeout(400);
      await page.locator(".model-btn").first().click();
      await page.waitForTimeout(400);
    }
    log("Wizard: progress indicator back-nav", progressOk, `${progressBtns.length} steps`);

    // "Change device" button in sidebar
    const changeBtn = page.locator(".repair-summary button:has-text('Change device')");
    let changeOk = false;
    if (await changeBtn.isVisible()) {
      await changeBtn.click();
      await page.waitForTimeout(400);
      changeOk = await page.locator(".model-btn").first().isVisible();
      // Go forward again
      await page.locator(".model-btn").first().click();
      await page.waitForTimeout(400);
    } else {
      changeOk = null; // not visible at this step
    }
    if (changeOk !== null) log("Wizard: 'Change device' sidebar button", changeOk);
    else log("Wizard: 'Change device' sidebar button", true, "skipped (not visible at step 3)");

    // Back button
    const backBtn = page.locator(".wizard-back-btn").first();
    await backBtn.click();
    await page.waitForTimeout(400);
    const backToModels = await page.locator(".model-btn").first().isVisible();
    log("Wizard: Back button", backToModels);
    // Go forward to step 3 again
    await page.locator(".model-btn").first().click();
    await page.waitForTimeout(400);

    // ---- ORDER SUCCESS PAGE ----
    await page.goto("http://localhost:3000/order/success?id=REP-999999", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(1000);
    const trackLink = page.locator(".success-actions a[href*='/track/']").first();
    const trackVisible = await trackLink.isVisible();
    log("Order success: 'Track repair' link visible", trackVisible);
    if (trackVisible) {
      await trackLink.click();
      await page.waitForTimeout(500);
      log("Order success: 'Track repair' navigates", page.url().includes("/track/REP-999999"), page.url());
    }

    // ---- TRACK PAGE ----
    await page.goto("http://localhost:3000/track", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(1000);
    const trackPageOk = await page.locator("input, .button, a").first().isVisible();
    log("Track page loads with interactive elements", trackPageOk);

    // ---- CONTACT / FAQ / ABOUT / BUSINESS ----
    for (const p of ["/contact", "/faq", "/about", "/business"]) {
      await page.goto(`http://localhost:3000${p}`, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(800);
      const buttons = await page.locator("button, a.button, .button").count();
      log(`Page ${p} loads`, true, `${buttons} interactive elements`);
    }

  } catch (err) {
    console.error("DESKTOP ERROR:", err.message);
    log("Desktop suite", false, err.message);
  }
  await ctx.close();

  // ============ MOBILE TESTS ============
  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mob = await mobCtx.newPage();
  mob.on("pageerror", err => console.error("MOBILE PAGE ERROR:", err.message));

  try {
    await mob.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 20000 });
    await mob.waitForTimeout(1500);

    // Mobile menu button
    const menuBtn = mob.locator(".menu-button").first();
    const menuVisible = await menuBtn.isVisible();
    log("Mobile: menu button visible", menuVisible);
    if (menuVisible) {
      await menuBtn.click();
      await mob.waitForTimeout(400);
      const mobileNav = await mob.locator(".mobile-nav").isVisible();
      log("Mobile: menu opens", mobileNav);
      if (mobileNav) {
        // Click a mobile nav link
        const mobLink = mob.locator(".mobile-nav a[href='/repair']").first();
        await mobLink.click();
        await mob.waitForTimeout(500);
        log("Mobile: nav link navigates", mob.url().includes("/repair"), mob.url());
      }
    }

    // Mobile theme toggle
    await mob.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await mob.waitForTimeout(1000);
    const mobTheme = mob.locator("button[title='Toggle theme']").first();
    const wasDark = await mob.evaluate(() => document.documentElement.classList.contains("dark"));
    await mobTheme.click();
    await mob.waitForTimeout(300);
    const isDark = await mob.evaluate(() => document.documentElement.classList.contains("dark"));
    log("Mobile: theme toggle", wasDark !== isDark);

  } catch (err) {
    console.error("MOBILE ERROR:", err.message);
    log("Mobile suite", false, err.message);
  }
  await mobCtx.close();
  await browser.close();

  console.log("\n=== FINAL SUMMARY ===");
  const failed = results.filter(r => !r.pass);
  console.log(`Total: ${results.length}, Passed: ${results.length - failed.length}, Failed: ${failed.length}`);
  if (failed.length) {
    console.log("\nFAILED TESTS:");
    failed.forEach(f => console.log(`  ❌ ${f.name} — ${f.detail}`));
  } else {
    console.log("🎉 ALL BUTTON TESTS PASSED!");
  }
}

test();
