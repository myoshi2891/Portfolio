import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteLink } from "../components/ui/site-link";

describe("shared link navigation", () => {
  it("opens website links in a new tab even if the caller requests the current tab", () => {
    for (const href of ["https://github.com/myoshi2891", "http://example.com", "//example.com"]) {
      const html = renderToStaticMarkup(<SiteLink href={href} target="_self" rel="author">Visit</SiteLink>);
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="author noopener noreferrer"');
    }
  });
  it("keeps routes, anchors and email actions in the current tab", () => {
    for (const href of ["/profile/", "/#studies", "#main", "mailto:hello@example.com"]) {
      const html = renderToStaticMarkup(<SiteLink href={href}>Visit</SiteLink>);
      expect(html).not.toContain('target="_blank"');
      expect(html).not.toContain("新しいタブ");
    }
  });
  it("announces in the accessible name that a website link opens a new tab", () => {
    // Arrange & Act
    const plain = renderToStaticMarkup(<SiteLink href="https://github.com/myoshi2891">GitHub</SiteLink>);
    const labelled = renderToStaticMarkup(<SiteLink href="https://github.com/myoshi2891" aria-label="R01 GitHub">GitHub</SiteLink>);
    // Assert: 視覚的に隠した説明を付け、aria-labelがある場合はその末尾にも付ける
    expect(plain).toContain('GitHub<span class="visually-hidden">（新しいタブで開きます）</span></a>');
    expect(labelled).toContain('aria-label="R01 GitHub（新しいタブで開きます）"');
  });
});
