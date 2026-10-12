import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { screens } from "../data/screens";

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

describe("published images", () => {
  const published = files("public/images");

  it("ships only compressed WebP captures and SVG diagrams", () => {
    expect(published.filter(path => !/\.(webp|svg)$/.test(path))).toEqual([]);
    for (const path of published) expect(statSync(path).size, path).toBeLessThan(200_000);
    expect(published.reduce((total, path) => total + statSync(path).size, 0)).toBeLessThan(6_000_000);
  });

  it("keeps every capture original outside the deployed directory as a generation source", () => {
    for (const screen of Object.values(screens)) expect(existsSync(join("assets/screens", screen.file)), screen.file).toBe(true);
    for (const path of files("assets/screens")) {
      expect(path).toMatch(/\.png$/);
      expect(published, path).toContain(path.replace(/^assets\/screens/, "public/images").replace(/\.png$/, ".webp"));
    }
  });
});
