import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { portfolio } from "../lib/portfolio";
import { site } from "../data/site";
import { domains } from "../data/domains";
import { validateHomeContent } from "../lib/validate-home-content";

describe("Home editorial references", () => {
  it("validates cross-repository hero claims, domain anchors and philosophy links", () => {
    expect(validateHomeContent(portfolio, site, domains)).toEqual([]);
  });
  it("rejects missing hero evidence and links to absent anchors or details", () => {
    const home = { ...site, heroEvidenceIds: ["missing"], philosophy: [{ href: "/projects/next-store/#quality" }, { href: "/projects/comparison-of-llms/#scope" }, { href: "/#missing" }] };
    const errors = validateHomeContent(portfolio, home, [{ links: [{ anchor: "study-r99" }] }]).join(" ");
    expect(errors).toContain("hero evidence");
    expect(errors).toContain("study-r99");
    for (const { href } of home.philosophy) expect(errors).toContain(href);
  });
  it("keeps every published repository source tied to its original audit row", () => {
    const audit = readFileSync("docs/phase-0-repository-evidence-audit.md", "utf8");
    for (const source of Object.values(portfolio.evidence)) {
      if (source.sourceType !== "REPOSITORY_VERIFIED") continue;
      const row = audit.split("\n").find(line => line.includes(`**${source.auditId}**`));
      expect(row, source.auditId).toBeDefined();
      for (const link of source.sources) expect(row, source.auditId).toContain(link.url);
    }
  });
});
