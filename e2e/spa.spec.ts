import { expect, test, type Page } from '@playwright/test';

async function markDocument(page: Page) {
  await expect.poll(() => page.evaluate(() => Boolean(history.state?.portfolioNavigation))).toBe(true);
  await page.evaluate(() => { document.documentElement.dataset.spaDocument = 'retained'; });
}

test('project, next work, breadcrumb and header links retain the document', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await markDocument(page);
  await page.locator('a[href="/projects/multi-vendor-e-commerce/"]').first().click();
  await expect(page.locator('.detail-page')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-spa-document', 'retained');
  await page.getByRole('link', { name: '次の制作を見る' }).click();
  await expect(page).toHaveURL(/comparison-of-llms/);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.locator('html')).toHaveAttribute('data-spa-document', 'retained');
  await page.getByRole('navigation', { name: 'パンくず' }).getByRole('link', { name: '代表的な制作' }).click();
  await expect(page.locator('#work-r06')).toBeInViewport();
  await expect(page.locator('html')).toHaveAttribute('data-spa-document', 'retained');
  await page.goBack();
  await expect(page.locator('.detail-page')).toBeVisible();
  await page.getByRole('navigation', { name: 'メインナビゲーション' }).getByRole('link', { name: '学習', exact: true }).click();
  await expect(page.locator('#studies h2')).toBeInViewport();
  await expect(page.locator('html')).toHaveAttribute('data-spa-document', 'retained');
  expect(errors).toEqual([]);
});

test('mobile navigation and 404 recovery use client navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects/medical-studies/');
  await markDocument(page);
  await page.locator('.mobile-menu summary').click();
  await page.getByRole('navigation', { name: 'モバイルナビゲーション' }).getByRole('link', { name: 'プロフィール' }).click();
  await expect(page.locator('#about h2')).toBeInViewport();
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('html')).toHaveAttribute('data-spa-document', 'retained');
  await page.goto('/missing-page/');
  await markDocument(page);
  await page.getByRole('link', { name: 'トップページに戻る' }).click();
  await expect(page.locator('#top')).toBeInViewport();
  await expect(page.locator('html')).toHaveAttribute('data-spa-document', 'retained');
});

test('home anchor moves through intermediate positions and reduced motion is immediate', async ({ page }) => {
  await page.goto('/');
  await markDocument(page);
  const positions = await page.evaluate(async () => {
    const values: number[] = [];
    document.querySelector<HTMLAnchorElement>('.hero-actions a')!.click();
    for (let i = 0; i < 12; i++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      values.push(window.scrollY);
    }
    return values;
  });
  expect(new Set(positions.map(Math.round)).size).toBeGreaterThan(2);
  await expect(page.locator('#selected-work h2')).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('a[href="/#work-r01"]').evaluate((el: HTMLAnchorElement) => el.click());
  await expect(page.locator('#work-r01')).toBeFocused();
  await expect(page.locator('#work-r01')).toBeInViewport();
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior)).toBe('auto');
});

test('hero has a pausable 3D animation and a static reduced-motion preview', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('.hero-scene');
  const plane = scene.locator('.hero-scene-plane');
  await expect(plane).toBeVisible();
  await expect.poll(() => plane.evaluate(el => el.getAnimations().some(a => a.playState === 'running'))).toBe(true);
  expect(await plane.evaluate(el => getComputedStyle(el).transform)).toMatch(/^matrix3d/);
  const pause = page.getByRole('button', { name: '3Dアニメーションを停止' });
  await pause.click();
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
  expect(await plane.evaluate(el => el.getAnimations().every(a => a.playState === 'paused'))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await plane.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(scene.locator('img')).toBeVisible();
});
