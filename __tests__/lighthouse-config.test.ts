import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Assertion = [string, { minScore?: number; maxNumericValue?: number }];
const parse = (): { ci: { collect: { url: string[]; startServerCommand: string; numberOfRuns: number }; assert: { assertions: Record<string, Assertion> }; upload: { target: string } } } =>
  JSON.parse(readFileSync("lighthouserc.json", "utf8"));

describe("Lighthouse CI budgets", () => {
  it("measures Home, Profile and the heaviest detail against the local static preview", () => {
    const { collect } = parse().ci;
    expect(collect.startServerCommand).toBe("bun run preview");
    expect(collect.url.map(url => new URL(url).pathname)).toEqual(["/", "/profile/", "/projects/multi-vendor-e-commerce/"]);
    expect(collect.numberOfRuns).toBeGreaterThanOrEqual(3);
  });

  it("enforces scores and transfer budgets without uploading results to a third party", () => {
    const { assert, upload } = parse().ci;
    for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
      expect(assert.assertions[`categories:${category}`]?.[0], category).toBe("error");
    }
    for (const metric of ["largest-contentful-paint", "cumulative-layout-shift", "total-byte-weight"]) {
      expect(assert.assertions[metric]?.[1].maxNumericValue, metric).toBeGreaterThan(0);
    }
    expect(upload.target).toBe("filesystem");
  });

  it("caps the transfer size near the subset-font baseline so a font regression fails", () => {
    // B1 の後は最大 1.51MB（Multi Vendor）。旧スライス方式の 2.24MB に戻ると失敗する
    expect(parse().ci.assert.assertions["total-byte-weight"]?.[1].maxNumericValue).toBeLessThanOrEqual(2_000_000);
  });

  it("runs after the static build in CI", () => {
    const steps = readFileSync(".github/workflows/ci.yml", "utf8").match(/^\s+run: .+$/gm)?.map(line => line.replace(/^\s+run: /, "")) ?? [];
    expect(steps.indexOf("bun run lighthouse")).toBeGreaterThan(steps.indexOf("bun run build"));
  });
});

describe("Lighthouse budget evaluation", () => {
  const run = (performance: number, lcp: number) => ({
    categories: { performance: { score: performance }, seo: { score: 1 } },
    audits: { "largest-contentful-paint": { numericValue: lcp } },
  });

  it("asserts each score and metric on its own median across runs", async () => {
    // Arrange: 性能スコアの中央値の回（.9）とLCPの中央値（2）は別の回にある
    const { medianMetrics } = await import("../lib/lighthouse-budget");
    // Act & Assert
    expect(medianMetrics([run(.7, 1), run(.95, 2), run(.9, 3)])).toEqual(run(.9, 2));
    expect(() => medianMetrics([])).toThrow("No Lighthouse runs to evaluate");
  });

  it("reports every score and metric outside its budget", async () => {
    const { budgetFailures } = await import("../lib/lighthouse-budget");
    const assertions: Record<string, Assertion> = {
      "categories:performance": ["error", { minScore: .9 }],
      "categories:seo": ["error", { minScore: 1 }],
      "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
    };
    expect(budgetFailures(run(.92, 2400), assertions)).toEqual([]);
    expect(budgetFailures(run(.8, 3100), assertions)).toEqual([
      "categories:performance 0.8 < 0.9",
      "largest-contentful-paint 3100 > 2500",
    ]);
    expect(budgetFailures(run(.92, 2400), { "missing-audit": ["error", { maxNumericValue: 1 }] })).toEqual(["missing-audit: no result"]);
  });
});
