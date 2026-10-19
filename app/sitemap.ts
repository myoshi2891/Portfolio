import type { MetadataRoute } from "next";
import { featuredProjects, portfolio } from "../lib/portfolio";
import { projectPath } from "../lib/routes";
import { readSiteConfig } from "../lib/site-config";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = readSiteConfig();
  if (!siteUrl) return [];
  // Only detail pages carry a recorded update date; other pages omit lastModified rather than invent one.
  const details = featuredProjects.flatMap(p => {
    const updatedAt = portfolio.documentation[p.slug]?.updatedAt;
    return updatedAt ? [{ url: siteUrl + projectPath(p.slug), lastModified: updatedAt }] : [];
  });
  return [{ url: siteUrl + "/" }, { url: siteUrl + "/profile/" }, ...details];
}
