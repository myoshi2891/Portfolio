import { projects } from "../data/projects";
import { studies } from "../data/studies";
import { evidence } from "../data/evidence";
import { limitations } from "../data/limitations";
import { projectDetails } from "../data/project-details";
import type { Portfolio } from "../types/portfolio";

export const portfolio: Portfolio = {
  projects: [...projects], studies: [...studies], details: { ...projectDetails },
  evidence: { ...evidence }, limitations: { ...limitations },
};
export const featuredProjects = projects.filter(p => p.type === "featured");
export const secondaryProjects = projects.filter(p => p.type === "secondary");
export const getFeatured = (slug: string) => featuredProjects.find(p => p.slug === slug);
