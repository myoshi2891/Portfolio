export type LinkState = "ok" | "broken" | "unverifiable";
export type LinkResult = { url: string; state: LinkState; detail: string };
type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

// Statuses that sites commonly return to automated clients; they do not prove the page is gone.
const refusals = new Set([401, 403, 429, 999]);

// Only anchors are visitor-facing links; the site's own pages are covered by E2E.
export function extractExternalLinks(pages: readonly string[], siteUrl?: string | null): string[] {
  const links = pages.flatMap(html => [...html.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/g)].map(([, href = ""]) => href.replace(/&amp;/g, "&")));
  return [...new Set(links)].filter(url => !siteUrl || new URL(url).origin !== new URL(siteUrl).origin).sort();
}

export async function checkLink(url: string, fetcher: Fetcher = fetch): Promise<LinkResult> {
  const request = (method: "HEAD" | "GET") => fetcher(url, { method, redirect: "follow", signal: AbortSignal.timeout(15_000), headers: { "user-agent": "myoshi2891-portfolio-link-check" } });
  // Some servers reject HEAD, so any non-success is confirmed with GET.
  const head = await request("HEAD").catch((error: unknown) => error);
  if (head instanceof Response && head.ok) return { url, state: "ok", detail: String(head.status) };
  try {
    const { status } = await request("GET");
    if (status < 400) return { url, state: "ok", detail: String(status) };
    return { url, state: refusals.has(status) ? "unverifiable" : "broken", detail: String(status) };
  } catch (error) {
    // A timeout only shows the site was slow to answer, not that the page is gone.
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return { url, state: timedOut ? "unverifiable" : "broken", detail: error instanceof Error ? error.message : String(error) };
  }
}

export function linkReport(results: readonly LinkResult[]): string {
  const rows = (state: LinkState) => results.filter(r => r.state === state).map(r => `- ${r.url} (${r.detail})`);
  const broken = rows("broken");
  const unverifiable = rows("unverifiable");
  return [
    `# 外部リンクの確認結果`, ``, `確認 ${results.length} 件、切れ ${broken.length} 件、自動確認不可 ${unverifiable.length} 件。`,
    ...(broken.length ? [``, `## 切れているリンク`, ...broken] : []),
    ...(unverifiable.length ? [``, `## 自動確認できなかったリンク（手動で確認）`, ...unverifiable] : []),
  ].join("\n");
}
