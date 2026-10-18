import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";
import Profile from "../app/profile/page";
import NotFound from "../app/not-found";
import Detail from "../app/projects/[slug]/page";
import { Footer } from "../components/layout/chrome";

// WCAG 3.1.2 Language of Parts: 日本語ページ内の英語の UI 語句は lang="en" で読み上げ言語を切り替える。
// 固有名詞・技術名・aria-hidden の装飾は対象外。
type TextNode = { text: string; lang: string; hidden: boolean };
const voidElements = new Set(["img", "br", "source", "meta", "link", "input", "hr"]);

function textNodes(html: string, rootLang = "ja"): TextNode[] {
  const stack: { tag: string; lang: string; hidden: boolean }[] = [{ tag: "#root", lang: rootLang, hidden: false }];
  const nodes: TextNode[] = [];
  for (const [, closing, tag, attributes = "", text] of html.matchAll(/<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g)) {
    const parent = stack.at(-1)!;
    if (text !== undefined) {
      if (text.trim()) nodes.push({ text: text.replace(/&amp;/g, "&").trim(), lang: parent.lang, hidden: parent.hidden });
      continue;
    }
    const name = tag!.toLowerCase();
    if (closing) {
      const index = stack.map(entry => entry.tag).lastIndexOf(name);
      if (index > 0) stack.length = index;
      continue;
    }
    if (voidElements.has(name) || attributes.trimEnd().endsWith("/")) continue;
    stack.push({
      tag: name,
      lang: attributes.match(/\slang="([^"]*)"/)?.[1] ?? parent.lang,
      hidden: parent.hidden || /\saria-hidden="true"/.test(attributes),
    });
  }
  return nodes;
}

const pattern = (phrase: string) => new RegExp(`(^|[^A-Za-z])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`);
function unmarked(html: string, phrases: readonly string[]) {
  const nodes = textNodes(html).filter(node => !node.hidden);
  return {
    // 英語句が日本語として読み上げられる位置に残っていないか
    outside: phrases.filter(phrase => nodes.some(node => node.lang !== "en" && pattern(phrase).test(node.text))),
    // 英語句そのものが画面から消えていないか（検査の空振りを防ぐ）
    missing: phrases.filter(phrase => !nodes.some(node => node.lang === "en" && pattern(phrase).test(node.text))),
  };
}

describe("language of parts", () => {
  it("tracks inherited lang and aria-hidden through nested markup", () => {
    expect(textNodes('<p class="eyebrow"><span>01</span> <span lang="en">Selected Work</span></p><span aria-hidden="true">BUILD</span><p>制作</p>')).toEqual([
      { text: "01", lang: "ja", hidden: false },
      { text: "Selected Work", lang: "en", hidden: false },
      { text: "BUILD", lang: "ja", hidden: true },
      { text: "制作", lang: "ja", hidden: false },
    ]);
  });

  it("marks English interface phrases on Home and the shared footer", () => {
    const html = renderToStaticMarkup(<><Home /><Footer /></>);
    expect(unmarked(html, [
      "Engineering Portfolio", "Featured projects", "Learning collections", "Portfolio architecture", "Learn. Build. Keep improving.",
      "Learn", "Build", "Engineer", "Improve", "SCROLL TO EXPLORE",
      "Selected Work", "Engineering Domains", "Selected Studies", "More Work", "Engineering Philosophy",
      "BUILD", "STUDY", "ENGINEER", "Products & Applications", "Research & Knowledge", "Architecture, Quality & Security",
      "Featured project", "Learning collection", "Related project", "About", "Explore the source",
    ])).toEqual({ outside: [], missing: [] });
  });

  it("marks English interface phrases on the profile, 404 and detail pages", async () => {
    expect(unmarked(renderToStaticMarkup(<Profile />), ["About me", "Build & Learn", "Stay connected", "Certifications & Scores", "Problem solving"])).toEqual({ outside: [], missing: [] });
    expect(unmarked(renderToStaticMarkup(<NotFound />), ["A little off the path", "Selected Work"])).toEqual({ outside: [], missing: [] });
    const detail = renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug: "medical-studies" }) }));
    expect(unmarked(detail, ["Selected Work", "Next Work"])).toEqual({ outside: [], missing: [] });
  });
});
