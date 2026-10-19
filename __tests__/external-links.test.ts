import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { checkLink, extractExternalLinks, linkReport } from "../lib/external-links";

describe("external link monitoring", () => {
  it("collects unique website links from rendered HTML and skips the site itself", () => {
    // Arrange
    const html = '<a href="https://github.com/myoshi2891">a</a><a href="https://x.com/a?b=1&amp;c=2">b</a><a href="/profile/">c</a><a href="https://github.com/myoshi2891">d</a><a href="https://example.com/x">e</a><link href="https://cdn.test/x.css">';
    // Act & Assert
    expect(extractExternalLinks([html], "https://example.com")).toEqual(["https://github.com/myoshi2891", "https://x.com/a?b=1&c=2"]);
  });

  it("separates broken links from links that only refuse automated requests", async () => {
    // Arrange: HEADを拒否するサイトはGETで再確認する
    const statuses: Record<string, number[]> = { "https://ok.test/": [200], "https://gone.test/": [404, 404], "https://bot.test/": [403, 403], "https://nohead.test/": [405, 200] };
    const fetcher = async (url: string | URL | Request) => new Response(null, { status: statuses[String(url)]?.shift() ?? 500 });
    // Act
    const results = await Promise.all(Object.keys(statuses).map(url => checkLink(url, fetcher)));
    // Assert
    expect(results.map(r => [r.url, r.state])).toEqual([
      ["https://ok.test/", "ok"], ["https://gone.test/", "broken"], ["https://bot.test/", "unverifiable"], ["https://nohead.test/", "ok"],
    ]);
    expect((await checkLink("https://down.test/", async () => { throw new Error("ENOTFOUND"); })).state).toBe("broken");
    expect(linkReport(results)).toContain("https://gone.test/");
    expect(linkReport(results)).not.toContain("https://ok.test/");
  });

  it("runs weekly outside pull requests and may only open issues", () => {
    const workflow = readFileSync(".github/workflows/external-links.yml", "utf8");
    expect(workflow).toMatch(/schedule:\s*\n\s*- cron: "[^"]+"/);
    expect(workflow).not.toMatch(/pull_request|^\s+push:/m);
    expect(workflow).toMatch(/permissions:\s*\n\s*contents: read\s*\n\s*issues: write/);
    expect(workflow).toContain("bun scripts/check-external-links.ts");
  });
});
