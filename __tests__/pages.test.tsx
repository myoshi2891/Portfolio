import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";
import Detail, { generateStaticParams } from "../app/projects/[slug]/page";

describe("server-rendered pages", () => {
  it("provides all work and studies in initial HTML, including closed disclosures", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain("学びを、仕組みにする。");
    for (const id of ["selected-work", "domains", "studies", "more-work", "philosophy", "contact", "study-r10"]) expect(html).toContain(`id="${id}"`);
    expect(html.match(/data-repository=/g)).toHaveLength(13);
    expect(html).toContain("すべての学習を見る（残り3件）");
    expect(html).not.toMatch(/mailto:|Live Demo|Production-ready/);
  });
  it("generates only the four Featured routes with evidence and no unsupported scope", async () => {
    const routes = generateStaticParams();
    expect(routes.map(r => r.slug)).toEqual(["multi-vendor-e-commerce", "comparison-of-llms", "medical-studies", "the-wild-oasis-for-admin"]);
    for (const params of routes) {
      const html = renderToStaticMarkup(await Detail({ params: Promise.resolve(params) }));
      for (const id of ["overview", "features", "architecture", "decisions", "quality", "evidence"]) expect(html).toContain(`id="${id}"`);
      expect(html).toMatch(/github\.com\/myoshi2891\/.+\/blob\/[a-f0-9]{40}\//);
      expect(html).toContain("2026-09-16");
      expect(html).not.toContain('id="scope"');
    }
  });
});
