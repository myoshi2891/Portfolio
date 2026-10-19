import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { MarkdownDocument } from "../types/portfolio";
import { extractMermaidSources } from "./mermaid-sources";

export function diagramPath(document: MarkdownDocument, source: string) {
  const id = createHash("sha256").update(source).digest("hex").slice(0, 12);
  return `/images/${document.imageDirectory}/diagram-${id}.svg`;
}

export function loadMarkdownDocument(document: MarkdownDocument) {
  const content = readFileSync(document.contentPath, "utf8");
  if (!content.trim()) throw new Error(`Empty document: ${document.contentPath}`);
  const sources = extractMermaidSources(content);
  if (sources.length !== document.diagrams.length || document.diagrams.some(description => !description.trim())) {
    throw new Error(`Diagram descriptions do not match: ${document.contentPath}`);
  }
  const diagrams = sources.map((source, index) => {
    const path = diagramPath(document, source);
    const svg = readFileSync(`public${path}`, "utf8");
    const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]?.split(/\s+/).map(Number);
    if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2]! <= 0) {
      throw new Error(`Invalid diagram viewBox: ${path}`);
    }
    return { source, path, description: document.diagrams[index]!, width: viewBox[2]! / 16 };
  });
  return { content, diagrams };
}

export type LoadedMarkdownDocument = ReturnType<typeof loadMarkdownDocument>;
