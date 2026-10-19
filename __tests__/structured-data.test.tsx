import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";
import Profile from "../app/profile/page";
import Detail from "../app/projects/[slug]/page";

afterEach(() => vi.unstubAllEnvs());

const jsonLd = (html: string): unknown[] => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json = ""]) => JSON.parse(json));
const detail = async (slug: string) => renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug }) }));
const production = () => { vi.stubEnv("SITE_URL", "https://example.com"); vi.stubEnv("DEPLOYMENT_ENV", "production"); };

describe("structured data", () => {
  it("omits JSON-LD when no site URL is known", async () => {
    // Arrange
    vi.stubEnv("SITE_URL", ""); vi.stubEnv("DEPLOYMENT_ENV", "preview");
    // Act & Assert
    for (const html of [renderToStaticMarkup(<Home />), renderToStaticMarkup(<Profile />), await detail("medical-studies")]) expect(jsonLd(html)).toEqual([]);
  });

  it("describes the website and its author on Home and Profile with absolute URLs", () => {
    production();
    for (const html of [renderToStaticMarkup(<Home />), renderToStaticMarkup(<Profile />)]) {
      expect(jsonLd(html)).toMatchObject([{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", "@id": "https://example.com/#website", url: "https://example.com/", inLanguage: "ja", author: { "@id": "https://example.com/#person" } },
          { "@type": "Person", "@id": "https://example.com/#person", name: "myoshi2891", url: "https://example.com/profile/",
            sameAs: ["https://github.com/myoshi2891", "https://x.com/myoshi2891", "https://leetcode.com/u/myoshizumi/"] },
        ],
      }]);
    }
  });

  it("adds a breadcrumb trail matching the visible breadcrumbs to each detail", async () => {
    production();
    expect(jsonLd(await detail("medical-studies"))).toMatchObject([{
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com/" },
        { "@type": "ListItem", position: 2, name: "代表的な制作", item: "https://example.com/#work-r12" },
        { "@type": "ListItem", position: 3, item: "https://example.com/projects/medical-studies/" },
      ],
    }]);
  });
});
