import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const outDir = "/home/akira/.gemini/antigravity-ide/brain/84adf135-4065-433d-8e43-8f6a10b71b7f/scratch";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const routes = [
    { name: "home", url: "http://localhost:3000/" },
    { name: "prices", url: "http://localhost:3000/prices" },
    { name: "repair", url: "http://localhost:3000/repair" },
    { name: "about", url: "http://localhost:3000/about" },
    { name: "business", url: "http://localhost:3000/business" },
    { name: "contact", url: "http://localhost:3000/contact" },
    { name: "faq", url: "http://localhost:3000/faq" },
    { name: "track", url: "http://localhost:3000/track" },
  ];

  for (const r of routes) {
    try {
      await page.goto(r.url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, `${r.name}-desktop.png`), fullPage: true });
      console.log(`Saved screenshot for ${r.name} desktop`);
    } catch (e) {
      console.error(`Failed on ${r.name}:`, e.message);
    }
  }

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  for (const r of routes) {
    try {
      await page.goto(r.url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, `${r.name}-mobile.png`), fullPage: true });
      console.log(`Saved screenshot for ${r.name} mobile`);
    } catch (e) {
      console.error(`Failed on ${r.name} mobile:`, e.message);
    }
  }

  await browser.close();
}

run().catch(console.error);
