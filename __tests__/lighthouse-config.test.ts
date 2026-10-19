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

  it("runs after the static build in CI", () => {
    const steps = readFileSync(".github/workflows/ci.yml", "utf8").match(/^\s+run: .+$/gm)?.map(line => line.replace(/^\s+run: /, "")) ?? [];
    expect(steps.indexOf("bun run lighthouse")).toBeGreaterThan(steps.indexOf("bun run build"));
  });
});
