import { describe, expect, it } from "vitest";
import config from "../playwright.config";

const smokeSpec = "e2e/mobile-device.spec.ts";
const matches = (pattern: unknown, file: string) => pattern instanceof RegExp && pattern.test(file);

describe("Playwright projects", () => {
  it("runs the mobile smoke spec on one touch device with a high pixel ratio", () => {
    // Arrange
    const projects = config.projects ?? [];

    // Act
    const mobile = projects.filter(project => project.use?.hasTouch);

    // Assert
    expect(mobile).toHaveLength(1);
    expect(mobile[0]?.use?.isMobile).toBe(true);
    expect(mobile[0]?.use?.deviceScaleFactor).toBeGreaterThan(1);
    expect(matches(mobile[0]?.testMatch, smokeSpec)).toBe(true);
    expect(matches(mobile[0]?.testMatch, "e2e/spa.spec.ts")).toBe(false);
  });

  it("keeps the desktop browsers off the touch-only smoke spec", () => {
    // Arrange
    const desktop = (config.projects ?? []).filter(project => !project.use?.hasTouch);

    // Act
    const names = desktop.map(project => project.name);

    // Assert
    expect(names).toEqual(["chromium", "firefox", "webkit"]);
    for (const project of desktop) expect(matches(project.testIgnore, smokeSpec), project.name).toBe(true);
  });
});
