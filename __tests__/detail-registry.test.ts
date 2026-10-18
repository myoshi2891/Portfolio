import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { featuredProjects, portfolio } from "../lib/portfolio";

describe("detail page registry", () => {
  it("registers every featured project with the sections and page class it renders", () => {
    // Arrange
    const slugs = featuredProjects.map(p => p.slug).sort();
    // Act
    const entries = Object.entries(portfolio.documentation);
    // Assert
    expect(entries.map(([slug]) => slug).sort()).toEqual(slugs);
    for (const [slug, document] of entries) {
      expect(document.sections[0].id, slug).toBe("overview");
      expect(document.pageClassName.trim(), slug).not.toBe("");
    }
    expect(portfolio.documentation["multi-vendor-e-commerce"]?.sections.map(s => s.id)).toContain("orders");
    expect(portfolio.documentation["medical-studies"]?.sections.map(s => s.id)).not.toContain("orders");
  });

  it("selects detail content from the registry instead of slug comparisons", () => {
    const page = readFileSync("app/projects/[slug]/page.tsx", "utf8");
    expect(page).not.toMatch(/slug === "/);
  });

  it("removes the legacy claim-and-evidence detail model and slug-only wrappers", () => {
    for (const path of [
      "data/project-details.ts", "data/limitations.ts", "data/feature-guides.ts",
      "components/projects/feature-story.tsx", "components/projects/llm-studies-detail.tsx",
      "components/projects/medical-studies-detail.tsx", "components/projects/wild-oasis-detail.tsx",
    ]) expect(existsSync(path), path).toBe(false);
  });
});
