import { expect, test } from "@playwright/test";

test("all internal links resolve and initial rendering requires no third-party requests", async ({ page, request }) => {
  const externalRequests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => {
    if (new URL(route.request().url()).origin !== "http://127.0.0.1:4173") {
      externalRequests.push(route.request().url()); return route.abort();
    }
    return route.continue();
  });
  const paths = ["/", "/projects/multi-vendor-e-commerce/", "/projects/comparison-of-llms/", "/projects/medical-studies/", "/projects/the-wild-oasis-for-admin/"];
  const idsByPath = new Map<string, Set<string>>();
  const links: string[] = [];
  for (const path of paths) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const ids = await page.locator("[id]").evaluateAll(nodes => nodes.map(n => n.id));
    expect(new Set(ids).size).toBe(ids.length);
    idsByPath.set(path, new Set(ids));
    links.push(...await page.locator("a[href]").evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).href)));
  }
  for (const href of new Set(links)) {
    const url = new URL(href);
    if (url.origin !== "http://127.0.0.1:4173") continue;
    expect(idsByPath.has(url.pathname), href).toBe(true);
    if (url.hash) expect(idsByPath.get(url.pathname)?.has(decodeURIComponent(url.hash.slice(1))), href).toBe(true);
  }
  expect(externalRequests).toEqual([]); expect(errors).toEqual([]);
  const missing = await request.get("/projects/unknown/");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("Homeへ戻る");
});
