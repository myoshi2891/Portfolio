import { expect, test } from '@playwright/test';

// Runs only on the touch device project: taps instead of mouse clicks, at a high pixel ratio.

test('menu opens and navigates by tap', async ({ page }) => {
  await page.goto('/projects/medical-studies/');
  const menu = page.locator('.mobile-menu');
  await menu.locator('summary').tap();
  await expect(menu).toHaveAttribute('open', '');
  await page.getByRole('navigation', { name: 'モバイルナビゲーション' }).getByRole('link', { name: 'プロフィール' }).tap();
  await expect(page).toHaveURL(/\/profile\/$/);
  await expect(menu).not.toHaveAttribute('open', '');
});

test('gallery pauses and advances by tap', async ({ page }) => {
  await page.goto('/projects/medical-studies/');
  const gallery = page.locator('.project-slideshow');
  await gallery.getByRole('button', { name: 'スライドショーを一時停止' }).tap();
  await expect(gallery.getByRole('button', { name: 'スライドショーを再生' })).toBeVisible();
  const position = gallery.locator('figcaption span');
  const before = Number((await position.textContent())?.split('/')[0]);
  const total = Number((await position.textContent())?.split('/')[1]);
  await gallery.getByRole('button', { name: '次へ（次のスライド）' }).tap();
  await expect(position).toHaveText(`${before % total + 1} / ${total}`);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveJSProperty('complete', true);
});

test('page contents jump to a section by tap', async ({ page }) => {
  await page.goto('/projects/medical-studies/');
  const contents = page.getByRole('navigation', { name: 'このページの内容' });
  const link = contents.getByRole('link').last();
  const id = (await link.getAttribute('href'))?.replace(/^.*#/, '');
  if (!id) throw new Error('Contents link has no fragment');
  await link.tap();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect(page.locator(`#${id}`)).toBeInViewport();
  await expect(link).toHaveAttribute('aria-current', 'location');
});
