import { chromium } from "playwright";

async function test() {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForSelector(".brand-logo", { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Get bounding boxes
    const logo = page.locator(".brand-logo").first();
    const themeBtn = page.locator("button[title='Toggle theme']").first();
    const searchBtn = page.locator("button[title='Search devices']").first();
    const navActions = page.locator(".nav-actions").first();
    const nav = page.locator(".nav").first();

    const logoBox = await logo.boundingBox();
    const themeBox = await themeBtn.boundingBox();
    const searchBox = await searchBtn.boundingBox();
    const navActionsBox = await navActions.boundingBox();
    const navBox = await nav.boundingBox();

    console.log("=== Bounding Boxes ===");
    console.log("Nav container:", JSON.stringify(navBox));
    console.log("Logo:", JSON.stringify(logoBox));
    console.log("Nav-actions:", JSON.stringify(navActionsBox));
    console.log("Search button:", JSON.stringify(searchBox));
    console.log("Theme button:", JSON.stringify(themeBox));

    if (logoBox && themeBox) {
      const overlap = !(logoBox.x + logoBox.width < themeBox.x || 
                        themeBox.x + themeBox.width < logoBox.x ||
                        logoBox.y + logoBox.height < themeBox.y ||
                        themeBox.y + themeBox.height < logoBox.y);
      console.log("\nLogo overlaps theme button:", overlap);
      console.log("Logo right edge:", logoBox.x + logoBox.width);
      console.log("Theme button left edge:", themeBox.x);
    }

    // Check computed styles
    const logoStyles = await logo.evaluate(el => {
      const cs = getComputedStyle(el);
      return { zIndex: cs.zIndex, position: cs.position, width: cs.width, display: cs.display };
    });
    const navActionsStyles = await navActions.evaluate(el => {
      const cs = getComputedStyle(el);
      return { zIndex: cs.zIndex, position: cs.position };
    });
    console.log("\nLogo computed styles:", JSON.stringify(logoStyles));
    console.log("Nav-actions computed styles:", JSON.stringify(navActionsStyles));

    // Take screenshot
    await page.screenshot({ path: "/tmp/header-debug.png", clip: { x: 0, y: 0, width: 1280, height: 100 } });
    console.log("\nScreenshot saved to /tmp/header-debug.png");

    // Check what element is at the theme button's center point
    if (themeBox) {
      const centerX = themeBox.x + themeBox.width / 2;
      const centerY = themeBox.y + themeBox.height / 2;
      const elementAtPoint = await page.evaluate(({x, y}) => {
        const el = document.elementFromPoint(x, y);
        return el ? { tag: el.tagName, class: el.className, href: el.href || null } : null;
      }, { x: centerX, y: centerY });
      console.log(`\nElement at theme button center (${centerX}, ${centerY}):`, JSON.stringify(elementAtPoint));
    }

  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await browser.close();
  }
}

test();
