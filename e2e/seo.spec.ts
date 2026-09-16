import { expect, test } from "@playwright/test";

test("preview HTML carries metadata and local OG assets without an invented canonical", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("myoshi2891 — Engineering Portfolio");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "/og/portfolio.png");
  const image = await request.get("/og/portfolio.png");
  expect(image.status()).toBe(200); expect(image.headers()["content-type"]).toBe("image/png");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  expect(await robots.text()).not.toContain("Sitemap:");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("<loc>");
  await page.goto("/projects/comparison-of-llms/");
  await expect(page).toHaveTitle(/API.*myoshi2891/);
});
