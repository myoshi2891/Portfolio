import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { projectDocumentation } from "../data/project-documentation";

const documents = [
  { slug: "multi-vendor-e-commerce", contentPath: "data/multi-vendor-detail.md", imageDirectory: "multi-vendor-e-commerce" },
  ...Object.entries(projectDocumentation).map(([slug, document]) => ({ slug, ...document })),
];
const requested = process.argv.slice(2);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent('<html lang="ja"><body></body></html>');
  await page.addScriptTag({ path: resolve("node_modules/mermaid/dist/mermaid.js") });
  for (const document of documents.filter(document => !requested.length || requested.includes(document.slug))) {
    const markdown = await readFile(document.contentPath, "utf8");
    const sources = [...markdown.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(match => match[1]!.trim());
    const directory = `public/images/${document.imageDirectory}`;
    await mkdir(directory, { recursive: true });
    for (const source of sources) {
      const id = `diagram-${createHash("sha256").update(source).digest("hex").slice(0, 12)}`;
      const svg = await page.evaluate(async ({ source, id }) => {
        const mermaid = (window as unknown as { mermaid: typeof import("mermaid").default }).mermaid;
        mermaid.initialize({
          startOnLoad: false, securityLevel: "strict", theme: "neutral", fontFamily: "sans-serif",
          themeVariables: { fontSize: "1rem" },
          themeCSS: "text, tspan, .label, .messageText, .noteText { font-size: 1rem !important; }",
          flowchart: { htmlLabels: false },
          sequence: { useMaxWidth: true, actorFontSize: 16, messageFontSize: 16, noteFontSize: 16 },
        });
        // Normalize Mermaid's supplementary styles and inline font attributes as well.
        return (await mermaid.render(id, source)).svg
          .replace(/font-size\s*:\s*[^;}"<]+/g, "font-size:1rem")
          .replace(/font-size="[^"]+"/g, 'font-size="1rem"');
      }, { source, id });
      await writeFile(`${directory}/${id}.svg`, svg);
      console.log(`Mermaid: ${document.slug}/${id}.svg`);
    }
  }
} finally {
  await browser.close();
}
