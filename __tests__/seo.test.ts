import { afterEach, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import { readSiteConfig } from "../lib/site-config";
import { pageMetadata } from "../lib/metadata";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { generateMetadata } from "../app/projects/[slug]/page";
import { site } from "../data/site";

afterEach(() => vi.unstubAllEnvs());

describe("publication configuration", () => {
  it("defaults to a preview without an invented origin", () => {
    expect(readSiteConfig({})).toEqual({ production: false, siteUrl: null });
  });
  it("requires a valid HTTPS origin for production and rejects ambiguous settings", () => {
    for (const url of [undefined, "", "http://example.com", "not-a-url", "https://user:pass@example.com", "https://example.com/?q=1", "https://example.com/#anchor", "https://example.com/subpath/"]) {
      expect(() => readSiteConfig({ DEPLOYMENT_ENV: "production", SITE_URL: url })).toThrow();
    }
    expect(() => readSiteConfig({ DEPLOYMENT_ENV: "prod" })).toThrow();
    expect(readSiteConfig({ DEPLOYMENT_ENV: "production", SITE_URL: "https://example.com/" })).toEqual({ production: true, siteUrl: "https://example.com" });
  });
});

describe("page metadata and discovery", () => {
  it("keeps previews noindex and omits canonical and sitemap without a URL", () => {
    vi.stubEnv("SITE_URL", ""); vi.stubEnv("DEPLOYMENT_ENV", "preview");
    const meta = pageMetadata("/", site.title, site.description);
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.alternates).toBeUndefined();
    expect(meta.metadataBase).toBeUndefined();
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
  it("uses each page's editorial title, description, canonical and OG metadata", async () => {
    vi.stubEnv("SITE_URL", "https://example.com"); vi.stubEnv("DEPLOYMENT_ENV", "production");
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "comparison-of-llms" }) });
    expect(meta.title).toContain("LLM料金の収集と費用計算");
    expect(meta.title).toContain(site.name);
    expect(meta.description).toContain("料金");
    expect(meta.alternates).toEqual({ canonical: "https://example.com/projects/comparison-of-llms/" });
    expect(meta.openGraph).toMatchObject({ locale: "ja_JP", url: "https://example.com/projects/comparison-of-llms/", images: [{ url: "https://example.com/og/portfolio.png", width: 1200, height: 630 }] });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });
  it("lists only Home and the four published details without invented dates", () => {
    vi.stubEnv("SITE_URL", "https://example.com"); vi.stubEnv("DEPLOYMENT_ENV", "production");
    expect(sitemap().map(entry => entry.url)).toEqual([
      "https://example.com/", "https://example.com/projects/multi-vendor-e-commerce/", "https://example.com/projects/comparison-of-llms/", "https://example.com/projects/medical-studies/", "https://example.com/projects/the-wild-oasis-for-admin/",
    ]);
    expect(sitemap().every(entry => !("lastModified" in entry))).toBe(true);
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" }, sitemap: "https://example.com/sitemap.xml" });
    vi.stubEnv("DEPLOYMENT_ENV", "preview");
    expect(pageMetadata("/", site.title, site.description).robots).toEqual({ index: false, follow: false });
  });
  it("ships a valid static 1200 by 630 OG image", async () => {
    expect(await sharp("public/og/portfolio.png").metadata()).toMatchObject({ width: 1200, height: 630, format: "png" });
  });
});
