import { expect, test } from '@playwright/test';

test('print hides navigation and interactive controls on Home', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });
  for (const selector of ['.masthead', '.footer nav', '.scene-toggle', '.hero-actions']) {
    await expect(page.locator(selector).first(), selector).toBeHidden();
  }
  await expect(page.getByRole('heading', { level: 2, name: '代表的な制作' })).toBeVisible();
});

test('print shows closed study disclosures without changing their open state', async ({ page }) => {
  await page.goto('/');
  const details = page.locator('#study-details-r10');
  await expect(details).not.toHaveAttribute('open', '');
  await page.emulateMedia({ media: 'print' });
  await expect(details.locator('.study-summary')).toBeVisible();
  await expect(details).not.toHaveAttribute('open', '');
});

test('print appends the destination of external links', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });
  const link = page.locator('#github-r10');
  const href = await link.getAttribute('href');
  const after = await link.evaluate(el => getComputedStyle(el, '::after').content);
  expect(after).toContain(href);
  const internal = await page.locator('a[href="/profile/"]').first().evaluate(el => getComputedStyle(el, '::after').content);
  expect(internal).not.toContain('/profile/');
});

test('print hides gallery controls and page contents on project details', async ({ page }) => {
  await page.goto('/projects/medical-studies/');
  await page.emulateMedia({ media: 'print' });
  for (const selector of ['.slideshow-toggle', '.slideshow-dots', '.detail-contents']) {
    await expect(page.locator(selector).first(), selector).toBeHidden();
  }
  await expect(page.locator('.project-slideshow figcaption')).toBeVisible();
});

test('print uses the light palette even when the dark theme is active', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.emulateMedia({ media: 'print', colorScheme: 'dark' });
  const colors = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return { color: style.color, background: style.backgroundColor };
  });
  expect(colors).toEqual({ color: 'rgb(32, 36, 44)', background: 'rgb(255, 255, 255)' });
});
