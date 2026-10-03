import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { extractMermaidSources } from "../../lib/mermaid-sources";

export const multiVendorDetailSections = [
  { id: "overview", label: "概要" },
  { id: "features", label: "主な機能" },
  { id: "orders", label: "注文と決済" },
  { id: "architecture", label: "アーキテクチャ" },
  { id: "decisions", label: "構成と制約" },
  { id: "quality", label: "品質と継続課題" },
  { id: "documentation", label: "説明の基準" },
] as const;

const content = readFileSync("data/multi-vendor-detail.md", "utf8");
const sections = content.split(/(?=^## )/m).filter(section => section.trim());
const diagramDescriptions = [
  "一つの注文を店舗A・店舗Bの受注へ分け、バリアント別の明細と支払い情報を保持します。",
  "顧客の注文作成後に決済を行い、署名検証したWebhookで支払いと注文の状態を更新します。",
  "認証した画面からServer Actions、Prisma、PostgreSQLへ進み、決済通知はRoute Handlersで受信します。",
];
const diagrams = extractMermaidSources(content);
if (sections.length !== multiVendorDetailSections.length - 1 || diagrams.length !== diagramDescriptions.length) {
  throw new Error(`Documentation structure does not match its navigation or diagrams: multi-vendor-e-commerce (sections ${sections.length}/${multiVendorDetailSections.length - 1}, diagrams ${diagrams.length}/${diagramDescriptions.length})`);
}

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
  return <>{sections.map((section, index) => <section key={multiVendorDetailSections[index + 1]!.id} id={multiVendorDetailSections[index + 1]!.id}>
    <p className="detail-section-lead"><span>{String(index + 1).padStart(2, "0")}</span>{multiVendorDetailSections[index + 1]!.label}</p>
    <Markdown remarkPlugins={[remarkGfm]} components={{
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
    }}>{section}</Markdown>
  </section>)}</>;
}
