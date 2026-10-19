import { readFileSync } from "node:fs";
import sharp from "sharp";
import { expect, it } from "vitest";

it("draws the OG card with the current light tokens, logo and bundled Inter", async () => {
  // Arrange
  const script = readFileSync("scripts/generate-og.ts", "utf8");
  const { data, info } = await sharp("public/og/portfolio.png").removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixel = (x: number, y: number) => [...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3)];
  // Act & Assert: 背景は現行の--color-canvas（#f7f8fa）
  expect(pixel(8, 8)).toEqual([0xf7, 0xf8, 0xfa]);
  for (const token of ["#f7f8fa", "#20242c", "#234bdb", "#606873", "#dce0e6"]) expect(script).toContain(token);
  for (const stale of ["#F7F7F2", "#2457C5", "#191C20", "sans-serif"]) expect(script).not.toContain(stale);
  expect(script).toContain("assets/fonts/inter-latin-600-normal.woff2");
  expect(script).toContain("public/images/optimized/myoshi-logo-720.webp");
});
