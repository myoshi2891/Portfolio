import { projects } from "../data/projects";
import { studies } from "../data/studies";
import { evidence } from "../data/evidence";
import { projectDocumentation } from "../data/project-documentation";
import type { Portfolio } from "../types/portfolio";

export const portfolio: Portfolio = {
  projects: [...projects], studies: [...studies], documentation: projectDocumentation,
  evidence: { ...evidence },
};
export const featuredProjects = projects.filter(p => p.type === "featured");
export const secondaryProjects = projects.filter(p => p.type === "secondary");
export const getFeatured = (slug: string) => featuredProjects.find(p => p.slug === slug);
