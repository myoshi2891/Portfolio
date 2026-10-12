import { expect, test } from "@playwright/test";

declare global { interface Window { __cspViolations: string[]; } }

test("pages run under the deployed security headers without CSP violations", async ({ page }) => {
  // Sequentially loads every page type, so it needs more than the default budget.
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", event => window.__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`));
  });
  for (const path of ["/", "/profile/", "/projects/multi-vendor-e-commerce/", "/projects/medical-studies/", "/missing-page/"]) {
    const response = await page.goto(path);
    expect(response?.headers()["content-security-policy"], path).toContain("default-src 'self'");
    expect(response?.headers()["x-content-type-options"], path).toBe("nosniff");
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.evaluate(() => Boolean(history.state?.portfolioNavigation)), path).toBe(true);
    expect(await page.evaluate(() => window.__cspViolations), path).toEqual([]);
    // WebKit reports prefetches aborted by the next document navigation as page errors.
    await page.waitForLoadState("networkidle");
  }
  // The inline theme script must still apply a saved choice before first paint.
  await page.evaluate(() => localStorage.setItem("portfolio-theme", "dark"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.waitForLoadState("networkidle");
  // Client navigation fetches RSC payloads and must stay within connect-src.
  await page.goto("/");
  await page.locator('a[href="/projects/multi-vendor-e-commerce/"]').first().click();
  await expect(page.locator(".detail-page")).toBeVisible();
  expect(await page.evaluate(() => window.__cspViolations)).toEqual([]);
  expect(errors).toEqual([]);
});
