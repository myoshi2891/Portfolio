import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Detail from "../app/projects/[slug]/page";
import config from "../next.config";

function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sources(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

describe("next/image delivery", () => {
  it("disables optimization once in the config so static export cannot miss it", () => {
    expect(config.images?.unoptimized).toBe(true);
    for (const path of [...sources("app"), ...sources("components")]) {
      const images = readFileSync(path, "utf8").match(/<Image\b[^>]*>/g) ?? [];
      for (const image of images) {
        expect(image, path).not.toMatch(/\bunoptimized\b/);
        expect(image, path).not.toMatch(/\bpriority=/);
      }
    }
  });

  it("loads only the first gallery slide eagerly with high fetch priority", async () => {
    const html = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: "medical-studies" }) }));
    const slides = html.match(/<img[^>]*data-nimg="fill"[^>]*>/g) ?? [];
    const eager = slides.filter(image => image.includes('loading="eager"'));
    expect(eager).toHaveLength(1);
    expect(eager[0]).toContain('fetchPriority="high"');
    expect(eager[0]).toContain("prom-checker-dashboard.webp");
  });
});
