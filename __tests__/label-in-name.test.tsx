import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";
import Profile from "../app/profile/page";
import NotFound from "../app/not-found";
import Detail from "../app/projects/[slug]/page";
import { featuredProjects } from "../lib/portfolio";
import { themeToggleLabel } from "../components/layout/theme-toggle";

// WCAG 2.5.3 Label in Name: aria-label を持つ操作要素は、表示文字をアクセシブルネームに含める
const entities: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#x27;": "'", "&nbsp;": " " };
const normalize = (value: string) => value.replace(/&(?:amp|lt|gt|quot|#x27|nbsp);/g, entity => entities[entity] ?? entity).replace(/\s+/g, " ").trim().toLowerCase();

function labelMismatches(html: string): string[] {
  const mismatches: string[] = [];
  for (const [, , attributes = "", inner = ""] of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const label = attributes.match(/aria-label="([^"]*)"/)?.[1];
    if (label === undefined) continue;
    const visible = normalize(inner.replace(/<span[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, ""));
    if (visible && !normalize(label).includes(visible)) mismatches.push(`${visible} -> ${label}`);
  }
  return mismatches;
}

// axe 4.14 compares NFKD-normalized words, and counts aria-hidden glyphs as visible text.
const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
const words = (value: string) => [...segmenter.segment(normalize(value).normalize("NFKD").replace(/[^\p{L}\p{N}]/gu, " "))].map(({ segment }) => segment.trim()).filter(Boolean);

function wordMismatches(html: string): string[] {
  const mismatches: string[] = [];
  for (const [, , attributes = "", inner = ""] of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const label = attributes.match(/aria-label="([^"]*)"/)?.[1];
    if (label === undefined) continue;
    const visible = words(inner.replace(/<[^>]+>/g, ""));
    const name = words(label);
    const contained = name.some((_, start) => visible.every((word, offset) => word === name[start + offset]));
    if (visible.length && !contained) mismatches.push(`${visible.join(" ")} -> ${label}`);
  }
  return mismatches;
}

describe("label in name", () => {
  it("detects an accessible name that omits the visible text", () => {
    expect(labelMismatches('<a href="#x" aria-label="代表的な制作へ">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>')).toEqual(["scroll to explore -> 代表的な制作へ"]);
    expect(labelMismatches('<button type="button" aria-label="ダークモードに切り替える"><span>ダーク</span></button>')).toEqual([]);
    expect(labelMismatches('<a href="/x/" aria-label="R01 公開サイトを試す">公開サイトを試す<span aria-hidden="true" class="arrow">↗</span></a>')).toEqual([]);
  });

  it("keeps visible text inside every aria-label on the statically rendered pages", async () => {
    const pages = [
      renderToStaticMarkup(<Home />),
      renderToStaticMarkup(<Profile />),
      renderToStaticMarkup(<NotFound />),
      ...await Promise.all(featuredProjects.map(async ({ slug }) => renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug }) })))),
    ];
    expect(pages.flatMap(labelMismatches)).toEqual([]);
    expect(pages.flatMap(wordMismatches)).toEqual([]);
  });

  it("matches whole visible words for client-rendered toggles as axe does", () => {
    expect(wordMismatches('<button type="button" aria-label="ダークモードに切り替える"><span>ダーク</span></button>')).toHaveLength(1);
    for (const next of ["ダーク", "ライト"]) {
      expect(wordMismatches(`<button type="button" aria-label="${themeToggleLabel(next)}"><span>${next}</span></button>`)).toEqual([]);
    }
  });
});
