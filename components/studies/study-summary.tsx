import type { MarkdownDocument } from "../../types/portfolio";
import { loadMarkdownDocument } from "../../lib/markdown-document";
import { MarkdownDocumentContent } from "../content/markdown-document";

export function StudySummary({ document }: { document: MarkdownDocument }) {
  const loaded = loadMarkdownDocument(document);
  const chapters = loaded.content.split(/(?=^#### )/m).filter(chapter => chapter.trim());

  return <div className="study-summary">
    {chapters.map((chapter, index) => <section
      key={index}
      className={`study-chapter${chapter.startsWith("#### 活用方法") ? " study-chapter-application" : ""}`}
    >
      <MarkdownDocumentContent document={document} loaded={loaded} content={chapter} />
    </section>)}
  </div>;
}
