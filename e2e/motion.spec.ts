import { expect, test } from "@playwright/test";

test("intro settles and reduced motion keeps the portfolio scene visible", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator('.hero-copy');
  await expect.poll(() => hero.evaluate(el => el.getAnimations({ subtree: true }).every(a => a.playState === 'finished'))).toBe(true);
  await expect(page.locator('.hero-scene-world')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await hero.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: '制作を見る', exact: true }).first()).toBeVisible();
});

test('sculpture can be paused, stays paused offscreen, and resumes only when requested', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('.hero-scene');
  const core = scene.locator('.hero-scene-core');
  await expect(scene).toHaveAttribute('data-active', 'true');
  await scene.getByRole('button', { name: '立体図のアニメーションを一時停止' }).click();
  await expect(scene).toHaveAttribute('data-active', 'false');
  await expect(scene.getByRole('button', { name: '立体図のアニメーションを再生' })).toHaveAttribute('aria-pressed', 'true');
  expect(await core.evaluate(el => el.getAnimations().every(a => a.playState === 'paused'))).toBe(true);
  await page.locator('#studies').scrollIntoViewIfNeeded();
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-active', 'false');
  await scene.getByRole('button', { name: '立体図のアニメーションを再生' }).click();
  await expect(scene).toHaveAttribute('data-active', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(scene).toHaveAttribute('data-active', 'false');
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(scene).toHaveAttribute('data-active', 'true');
  await page.locator('#studies').scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-active', 'false');
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-active', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scene).toHaveAttribute('data-active', 'false');
  await expect(scene.getByRole('button')).not.toBeVisible();
});

test('mobile sculpture is static and content remains visible after reduced motion changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-active', 'false');
  expect(await page.locator('.hero-scene-core').evaluate(el => el.getAnimations().length)).toBe(0);
  await page.locator('.study-card').last().scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.study-card').last().evaluate(el => el.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  await expect(page.locator('.study-card').last()).toBeVisible();
});
