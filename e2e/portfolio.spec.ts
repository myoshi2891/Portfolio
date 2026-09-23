import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const slugs = ["multi-vendor-e-commerce", "comparison-of-llms", "medical-studies", "the-wild-oasis-for-admin"];

test("all pages load directly and unknown routes return real 404s", async ({ page, request }) => {
  for (const path of ["/", ...slugs.map(s => `/projects/${s}/`)]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  for (const slug of ["unknown", "next-store", "security-studies"]) {
    expect((await request.get(`/projects/${slug}/`)).status()).toBe(404);
  }
});

test("all content is accessible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await page.getByText("すべての学習を見る（残り3件）", { exact: true }).click();
  await expect(page.locator("#study-r10")).toBeVisible();
  await expect(page.locator("[data-repository]")).toHaveCount(13);
  await page.locator('a[href="/projects/multi-vendor-e-commerce/"]').first().click();
  await expect(page.locator("#evidence")).toBeVisible();
  await page.goto("http://127.0.0.1:4173/projects/comparison-of-llms/");
  const galleryViewport = await page.locator('.slideshow-viewport').boundingBox();
  const firstSlide = await page.locator('.slideshow-slide.is-active').boundingBox();
  expect(Math.abs((firstSlide!.x + firstSlide!.width / 2) - (galleryViewport!.x + galleryViewport!.width / 2))).toBeLessThan(2);
  await context.close();
});

test("keyboard skip link and disclosure retain a visible focus", async ({ page, browserName }) => {
  await page.goto("/");
  // macOS WebKit uses Option-Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link", { name: "本文へ移動" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const summary = page.locator("#more-studies > summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#more-studies")).toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#more-studies")).not.toHaveAttribute("open", "");
});

for (const width of [320, 768, 1200, 1440]) {
  test(`no clipping at ${width}px, with enlarged text and unavailable fonts`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/\.(woff2?|ttf)(\?|$)/, route => route.abort());
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/projects/comparison-of-llms/"]) {
      await page.goto(path);
      await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
      await page.locator("details").evaluateAll(nodes => nodes.forEach(n => n.setAttribute("open", "")));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
}
