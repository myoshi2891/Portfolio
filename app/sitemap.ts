import type { MetadataRoute } from "next";
import { featuredProjects } from "../lib/portfolio";
import { projectPath } from "../lib/routes";
import { readSiteConfig } from "../lib/site-config";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = readSiteConfig();
  return siteUrl ? ["/", ...featuredProjects.map(p => projectPath(p.slug))].map(path => ({ url: siteUrl + path })) : [];
}
