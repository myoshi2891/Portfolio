import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// This typographic site card represents the portfolio, not an application screenshot.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F7F2"/>
  <rect x="64" y="68" width="12" height="12" rx="6" fill="#2457C5"/>
  <g font-family="sans-serif" fill="#191C20">
    <text x="94" y="84" font-size="24" letter-spacing="3">ENGINEERING PORTFOLIO</text>
    <text x="64" y="282" font-size="96" font-weight="600">myoshi2891</text>
    <text x="68" y="352" font-size="32" fill="#555B64">Learn → Build → Engineer → Improve</text>
    <path d="M64 466H1136" stroke="#D9DCD6"/>
    <text x="68" y="531" font-size="24">Products · Architecture · AI / LLM · Healthcare</text>
    <text x="68" y="578" font-size="22" fill="#2457C5">github.com/myoshi2891</text>
  </g>
</svg>`;
await mkdir("public/og", { recursive: true });
await sharp(Buffer.from(svg)).png().toFile("public/og/portfolio.png");
