import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// 読み込み回数を数えるため、実装はそのままに readFileSync だけを監視する
vi.mock("node:fs", async importOriginal => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, readFileSync: vi.fn(actual.readFileSync) };
});

const { readFileSync } = await import("node:fs");
const { StudySummary } = await import("../components/studies/study-summary");
const { DocumentedProjectDetail } = await import("../components/projects/documented-project-detail");
const { MarkdownDocumentContent } = await import("../components/content/markdown-document");
const { loadMarkdownDocument } = await import("../lib/markdown-document");
const { projectSummaries } = await import("../data/project-summaries");
const { projectDocumentation } = await import("../data/project-documentation");

const readCount = () => vi.mocked(readFileSync).mock.calls.length;

describe("markdown document loading", () => {
  beforeEach(() => {
    vi.mocked(readFileSync).mockClear();
  });

  it("reads a study summary and its diagrams only once while rendering every chapter", () => {
    // Arrange
    const document = projectSummaries.R09;
    if (!document) throw new Error("Missing R09 summary");

    // Act
    renderToStaticMarkup(createElement(StudySummary, { document }));

    // Assert
    expect(readCount()).toBe(1 + document.diagrams.length);
  });

  it("reads a project document and its diagrams only once while rendering every section", () => {
    // Arrange
    const slug = "comparison-of-llms";
    const document = projectDocumentation[slug];

    // Act
    renderToStaticMarkup(createElement(DocumentedProjectDetail, { slug }));

    // Assert
    expect(document.diagrams.length).toBeGreaterThan(0);
    expect(readCount()).toBe(1 + document.diagrams.length);
  });

  it("renders from a supplied loaded document without touching the file system", () => {
    // Arrange
    const document = projectDocumentation["comparison-of-llms"];
    const loaded = loadMarkdownDocument(document);
    vi.mocked(readFileSync).mockClear();

    // Act
    const html = renderToStaticMarkup(createElement(MarkdownDocumentContent, { document, loaded }));

    // Assert
    expect(readCount()).toBe(0);
    expect(html).toContain(`src="${loaded.diagrams[0]?.path}"`);
  });
});
