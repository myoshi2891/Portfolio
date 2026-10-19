import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { budgetFailures, medianRun, type BudgetAssertion } from "../lib/lighthouse-budget";

// Runs Lighthouse against the static preview with the budgets in lighthouserc.json (a Lighthouse CI
// compatible subset). @lhci/cli is not used: its dependency tree carries unpatched advisories.
type Config = { ci: {
  collect: { url: string[]; startServerCommand: string; startServerReadyPattern: string; numberOfRuns: number; settings: { skipAudits: string[] } };
  assert: { assertions: Record<string, BudgetAssertion> };
  upload: { target: "filesystem"; outputDir: string };
} };
const parsed: unknown = JSON.parse(await readFile("lighthouserc.json", "utf8"));
if (typeof parsed !== "object" || parsed === null || !("ci" in parsed)) throw new Error("lighthouserc.json needs a ci section");
const { collect, assert, upload } = (parsed as Config).ci;
// Previews are noindex by design, so is-crawlable is skipped in lighthouserc.json.
const port = 9223;

const server = spawn(collect.startServerCommand, { shell: true, stdio: ["ignore", "pipe", "inherit"] });
await new Promise<void>((resolve, reject) => {
  server.stdout.on("data", (chunk: Buffer) => { if (chunk.toString().includes(collect.startServerReadyPattern)) resolve(); });
  server.on("exit", code => reject(new Error(`Preview server exited before it was ready (${code})`)));
});
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
const failures: string[] = [];
try {
  await mkdir(upload.outputDir, { recursive: true });
  for (const url of collect.url) {
    const runs = [];
    for (let i = 0; i < collect.numberOfRuns; i++) {
      const result = await lighthouse(url, { port, output: "html", logLevel: "error", skipAudits: collect.settings.skipAudits });
      if (!result) throw new Error(`Lighthouse returned no result: ${url}`);
      runs.push({ ...result.lhr, html: String(result.report) });
    }
    const run = medianRun(runs);
    const name = new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
    await writeFile(`${upload.outputDir}/${name}.html`, run.html);
    const scores = Object.entries(run.categories).map(([key, category]) => `${key} ${Math.round((category?.score ?? 0) * 100)}`).join(", ");
    const metrics = ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "total-byte-weight"].map(id => `${id} ${run.audits[id]?.numericValue?.toFixed(id === "cumulative-layout-shift" ? 3 : 0)}`).join(", ");
    console.log(`${new URL(url).pathname}\n  ${scores}\n  ${metrics}`);
    failures.push(...budgetFailures(run, assert.assertions).map(failure => `${new URL(url).pathname}: ${failure}`));
  }
} finally {
  await browser.close();
  server.kill();
}
if (failures.length) {
  console.error(`Budget exceeded:\n${failures.join("\n")}`);
  process.exit(1);
}
