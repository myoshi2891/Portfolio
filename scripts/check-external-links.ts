import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { checkLink, extractExternalLinks, linkReport } from "../lib/external-links";
import { readSiteConfig } from "../lib/site-config";

// Checks the external links visitors can follow in the static output. Usage: bun scripts/check-external-links.ts [report.md]
const pages = (await readdir("out", { recursive: true, encoding: "utf8" })).filter(path => path.endsWith(".html"));
if (!pages.length) throw new Error("out/ has no HTML. Run bun run build first.");
const links = extractExternalLinks(await Promise.all(pages.map(path => readFile(join("out", path), "utf8"))), readSiteConfig().siteUrl);
const results = await Promise.all(links.map(url => checkLink(url)));
const report = linkReport(results);
console.log(report);
const output = process.argv[2];
if (output) await writeFile(output, report + "\n");
if (results.some(result => result.state === "broken")) process.exit(1);
