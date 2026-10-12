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
      expect(renderToStaticMarkup(<SiteLink href={href}>Visit</SiteLink>)).not.toContain('target="_blank"');
    }
  });
});
