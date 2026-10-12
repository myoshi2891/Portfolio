import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkdownDocumentContent } from "../components/content/markdown-document";
import { StudySummary } from "../components/studies/study-summary";
import { projectSummaries } from "../data/project-summaries";
import { projectDocumentation } from "../data/project-documentation";
import { portfolio } from "../lib/portfolio";
import { loadMarkdownDocument } from "../lib/markdown-document";
import { validateProjectSummaries } from "../lib/validate-project-summaries";

describe("project summary documents", () => {
  it("validates summary content and its supplied source", () => {
    expect(validateProjectSummaries(portfolio)).toEqual([]);
  });

  it("provides learning content, navigation, and usage guidance for every study", () => {
    for (const study of portfolio.studies) {
      const document = projectSummaries[study.id];
      expect(document, `Missing summary for ${study.id}`).toBeDefined();
      const html = renderToStaticMarkup(createElement(StudySummary, { document: document! }));
      for (const heading of ["学習内容", "資料の探し方", "活用方法"]) {
        expect(html).toContain(`<h4>${heading}</h4>`);
      }
      expect(html).toContain('<table class="reading-table">');
      expect(html).toContain('class="study-chapter study-chapter-application"');
    }
  });

  it("rejects missing content, missing evidence, and mismatched diagram descriptions", () => {
    const original = projectSummaries.R09!;
    expect(validateProjectSummaries(portfolio, { R09: { ...original, contentPath: "data/missing.md" } }).join()).toContain("missing.md");
    expect(validateProjectSummaries(portfolio, { R09: { ...original, evidenceIds: [] } }).join()).toContain("Missing summary evidence");
    expect(validateProjectSummaries(portfolio, { R09: { ...original, evidenceIds: ["R02-A01"] } }).join()).toContain("repo mismatch");
    expect(validateProjectSummaries(portfolio, { R09: { ...original, diagrams: ["Missing diagram"] } }).join()).toContain("Diagram descriptions");
  });

  it("loads the existing detail diagrams with their original descriptions and assets", () => {
    for (const document of Object.values(projectDocumentation)) {
      const loaded = loadMarkdownDocument(document);
      expect(loaded.diagrams.map(diagram => diagram.description)).toEqual(document.diagrams);
      expect(loaded.diagrams.every(diagram => diagram.width > 0)).toBe(true);
    }
  });

  it("renders the summary as a semantic table in server HTML", () => {
    const html = renderToStaticMarkup(createElement(MarkdownDocumentContent, { document: projectSummaries.R09! }));
    expect(html).toContain('<table class="reading-table">');
    expect(html).toContain('<th scope="col">機能</th>');
    expect(html).toContain("ガイドカタログ");
    expect(html).toContain("サイト内検索");
    expect(html).toContain("目次とMermaidの図解");
  });

  it("renders Mermaid as accessible static images rather than source code", () => {
    const document = projectDocumentation["comparison-of-llms"];
    const html = renderToStaticMarkup(createElement(MarkdownDocumentContent, { document }));
    for (const diagram of loadMarkdownDocument(document).diagrams) {
      expect(html).toContain(`src="${diagram.path}"`);
      expect(html).toContain(`alt="${diagram.description}"`);
    }
    expect(html).not.toContain('class="language-mermaid"');
  });
});
