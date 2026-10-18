import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("dependency maintenance", () => {
  it("audits installed packages in CI before running the checks", () => {
    const steps = readFileSync(".github/workflows/ci.yml", "utf8").match(/^\s+run: .+$/gm)?.map(line => line.replace(/^\s+run: /, "")) ?? [];
    const audit = steps.findIndex(step => step.startsWith("bun audit"));
    expect(audit).toBeGreaterThan(steps.indexOf("bun install --frozen-lockfile"));
    expect(audit).toBeLessThan(steps.indexOf("bun run typecheck"));
  });

  it("fails CI when the build regenerates tracked files differently", () => {
    const steps = readFileSync(".github/workflows/ci.yml", "utf8").match(/^\s+run: .+$/gm)?.map(line => line.replace(/^\s+run: /, "")) ?? [];
    const check = steps.findIndex(step => step.startsWith("git diff --exit-code"));
    expect(check).toBeGreaterThan(steps.indexOf("bun run build"));
    expect(steps[check]).toContain("git status --porcelain");
  });

  it("schedules weekly updates for bun packages and pinned actions", () => {
    expect(existsSync(".github/dependabot.yml")).toBe(true);
    const config = readFileSync(".github/dependabot.yml", "utf8");
    for (const ecosystem of ["bun", "github-actions"]) {
      expect(config).toMatch(new RegExp(`package-ecosystem: "${ecosystem}"[\\s\\S]*?interval: "weekly"`));
    }
    expect(config).toMatch(/groups:[\s\S]*"next"[\s\S]*"react"/);
  });
});
