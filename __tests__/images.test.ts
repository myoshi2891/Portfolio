import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { screens } from "../data/screens";
import { captureOutput, staleCaptures } from "../lib/capture-images";

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

describe("published images", () => {
  // The supplied brand original is retained; displayed images use WebP derivatives.
  const published = files("public/images").filter(path => path !== "public/images/myoshi.jpeg");

  it("ships only compressed WebP captures and SVG diagrams", () => {
    expect(published.filter(path => !/\.(webp|svg)$/.test(path))).toEqual([]);
    for (const path of published) expect(statSync(path).size, path).toBeLessThan(200_000);
    expect(published.reduce((total, path) => total + statSync(path).size, 0)).toBeLessThan(6_000_000);
  });

  it("keeps every capture original outside the deployed directory as a generation source", () => {
    for (const screen of Object.values(screens)) expect(existsSync(join("assets/screens", screen.file)), screen.file).toBe(true);
    for (const path of files("assets/screens")) {
      expect(path).toMatch(/\.png$/);
      expect(published, path).toContain(captureOutput(path));
    }
  });

  it("leaves no capture WebP without a source PNG", () => {
    expect(staleCaptures(published, files("assets/screens"))).toEqual([]);
  });
});

describe("capture image cleanup", () => {
  it("flags only generated capture WebPs whose source PNG is gone", () => {
    const published = [
      "public/images/app/kept.webp",
      "public/images/app/removed.webp",
      "public/images/app/diagram-1.svg",
      "public/images/optimized/r01-640.webp",
    ];
    expect(captureOutput("assets/screens/app/kept.png")).toBe("public/images/app/kept.webp");
    expect(staleCaptures(published, ["assets/screens/app/kept.png"])).toEqual(["public/images/app/removed.webp"]);
  });
});
