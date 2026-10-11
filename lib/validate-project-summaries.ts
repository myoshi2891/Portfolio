import { existsSync } from "node:fs";
import { projectSummaries } from "../data/project-summaries";
import type { Portfolio } from "../types/portfolio";
import { loadMarkdownDocument } from "./markdown-document";

export function validateProjectSummaries(data: Portfolio, summaries = projectSummaries): string[] {
  const errors: string[] = [];
  for (const [id, document] of Object.entries(summaries)) {
    if (![...data.projects, ...data.studies].some(entry => entry.id === id)) errors.push(`Unknown summary repository: ${id}`);
    if (!document.evidenceIds.length) errors.push(`Missing summary evidence: ${id}`);
    for (const evidenceId of document.evidenceIds) {
      const evidence = data.evidence[evidenceId];
      if (!evidence || evidence.status !== "VERIFIED") errors.push(`Invalid summary evidence: ${evidenceId}`);
      else if (evidence.sourceType === "USER_PROVIDED") {
        if (!existsSync(evidence.sourceLocation)) errors.push(`Missing summary source: ${evidence.sourceLocation}`);
      } else if (evidence.repoId !== id) errors.push(`Summary evidence repo mismatch: ${evidenceId}`);
    }
    try { loadMarkdownDocument(document); }
    catch (error) { errors.push(error instanceof Error ? error.message : String(error)); }
  }
  return errors;
}
