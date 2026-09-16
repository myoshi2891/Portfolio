import type { MetadataRoute } from "next";
import { readSiteConfig } from "../lib/site-config";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  const { siteUrl, production } = readSiteConfig();
  return {
    rules: production ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
