import { SiteLink } from "../ui/site-link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MarkdownDocument } from "../../types/portfolio";
import { loadMarkdownDocument, type LoadedMarkdownDocument } from "../../lib/markdown-document";

// Callers that render per chapter pass the loaded document to avoid rereading Markdown and SVGs.
export function MarkdownDocumentContent({ document, loaded = loadMarkdownDocument(document), content }: {
  document: MarkdownDocument;
  loaded?: LoadedMarkdownDocument;
  content?: string;
}) {
  return <Markdown remarkPlugins={[remarkGfm]} components={{
    a: ({ href, children, title }) => <SiteLink href={href ?? ""} title={title}>{children}</SiteLink>,
    p: ({ children }) => <p className="section-intro">{children}</p>,
    table: ({ children }) => <div className="reading-table-wrap"><table className="reading-table">{children}</table></div>,
    th: ({ children }) => <th scope="col">{children}</th>,
    pre: ({ children }) => <div className="markdown-code-block">{children}</div>,
    code: ({ className, children }) => {
      if (className !== "language-mermaid") return <code className={className}>{children}</code>;
      const diagram = loaded.diagrams.find(diagram => diagram.source === String(children).trim());
      if (!diagram) throw new Error(`Unregistered diagram: ${document.contentPath}`);
      return <figure className="detail-mermaid">
        <div className="detail-diagram-scroll" role="region" aria-label={`図のスクロール領域：${diagram.description}`} tabIndex={0}>
          {/* External SVGs remain readable without client JavaScript. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={diagram.path} alt={diagram.description} style={{ width: `${diagram.width}rem` }} />
        </div>
        <figcaption>{diagram.description}</figcaption>
      </figure>;
    },
  }}>{content ?? loaded.content}</Markdown>;
}
