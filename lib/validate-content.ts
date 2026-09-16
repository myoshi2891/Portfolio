import type { Claim, Portfolio, RepositoryId } from "../types/portfolio";
import { homeAnchor } from "./routes";

const expectedNames = ["Multi-Vendor-E-Commerce", "The-Wild-Oasis-For-Admin", "The-Wild-Oasis-For-User", "AirbnbCloneApp", "Next-Store", "Comparison-of-LLMs", "Quality-Assurance-Studies", "Software-Design-and-Architecture", "Management-Team-Building-Studies", "Cloud-Infrastructure-and-Network-Studies", "Security_Studies", "Medical-Studies", "Algorithm-DataStructures-Math-SQL"];
const expectedGroups = { featured: ["R01", "R06", "R12", "R02"], study: ["R08", "R07", "R11", "R10", "R13", "R09"], secondary: ["R04", "R03", "R05"] };

export function validateContent(data: Portfolio): string[] {
  const errors: string[] = [];
  const entries = [...data.projects, ...data.studies];
  const unique = (values: string[], label: string) => {
    if (new Set(values).size !== values.length) errors.push(`duplicate ${label}`);
  };
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (entries.length !== 13) errors.push("expected 13 repositories");
  unique(entries.map(e => e.id), "repository");
  unique(entries.map(homeAnchor), "anchor");
  for (const [type, ids] of Object.entries(expectedGroups)) {
    const group = entries.filter(e => e.type === type);
    if (group.map(e => e.id).join() !== ids.join() || group.some((e, i) => e.order !== i + 1)) errors.push(`order or membership: ${type}`);
  }
  const checkClaim = (claim: Claim, repoId?: RepositoryId, scope = false) => {
    if (!claim.text.trim()) errors.push("empty claim");
    if (!claim.evidenceIds.length) errors.push("empty evidence");
    for (const id of claim.evidenceIds) {
      const source = data.evidence[id];
      if (!source || source.status !== "VERIFIED") { errors.push(`missing verified evidence: ${id}`); continue; }
      if (source.sourceType === "REPOSITORY_VERIFIED" && source.repoId !== repoId) errors.push(`evidence repo mismatch: ${id}`);
      if (scope && source.sourceType !== "USER_PROVIDED") errors.push("scope requires user-provided evidence");
    }
  };
  for (const entry of entries) {
    const name = expectedNames[Number(entry.id.slice(1)) - 1];
    if (entry.name !== name || entry.githubUrl !== `https://github.com/myoshi2891/${name}`) errors.push(`github identity: ${entry.id}`);
    if (!entry.title.trim() || !entry.name.trim()) errors.push(`empty title: ${entry.id}`);
    checkClaim(entry.description, entry.id);
    const claims = entry.type === "study" ? entry.implementationNotes : [...entry.technologies, ...entry.highlights];
    claims.forEach(c => checkClaim(c, entry.id));
  }
  for (const [id, source] of Object.entries(data.evidence)) {
    if (!validDate(source.checkedAt)) errors.push(`invalid date: ${id}`);
    if (source.sourceType === "USER_PROVIDED") {
      if (!source.sourceLocation.trim()) errors.push(`empty source: ${id}`);
      continue;
    }
    if (!/^[a-f0-9]{40}$/.test(source.commit)) errors.push(`invalid SHA: ${id}`);
    if (source.auditId !== id || !id.startsWith(source.repoId + "-")) errors.push(`evidence repo mismatch: ${id}`);
    const name = expectedNames[Number(source.repoId.slice(1)) - 1];
    if (!source.sources.length) errors.push(`empty source: ${id}`);
    for (const link of source.sources) {
      if (!link.label.trim() || !link.url.startsWith(`https://github.com/myoshi2891/${name}/blob/${source.commit}/`)) errors.push(`invalid source URL: ${id}`);
    }
  }
  const featured = data.projects.filter(p => p.type === "featured");
  unique(featured.map(p => p.slug), "slug");
  if (Object.keys(data.details).sort().join() !== featured.map(p => p.slug).sort().join()) errors.push("detail set mismatch");
  for (const project of featured) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) errors.push("invalid slug");
    const detail = data.details[project.slug];
    if (!detail) continue;
    for (const section of Object.values(detail.sections)) {
      section.claims.forEach(c => checkClaim(c, project.id));
      for (const id of section.limitationIds) {
        if (data.limitations[id]?.repoId !== project.id) errors.push(`limitation repo mismatch: ${id}`);
      }
    }
    detail.scope?.forEach(c => checkClaim(c, project.id, true));
  }
  return errors;
}
