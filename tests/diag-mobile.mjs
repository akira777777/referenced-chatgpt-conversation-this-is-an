import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
page.on("pageerror", err => console.error("PAGE ERROR:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const btns = [...document.querySelectorAll(".menu-button")];
  return btns.map(b => {
    const r = b.getBoundingClientRect();
    const cs = getComputedStyle(b);
    return {
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      display: cs.display,
      visibility: cs.visibility,
      pointerEvents: cs.pointerEvents,
      inViewport: r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth,
    };
  });
});
console.log("menu-button elements:", JSON.stringify(info, null, 2));

const headerInfo = await page.evaluate(() => {
  const h = document.querySelector(".header");
  if (!h) return null;
  const r = h.getBoundingClientRect();
  const cs = getComputedStyle(h);
  return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, position: cs.position, transform: cs.transform, zIndex: cs.zIndex };
});
console.log("header:", JSON.stringify(headerInfo, null, 2));

// What element is at the menu button's center point?
if (info.length) {
  const { rect } = info[0];
  const top = await page.evaluate(([x, y]) => {
    const el = document.elementFromPoint(x, y);
    return el ? `${el.tagName}.${el.className}` : "none";
  }, [rect.x + rect.w / 2, rect.y + rect.h / 2]);
  console.log("element at menu-button center:", top);
}

// Try clicking and check if menu opens
try {
  await page.locator(".menu-button").first().click({ timeout: 5000 });
  await page.waitForTimeout(400);
  const navVisible = await page.locator(".mobile-nav").isVisible().catch(() => false);
  console.log("click OK, mobile-nav visible:", navVisible);
} catch (e) {
  console.log("click FAILED:", e.message.split("\n")[0]);
}

await browser.close();
