import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

const files = (directory: string, pattern: RegExp) => readdirSync(directory, { recursive: true, encoding: "utf8" })
  .filter(path => pattern.test(path)).map(path => join(directory, path));

it("keeps no class selectors that the pages and content never render", () => {
  // Arrange: 生成されるfonts.cssとMermaidの動的なnode-*クラスは対象外
  const stylesheets = files("app", /\.css$/).filter(path => !path.endsWith("fonts.css"));
  const sources = ["app", "components", "lib", "data"].flatMap(directory => files(directory, /\.(tsx?|md)$/))
    .map(path => readFileSync(path, "utf8")).join("\n");
  const classes = new Set(stylesheets.flatMap(path => [...readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/\.(-?[a-z_][\w-]*)/gi)].map(match => match[1] ?? "")));
  // Act
  const unused = [...classes].filter(name => !name.startsWith("node-") && !new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(sources));
  // Assert
  expect(unused).toEqual([]);
});

it("keeps Tailwind from generating utilities out of words in the content", () => {
  // JSXはTailwindのユーティリティを使わないため、本文の単語から.containerなどを生成させない
  expect(readFileSync("app/globals.css", "utf8")).toMatch(/^@import "tailwindcss" source\(none\);$/m);
});
