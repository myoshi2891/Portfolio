import type { Project, Study } from "../types/portfolio";

export const projectPath = (slug: string, section?: string) =>
  `/projects/${slug}/${section ? `#${section}` : ""}`;
export const homeAnchor = (entry: Pick<Project | Study, "type" | "id">) =>
  `${entry.type === "study" ? "study" : "work"}-${entry.id.toLowerCase()}`;
