import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium, type Browser } from "@playwright/test";
import lighthouse from "lighthouse";
import { budgetFailures, medianMetrics, type BudgetAssertion } from "../lib/lighthouse-budget";

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

// detached starts a new process group: killing only the shell would leave `bun run preview` holding stdout open.
const server = spawn(collect.startServerCommand, { shell: true, detached: true, stdio: ["ignore", "pipe", "inherit"] });
const stopServer = () => {
  if (server.pid === undefined) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch (error) {
    // ESRCH: the group has already exited.
    if (!(error instanceof Error && "code" in error && error.code === "ESRCH")) throw error;
  }
};
let browser: Browser | undefined;
const failures: string[] = [];
try {
  await new Promise<void>((resolve, reject) => {
    server.stdout.on("data", (chunk: Buffer) => { if (chunk.toString().includes(collect.startServerReadyPattern)) resolve(); });
    server.on("error", reject);
    server.on("exit", code => reject(new Error(`Preview server exited before it was ready (${code})`)));
  });
  browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
  await mkdir(upload.outputDir, { recursive: true });
  for (const url of collect.url) {
    const runs = [];
    const name = new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
    for (let i = 0; i < collect.numberOfRuns; i++) {
      const result = await lighthouse(url, { port, output: "html", logLevel: "error", skipAudits: collect.settings.skipAudits });
      if (!result) throw new Error(`Lighthouse returned no result: ${url}`);
      // Budgets use per-metric medians, so no single run represents the result; keep every report.
      await writeFile(`${upload.outputDir}/${name}-${i + 1}.html`, String(result.report));
      runs.push(result.lhr);
    }
    const run = medianMetrics(runs);
    const scores = Object.entries(run.categories).map(([key, category]) => `${key} ${Math.round((category?.score ?? 0) * 100)}`).join(", ");
    const metrics = ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "total-byte-weight"].map(id => `${id} ${run.audits[id]?.numericValue?.toFixed(id === "cumulative-layout-shift" ? 3 : 0)}`).join(", ");
    console.log(`${new URL(url).pathname} (median of ${runs.length})\n  ${scores}\n  ${metrics}`);
    failures.push(...budgetFailures(run, assert.assertions).map(failure => `${new URL(url).pathname}: ${failure}`));
  }
} finally {
  await browser?.close();
  stopServer();
}
if (failures.length) {
  console.error(`Budget exceeded:\n${failures.join("\n")}`);
  process.exit(1);
}
