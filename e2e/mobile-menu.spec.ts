import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/profile/');
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
});

test('mobile menu closes when tapping outside it', async ({ page }) => {
  // 開いたパネルは見出しに重なるため、パネルより下の余白を押す
  const panel = await page.getByRole('navigation', { name: 'モバイルナビゲーション' }).boundingBox();
  if (!panel) throw new Error('Mobile navigation panel is not visible');
  await page.mouse.click(8, panel.y + panel.height + 40);
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
});

test('mobile menu stays open when tapping inside its panel', async ({ page }) => {
  await page.getByRole('navigation', { name: 'モバイルナビゲーション' }).click({ position: { x: 4, y: 4 } });
  await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
});

test('mobile menu closes when focus moves outside it', async ({ page }) => {
  await page.getByRole('navigation', { name: 'モバイルナビゲーション' }).getByRole('link', { name: '学習' }).focus();
  await page.locator('.masthead .wordmark').focus();
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
});

test('mobile menu marks the current page', async ({ page }) => {
  const current = page.getByRole('navigation', { name: 'モバイルナビゲーション' }).locator('[aria-current="page"]');
  await expect(current).toHaveText('プロフィール');
});
