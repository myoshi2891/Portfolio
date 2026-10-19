import { projectDocumentation } from "../../data/project-documentation";
import type { ProjectDocumentation } from "../../types/portfolio";
import { loadMarkdownDocument } from "../../lib/markdown-document";
import { MarkdownDocumentContent } from "../content/markdown-document";

const documents: Readonly<Record<string, ProjectDocumentation>> = projectDocumentation;

export function DocumentedProjectDetail({ slug }: { slug: string }) {
  const document = documents[slug];
  if (!document) throw new Error(`Unregistered project documentation: ${slug}`);
  const { content } = loadMarkdownDocument(document);
  const sections = content.split(/(?=^## )/m).filter(section => section.trim());
  if (sections.length !== document.sections.length - 1) {
    throw new Error(`Documentation structure does not match its navigation or diagrams: ${slug}`);
  }

  return <>{sections.map((section, index) => {
    const navigation = document.sections[index + 1]!;
    return <section key={navigation.id} id={navigation.id}>
      <p className="detail-section-lead"><span>{String(index + 1).padStart(2, "0")}</span>{navigation.label}</p>
      <MarkdownDocumentContent document={document} content={section} />
    </section>;
  })}</>;
}
