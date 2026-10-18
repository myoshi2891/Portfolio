import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`study summaries stay readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    // smooth scroll と入場アニメーション中は summary が動き、クリックが外れるため静止状態で検証する
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const studies = page.locator("#studies");
    await expect(studies.locator(".study-card")).toHaveCount(6);
    await expect(studies.locator(".study-summary")).toHaveCount(6);
    await expect(studies.locator("details[open]")).toHaveCount(0);
    for (const heading of await studies.getByRole('heading', { level: 3 }).all()) await expect(heading).toBeVisible();
    await expect(studies.locator(".disclosure")).toHaveCount(0);
    await expect(page.getByText("資料サイトの実装", { exact: true })).toHaveCount(0);
    const management = studies.locator('[data-repository="R09"]');
    await management.scrollIntoViewIfNeeded();
    await expect(management).toContainText("資格・書籍学習ガイド");
    await management.locator('summary').click();
    await expect(management.getByRole("table")).toBeVisible();
    for (const label of ["ガイドカタログ", "サイト内検索", "学習ガイド"]) {
      await expect(management.getByRole("cell", { name: label, exact: true })).toBeVisible();
    }
    for (const grid of await studies.locator(".study-grid").all()) {
      expect(await grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(width >= 960 ? 2 : 1);
    }
    for (const card of await studies.locator(".study-card").all()) {
      await card.scrollIntoViewIfNeeded();
      const copy = await card.locator(".study-copy").boundingBox();
      const visual = await card.locator(".study-visual").boundingBox();
      expect(copy).not.toBeNull();
      expect(visual).not.toBeNull();
      expect(copy!.y).toBeGreaterThanOrEqual(visual!.y + visual!.height);
      if (!(await card.locator('details').getAttribute('open') === '')) await card.locator('summary').click();
      for (const name of ["学習内容", "資料の探し方", "活用方法"]) {
        await expect(card.getByRole("heading", { level: 4, name })).toBeVisible();
      }
      await expect(card.getByRole("table")).toBeVisible();
      expect(await card.getByRole("table").evaluate(element => element.scrollWidth <= element.parentElement!.clientWidth)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await management.getByRole("table").evaluate(element => element.scrollWidth <= element.parentElement!.clientWidth)).toBe(true);
    await studies.locator(".study-card").first().screenshot({ path: test.info().outputPath(`study-${width}.png`) });
    await page.locator('html').evaluate(el => { el.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("all six summaries are included in static HTML", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL ?? "http://127.0.0.1:4173" });
  const page = await context.newPage();
  try {
    await page.goto("/");
    const summaries = page.locator("#studies .study-summary");
    await expect(summaries).toHaveCount(6);
    for (const card of await page.locator('.study-card').all()) {
      await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
      await card.locator('summary').click();
      const summary = card.locator('.study-summary');
      await expect(summary.getByRole("table")).toBeVisible();
      await expect(summary.getByRole("heading", { name: "活用方法" })).toBeVisible();
    }
  } finally { await context.close(); }
});
