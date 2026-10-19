import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

// This typographic site card represents the portfolio, not an application screenshot.
// Chromium renders it with the bundled Inter and logo so the output does not depend on system fonts.
const dataUrl = async (path: string, type: string) => `data:${type};base64,${(await readFile(path)).toString("base64")}`;
const [inter400, inter600, logo] = await Promise.all([
  dataUrl("assets/fonts/inter-latin-400-normal.woff2", "font/woff2"),
  dataUrl("assets/fonts/inter-latin-600-normal.woff2", "font/woff2"),
  dataUrl("public/images/optimized/myoshi-logo-720.webp", "image/webp"),
]);

// Colors are the light theme tokens in app/globals.css.
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; font-weight: 400; src: url(${inter400}) format("woff2"); }
@font-face { font-family: Inter; font-weight: 600; src: url(${inter600}) format("woff2"); }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; padding: 68px 64px 52px; display: grid; grid-template-columns: 1fr 300px; grid-template-rows: 1fr auto; column-gap: 48px;
  background: #f7f8fa; color: #20242c; font-family: Inter; }
.eyebrow { display: flex; align-items: center; gap: 18px; font-size: 24px; letter-spacing: .14em; }
.eyebrow::before { content: ""; width: 12px; height: 12px; border-radius: 50%; background: #234bdb; }
h1 { margin-top: 112px; font-size: 96px; font-weight: 600; letter-spacing: -.02em; line-height: 1; }
.cycle { margin-top: 28px; color: #606873; font-size: 32px; }
img { align-self: center; width: 300px; height: 300px; border-radius: 40px; }
footer { grid-column: 1 / -1; display: flex; justify-content: space-between; padding-top: 36px; border-top: 1px solid #dce0e6; font-size: 24px; }
footer span:last-child { color: #234bdb; }
</style></head><body>
<div><p class="eyebrow">ENGINEERING PORTFOLIO</p><h1>myoshi2891</h1><p class="cycle">Learn → Build → Engineer → Improve</p></div>
<img src="${logo}" alt="">
<footer><span>Products · Architecture · AI / LLM · Healthcare</span><span>github.com/myoshi2891</span></footer>
</body></html>`;

await mkdir("public/og", { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/og/portfolio.png" });
} finally {
  await browser.close();
}
