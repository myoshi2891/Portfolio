import { SiteLink } from "../ui/site-link";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { extractMermaidSources } from "../../lib/mermaid-sources";
import { projectDocumentation } from "../../data/project-documentation";

const { contentPath, sections: multiVendorDetailSections, diagrams: diagramDescriptions } = projectDocumentation["multi-vendor-e-commerce"];
const content = readFileSync(contentPath, "utf8");
const sections = content.split(/(?=^## )/m).filter(section => section.trim());
const diagrams = extractMermaidSources(content);
if (sections.length !== multiVendorDetailSections.length - 1 || diagrams.length !== diagramDescriptions.length) {
  throw new Error(`Documentation structure does not match its navigation or diagrams: multi-vendor-e-commerce (sections ${sections.length}/${multiVendorDetailSections.length - 1}, diagrams ${diagrams.length}/${diagramDescriptions.length})`);
}
// Pair each Markdown chapter with the navigation entry it renders under (the first entry is the page header).
const sectionEntries = sections.flatMap((content, index) => {
  const navigation = multiVendorDetailSections[index + 1];
  return navigation ? [{ ...navigation, content }] : [];
});

// Source hashes prevent changed Markdown diagrams from displaying stale SVGs.
function diagramPath(source: string) {
  return `/images/multi-vendor-e-commerce/diagram-${createHash("sha256").update(source).digest("hex").slice(0, 12)}.svg`;
}

function diagramWidth(source: string) {
  const svg = readFileSync(`public${diagramPath(source)}`, "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)![1]!.split(/\s+/).map(Number);
  // The external SVG uses a 16px root. Size it in page rem units to preserve 1rem
  // text at every viewport and when the reader enlarges the page's root font.
  return `${viewBox[2]! / 16}rem`;
}

export function MultiVendorDetail() {
  return <>{sectionEntries.map(({ id, label, content }, index) => <section key={id} id={id}>
    <p className="detail-section-lead"><span>{String(index + 1).padStart(2, "0")}</span>{label}</p>
    <Markdown remarkPlugins={[remarkGfm]} components={{
    a: ({ href, children, title }) => <SiteLink href={href ?? ""} title={title}>{children}</SiteLink>,
      p: ({ children }) => <p className="section-intro">{children}</p>,
      table: ({ children }) => <div className="reading-table-wrap"><table className="reading-table">{children}</table></div>,
      th: ({ children }) => <th scope="col">{children}</th>,
      pre: ({ children }) => <div className="markdown-code-block">{children}</div>,
      code: ({ className, children }) => {
        if (className !== "language-mermaid") return <code className={className}>{children}</code>;
        const source = String(children).trim();
        const description = diagramDescriptions[diagrams.indexOf(source)]!;
        return <figure className="commerce-mermaid">
          <div className="commerce-diagram-scroll" role="region" aria-label={`図のスクロール領域：${description}`} tabIndex={0}>
            {/* Static SVG keeps Mermaid diagrams available without browser JavaScript. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={diagramPath(source)} alt={description} style={{ width: diagramWidth(source) }} />
          </div>
          <figcaption>{description}</figcaption>
        </figure>;
      },
    }}>{content}</Markdown>
  </section>)}</>;
}
