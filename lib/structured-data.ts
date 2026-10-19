import { profileLinks } from "../data/profile";
import { site } from "../data/site";
import type { Project } from "../types/portfolio";
import { homeAnchor, projectPath } from "./routes";

// schema.org data needs absolute URLs, so callers build it only when the site URL is known.
export function siteStructuredData(siteUrl: string) {
  const person = `${siteUrl}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: `${siteUrl}/`, name: site.title, description: site.description, inLanguage: "ja", author: { "@id": person } },
      { "@type": "Person", "@id": person, name: site.name, url: `${siteUrl}/profile/`, sameAs: [site.githubUrl, profileLinks.x, profileLinks.leetcode] },
    ],
  };
}

// Mirrors the visible breadcrumbs on each project detail.
export function breadcrumbStructuredData(siteUrl: string, project: Project & { slug: string }) {
  const trail = [["Home", "/"], ["代表的な制作", `/#${homeAnchor(project)}`], [project.title, projectPath(project.slug)]] as const;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: siteUrl + path })),
  };
}
