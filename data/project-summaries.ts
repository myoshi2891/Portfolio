import type { EvidenceId } from "./evidence";
import type { MarkdownDocument, RepositoryId } from "../types/portfolio";

type ProjectSummary = MarkdownDocument & { evidenceIds: readonly EvidenceId[] };

// Shared by study cards and future application summaries.
export const projectSummaries: Partial<Record<RepositoryId, ProjectSummary>> = {
  R04: {
    contentPath: "data/airbnb-summary.md",
    imageDirectory: "airbnb-clone",
    diagrams: [],
    evidenceIds: ["R04-A01", "R04-F01", "R04-F02"],
  },
  R03: {
    contentPath: "data/wild-oasis-guest-summary.md",
    imageDirectory: "wild-oasis-guest",
    diagrams: [],
    evidenceIds: ["R03-A01", "R03-F01"],
  },
  R05: {
    contentPath: "data/next-store-summary.md",
    imageDirectory: "next-store",
    diagrams: [],
    evidenceIds: ["R05-A01", "R05-F01"],
  },
  R08: {
    contentPath: "data/software-design-summary.md",
    imageDirectory: "software-design",
    diagrams: [],
    evidenceIds: ["R08-A01", "R08-F01"],
  },
  R07: {
    contentPath: "data/quality-assurance-summary.md",
    imageDirectory: "quality-assurance",
    diagrams: [],
    evidenceIds: ["R07-A01", "R07-F01"],
  },
  R11: {
    contentPath: "data/security-studies-summary.md",
    imageDirectory: "security-studies",
    diagrams: [],
    evidenceIds: ["R11-A01", "R11-F01"],
  },
  R10: {
    contentPath: "data/cloud-infrastructure-summary.md",
    imageDirectory: "cloud-infrastructure",
    diagrams: [],
    evidenceIds: ["R10-A01", "R10-F01"],
  },
  R13: {
    contentPath: "data/algorithm-studies-summary.md",
    imageDirectory: "algorithm-studies",
    diagrams: [],
    evidenceIds: ["R13-A01", "R13-F01"],
  },
  R09: {
    contentPath: "data/management-studies-summary.md",
    imageDirectory: "management-studies",
    diagrams: [],
    evidenceIds: ["R09-OVERVIEW"],
  },
};
