import { describe, expect, it } from "vitest";
import { portfolio } from "../lib/portfolio";
import { validateContent } from "../lib/validate-content";
import { homeAnchor, projectPath } from "../lib/routes";

describe("curated portfolio", () => {
  it("accounts for all 13 repositories in the approved order", () => {
    expect(portfolio.projects.filter(p => p.type === "featured").map(p => p.id)).toEqual(["R01", "R06", "R12", "R02"]);
    expect(portfolio.studies.map(p => p.id)).toEqual(["R08", "R07", "R11", "R10", "R13", "R09"]);
    expect(portfolio.projects.filter(p => p.type === "secondary").map(p => p.id)).toEqual(["R04", "R03", "R05"]);
    expect(validateContent(portfolio)).toEqual([]);
  });

  it("rejects duplicate repositories, bad order and missing details", () => {
    const copy = structuredClone(portfolio);
    copy.projects.push(copy.projects[0]!);
    copy.studies[0]!.order = 9;
    delete copy.details["medical-studies"];
    expect(validateContent(copy).join(" ")).toMatch(/duplicate/);
    expect(validateContent(copy).join(" ")).toMatch(/order/);
    expect(validateContent(copy).join(" ")).toMatch(/detail/);
  });

  it("rejects empty claims, missing evidence and evidence from another repository", () => {
    const copy = structuredClone(portfolio);
    copy.projects[0]!.description = { text: "", evidenceIds: ["missing"] };
    expect(validateContent(copy).join(" ")).toMatch(/empty/);
    expect(validateContent(copy).join(" ")).toMatch(/evidence/);
    copy.projects[0]!.description = { text: "incorrect attribution", evidenceIds: ["R02-A01"] };
    expect(validateContent(copy).join(" ")).toMatch(/repo mismatch/);
  });

  it("rejects forged source URLs, dates, SHAs and unprovided scope", () => {
    const copy = structuredClone(portfolio);
    copy.projects[0]!.githubUrl = "https://github.com/someone/other";
    const evidence = copy.evidence["R01-A01"]!;
    if (evidence.sourceType !== "REPOSITORY_VERIFIED") throw new Error("fixture");
    evidence.commit = "main";
    evidence.checkedAt = "2026-02-31";
    evidence.sources[0]!.url = "https://example.com/code";
    copy.details["multi-vendor-e-commerce"]!.scope = [{ text: "All work", evidenceIds: ["R01-A01"] }];
    const errors = validateContent(copy).join(" ");
    for (const word of ["github", "SHA", "date", "source", "scope"]) expect(errors).toContain(word);
  });

  it("keeps routes and Home anchors stable", () => {
    expect(projectPath("comparison-of-llms", "quality")).toBe("/projects/comparison-of-llms/#quality");
    expect(homeAnchor(portfolio.studies[3]!)).toBe("study-r10");
    expect(homeAnchor(portfolio.projects[0]!)).toBe("work-r01");
  });
});
