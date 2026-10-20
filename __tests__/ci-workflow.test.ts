import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
// 各ステップを "- " から次の "- " までの塊として取り出す
const steps = workflow.split(/^\s{6}- /m).slice(1);
const stepIndex = (pattern: RegExp) => steps.findIndex(step => pattern.test(step));

describe("CI workflow", () => {
  it("runs push builds only for long-lived branches so PR branches are verified once", () => {
    // Arrange
    const push = workflow.match(/^ {2}push:\n((?: {4}.+\n)+)/m)?.[1] ?? "";

    // Act
    const branches = push.match(/branches: \[([^\]]+)\]/)?.[1]?.split(",").map(branch => branch.trim()) ?? [];

    // Assert
    expect(branches).toEqual(["main", "dev"]);
    expect(workflow).toMatch(/^ {2}pull_request:$/m);
  });

  it("restores the bun package cache keyed by the lockfile before installing", () => {
    // Arrange
    const cache = stepIndex(/uses: actions\/cache@[0-9a-f]{40} # v\d[\s\S]*path: ~\/\.bun\/install\/cache/);

    // Act
    const install = stepIndex(/run: bun install --frozen-lockfile/);

    // Assert
    expect(cache).toBeGreaterThanOrEqual(0);
    expect(cache).toBeLessThan(install);
    expect(steps[cache]).toContain("hashFiles('bun.lock')");
  });

  it("caches Playwright browsers per version and installs only system deps on a hit", () => {
    // Arrange
    const version = stepIndex(/id: playwright-version/);
    const cache = stepIndex(/uses: actions\/cache@[0-9a-f]{40} # v\d[\s\S]*path: ~\/\.cache\/ms-playwright/);

    // Act
    const install = stepIndex(/run: bunx playwright install --with-deps chromium firefox webkit/);
    const deps = stepIndex(/run: bunx playwright install-deps chromium firefox webkit/);

    // Assert
    expect(version).toBeGreaterThan(stepIndex(/run: bun install --frozen-lockfile/));
    expect(cache).toBeGreaterThan(version);
    expect(steps[cache]).toContain("steps.playwright-version.outputs.version");
    expect(steps[install]).toContain("if: steps.playwright-cache.outputs.cache-hit != 'true'");
    expect(steps[deps]).toContain("if: steps.playwright-cache.outputs.cache-hit == 'true'");
    expect(Math.min(install, deps)).toBeGreaterThan(cache);
    expect(Math.max(install, deps)).toBeLessThan(stepIndex(/run: bun run lighthouse/));
  });
});
