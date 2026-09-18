import { expect, test, type Page } from '@playwright/test';

declare global { interface Window { __scrollIntoViewCalls: ScrollIntoViewOptions[]; } }

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
  await page.addInitScript(() => {
    window.__scrollIntoViewCalls = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (this: Element, options?: boolean | ScrollIntoViewOptions) {
      window.__scrollIntoViewCalls.push(options as ScrollIntoViewOptions);
      return original.call(this, options as ScrollIntoViewOptions);
    };
  });
  await page.goto('/');
  await markDocument(page);
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('.hero-actions a')!.click());
  await expect(page.locator('#selected-work h2')).toBeInViewport();
  const normalCall = await page.evaluate(() => window.__scrollIntoViewCalls[0]);
  expect(normalCall).toMatchObject({ behavior: 'smooth', block: 'start' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => { window.__scrollIntoViewCalls.length = 0; });
  await page.locator('a[href="/#work-r01"]').evaluate((el: HTMLAnchorElement) => el.click());
  await expect(page.locator('#work-r01')).toBeFocused();
  await expect(page.locator('#work-r01')).toBeInViewport();
  const reducedMotionCall = await page.evaluate(() => window.__scrollIntoViewCalls[0]);
  expect(reducedMotionCall).toMatchObject({ behavior: 'instant', block: 'start' });
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior)).toBe('auto');
});

test('hero visualizes the portfolio as an automatic 3D system with a static reduced-motion state', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('.hero-scene');
  const world = scene.locator('.hero-scene-world');
  await expect(world).toBeVisible();
  await expect.poll(() => world.evaluate(el => el.getAnimations().some(a => a.playState === 'running'))).toBe(true);
  expect(await world.evaluate(el => getComputedStyle(el).transform)).toMatch(/^matrix3d/);
  await expect(scene.getByRole('button')).toHaveCount(0);
  await expect(scene.locator('img')).toHaveCount(0);
  for (const label of ['BUILD', 'STUDY', 'ENGINEER', 'IMPROVE']) await expect(scene.getByText(label, { exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await world.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(scene).toBeVisible();
});
