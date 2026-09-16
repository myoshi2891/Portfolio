import { expect, test } from "@playwright/test";

test("intro settles and reduced motion keeps the real screen preview visible", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator('.hero-copy');
  await expect.poll(() => hero.evaluate(el => el.getAnimations().every(a => a.playState === 'finished'))).toBe(true);
  await expect(page.locator('.hero-preview img')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await hero.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: '制作を見る', exact: true }).first()).toBeVisible();
});
