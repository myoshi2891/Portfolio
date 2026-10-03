import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

// react-markdown と同じ remark-parse + remark-gfm で解析し、描画時の code ノードと一致させる
const parser = unified().use(remarkParse).use(remarkGfm);
type MarkdownNode = ReturnType<typeof parser.parse>["children"][number];

export function extractMermaidSources(markdown: string): string[] {
  const sources: string[] = [];
  const visit = (node: MarkdownNode): void => {
    if (node.type === "code" && node.lang === "mermaid") sources.push(node.value.trim());
    if ("children" in node) node.children.forEach(visit);
  };
  parser.parse(markdown).children.forEach(visit);
  return sources;
}
