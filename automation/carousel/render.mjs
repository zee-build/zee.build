// Usage: node render.mjs <deck.json> <outDir>  ->  01.jpg ... thumb.jpg, contact.jpg, report.json
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const [deckPath, outDir] = process.argv.slice(2);
const deck = JSON.parse(await readFile(deckPath, "utf8"));
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(here, "template.html")).href, { waitUntil: "networkidle" });
await page.evaluate((d) => window.renderDeck(d), deck);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");

// A slide fails the check when its copy no longer fits, or an image didn't load
const problems = await page.$$eval(".slide", (slides) => slides.flatMap((s, i) => {
  const out = [];
  const foot = s.querySelector(".foot").getBoundingClientRect();
  const edge = s.getBoundingClientRect().right - 20;
  const main = s.querySelector(".main");
  for (const el of main.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.height && r.bottom > foot.top + 2) { out.push(`slide ${i + 1}: text runs into the footer`); break; }
    if (r.width && r.right > edge) { out.push(`slide ${i + 1}: text runs off the side`); break; }
  }
  for (const img of s.querySelectorAll("img")) if (!img.naturalWidth) out.push(`slide ${i + 1}: image failed to load`);
  return out;
}));

const slides = await page.$$(".slide");
for (const [i, el] of slides.entries()) {
  const name = String(i + 1).padStart(2, "0");
  await el.screenshot({ path: resolve(outDir, `${name}.jpg`), type: "jpeg", quality: 90 });
  if (i === 0) await el.screenshot({ path: resolve(outDir, "thumb.jpg"), type: "jpeg", quality: 80 });
}
const cols = 3;
await page.setViewportSize({ width: 1080 * cols + 20 * (cols + 1), height: 1350 * Math.ceil(slides.length / cols) + 40 });
await page.addStyleTag({ content: `#deck{display:grid;grid-template-columns:repeat(${cols},1080px);gap:20px;padding:20px}` });
await page.screenshot({ path: resolve(outDir, "contact.jpg"), type: "jpeg", quality: 70, fullPage: true });
await browser.close();
await writeFile(resolve(outDir, "report.json"), JSON.stringify({ slides: slides.length, problems }));
console.log(`Rendered ${slides.length} slides, ${problems.length} problems`);
