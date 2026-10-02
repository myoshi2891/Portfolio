import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { documentedDetailSections, projectDocumentation, type DocumentedProjectSlug } from "../../data/project-documentation";

export function DocumentedProjectDetail({ slug }: { slug: DocumentedProjectSlug }) {
  const document = projectDocumentation[slug];
  const content = readFileSync(document.contentPath, "utf8");
  const sections = content.split(/(?=^## )/m).filter(section => section.trim());
  const diagrams = [...content.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(match => match[1]!.trim());
  if (sections.length !== documentedDetailSections.length - 1 || diagrams.length !== document.diagrams.length) {
    throw new Error(`Documentation structure does not match its navigation or diagrams: ${slug}`);
  }

  return <>{sections.map((section, index) => {
    const navigation = documentedDetailSections[index + 1]!;
    return <section key={navigation.id} id={navigation.id}>
      <p className="detail-section-lead"><span>{String(index + 1).padStart(2, "0")}</span>{navigation.label}</p>
      <Markdown remarkPlugins={[remarkGfm]} components={{
        p: ({ children }) => <p className="section-intro">{children}</p>,
        table: ({ children }) => <div className="reading-table-wrap"><table className="reading-table">{children}</table></div>,
        th: ({ children }) => <th scope="col">{children}</th>,
        pre: ({ children }) => <div className="markdown-code-block">{children}</div>,
        code: ({ className, children }) => {
          if (className !== "language-mermaid") return <code className={className}>{children}</code>;
          const source = String(children).trim();
          const id = createHash("sha256").update(source).digest("hex").slice(0, 12);
          const path = `/images/${document.imageDirectory}/diagram-${id}.svg`;
          const svg = readFileSync(`public${path}`, "utf8");
          const viewBox = svg.match(/viewBox="([^"]+)"/)![1]!.split(/\s+/).map(Number);
          const description = document.diagrams[diagrams.indexOf(source)]!;
          return <figure className="detail-mermaid">
            <div className="detail-diagram-scroll" role="region" aria-label={`図のスクロール領域：${description}`} tabIndex={0}>
              {/* External SVGs keep diagram text at 1rem and work without JavaScript. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={path} alt={description} style={{ width: `${viewBox[2]! / 16}rem` }} />
            </div>
            <figcaption>{description}</figcaption>
          </figure>;
        },
      }}>{section}</Markdown>
    </section>;
  })}</>;
}
