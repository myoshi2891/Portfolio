import type { Project } from "../../types/portfolio";
import { readSiteConfig } from "../../lib/site-config";
import { breadcrumbStructuredData, siteStructuredData } from "../../lib/structured-data";

// A data block is never executed, so it stays within the CSP; escaping "<" keeps it from closing the script.
function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function SiteJsonLd() {
  const { siteUrl } = readSiteConfig();
  return siteUrl ? <JsonLd data={siteStructuredData(siteUrl)} /> : null;
}

export function BreadcrumbJsonLd({ project }: { project: Project & { slug: string } }) {
  const { siteUrl } = readSiteConfig();
  return siteUrl ? <JsonLd data={breadcrumbStructuredData(siteUrl, project)} /> : null;
}
