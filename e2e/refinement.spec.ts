import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("pending anchor layout never takes focus back from the next control", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => Boolean(history.state?.portfolioNavigation))).toBe(true);
  await page.evaluate(async () => {
    document.querySelector<HTMLAnchorElement>('.skip-link')!.click();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    document.querySelector<HTMLElement>('#more-studies > summary')!.focus();
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  await expect(page.locator('#more-studies > summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#more-studies')).toHaveAttribute('open', '');
});

test("detail contents follow scrolling and anchor selection", async ({ page }) => {
  await page.goto('/projects/comparison-of-llms/');
  const contents = page.getByRole('navigation', { name: 'このページの内容' });
  await contents.getByRole('link', { name: 'アーキテクチャ' }).click();
  await expect(contents.locator('[aria-current="location"]')).toHaveAttribute('href', '#architecture');
  await page.locator('#quality').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelector('#quality')!.scrollIntoView());
  await expect(contents.locator('[aria-current="location"]')).toHaveAttribute('href', '#quality');
});

test("mobile menu and reading cards remain usable in both color schemes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects/comparison-of-llms/');
  const menu = page.locator('.mobile-menu');
  await menu.locator('summary').click();
  await expect(menu.getByRole('link', { name: '学習', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  const row = page.locator('.reading-table tbody tr').first();
  const cells = row.locator('th, td');
  const first = await cells.nth(0).boundingBox();
  const second = await cells.nth(1).boundingBox();
  expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height - 1);
  expect(await cells.nth(1).evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(13.6);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

test('screen previews decode and use responsive local images', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('[data-repository="R06"] .screen-preview img').first();
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(await image.evaluate((el: HTMLImageElement) => el.currentSrc)).toMatch(/\/images\/optimized\/r06-\d+\.webp$/);
  await page.locator('#more-studies-toggle').click();
  for (const preview of await page.locator('.screen-preview img').all()) {
    await preview.scrollIntoViewIfNeeded();
    await expect.poll(() => preview.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});
