import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const render = async () => {
  const { DocumentedProjectDetail } = await import("../components/projects/documented-project-detail");
  return renderToStaticMarkup(createElement(DocumentedProjectDetail, { slug: "multi-vendor-e-commerce" }));
};

describe("multi-vendor detail structure", () => {
  afterEach(() => { vi.doUnmock("node:fs"); vi.resetModules(); });

  it("rejects documentation whose sections or diagrams do not match the navigation", async () => {
    // Arrange: 見出し1つ・図0件の不整合なMarkdown
    vi.doMock("node:fs", async importOriginal => ({
      ...await importOriginal<typeof import("node:fs")>(),
      readFileSync: () => "## 概要\n本文のみ\n",
    }));
    // Act & Assert
    await expect(render()).rejects.toThrow(/multi-vendor/);
  });

  it("renders the committed documentation with the shared renderer", async () => {
    const html = await render();
    expect(html).toContain('id="orders"');
    expect(html.match(/class="detail-mermaid"/g)).toHaveLength(3);
  });
});
