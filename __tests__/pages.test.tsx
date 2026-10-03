import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";
import Detail, { generateStaticParams } from "../app/projects/[slug]/page";
import { readFileSync } from "node:fs";

describe("server-rendered pages", () => {
  it("provides all work and studies in initial HTML, including closed disclosures", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain("学びを、仕組みにする。");
    for (const id of ["selected-work", "domains", "studies", "more-work", "philosophy", "contact", "study-r10"]) expect(html).toContain(`id="${id}"`);
    expect(html.match(/data-repository=/g)).toHaveLength(13);
    expect(html).toContain("すべての学習を見る（残り3件）");
    expect(html).not.toMatch(/mailto:|Live Demo|Production-ready/);
  });
  it("renders the four documented projects without GitHub links or stale diagrams", async () => {
    const routes = generateStaticParams();
    expect(routes.map(r => r.slug)).toEqual(["multi-vendor-e-commerce", "comparison-of-llms", "medical-studies", "the-wild-oasis-for-admin"]);
    for (const params of routes) {
      const html = renderToStaticMarkup(await Detail({ params: Promise.resolve(params) }));
      for (const id of ["overview", "features", "architecture", "decisions", "quality"]) expect(html).toContain(`id="${id}"`);
      expect(html).not.toMatch(/href="[^"]*github\.com/);
      expect(html).not.toContain('参照コード');
      expect(html).toContain('id="documentation"');
      expect(html).toContain('2026年9月18日');
      expect(html).toContain("<table");
      expect(html).not.toContain('id="scope"');
      const diagrams = [...html.matchAll(/src="(\/images\/[^" ]+\/diagram-[a-f0-9]+\.svg)"/g)];
      expect(diagrams).toHaveLength(3);
      for (const diagram of diagrams) {
        const svg = readFileSync(`public${diagram[1]}`, 'utf8');
        const sizes = [...svg.matchAll(/font-size\s*:\s*([^;}"<]+)/g)].map(match => match[1]);
        expect(new Set(sizes)).toEqual(new Set(['1rem']));
      }
    }
  });
});
