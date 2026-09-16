import type { Portfolio } from "../types/portfolio";
import { homeAnchor, projectPath } from "./routes";

type HomeReferences = { heroEvidenceIds: readonly string[]; philosophy: readonly { href: string }[] };
type DomainReferences = readonly { links: readonly { anchor: string }[] }[];

export function validateHomeContent(data: Portfolio, home: HomeReferences, domains: DomainReferences): string[] {
  const errors: string[] = [];
  const anchors = new Set(["main", "top", "selected-work", "domains", "studies", "more-work", "philosophy", "contact", ...data.projects.map(homeAnchor), ...data.studies.map(homeAnchor)]);
  const destinations = new Set(["/", ...[...anchors].map(id => `/#${id}`)]);
  for (const [slug, detail] of Object.entries(data.details)) {
    destinations.add(projectPath(slug));
    for (const id of ["overview", "evidence", ...Object.keys(detail.sections), ...(detail.scope ? ["scope"] : [])]) destinations.add(projectPath(slug, id));
  }
  if (!home.heroEvidenceIds.length) errors.push("missing hero evidence");
  for (const id of home.heroEvidenceIds) {
    if (data.evidence[id]?.status !== "VERIFIED") errors.push(`invalid hero evidence: ${id}`);
  }
  for (const { links } of domains) {
    for (const { anchor } of links) if (!anchors.has(anchor)) errors.push(`invalid domain anchor: ${anchor}`);
  }
  for (const { href } of home.philosophy) if (!destinations.has(href)) errors.push(`invalid philosophy link: ${href}`);
  return errors;
}
