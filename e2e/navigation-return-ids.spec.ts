import { expect, test, type Page } from '@playwright/test';

async function ready(page: Page) {
  await expect(async () => {
    expect(await page.evaluate(() => Boolean(history.state?.portfolioNavigation))).toBe(true);
  }).toPass({ timeout: 5000 });
}

// Controls that appear after hydration (theme toggle, gallery buttons) must not shift the
// generated IDs that saved focus refers to.
test('history restores focus to the same generated-ID link after an SPA round trip', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  const card = page.locator('[data-repository="R06"] h3 a');
  expect(await card.evaluate(el => el.dataset.navigationId)).toBe('true');
  const href = await card.getAttribute('href');
  await card.focus();
  // element.click() navigates without moving focus, so the saved entry keeps the card link focused.
  await page.locator('.desktop-nav a[href="/profile/"]').evaluate((el: HTMLElement) => el.click());
  await expect(page).toHaveURL(/\/profile\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('href'))).toBe(href);
});

test('generated IDs do not depend on how many controls precede them', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  const card = page.locator('[data-repository="R06"] h3 a');
  const before = await card.getAttribute('id');
  await page.locator('.desktop-nav a[href="/profile/"]').click();
  await expect(page).toHaveURL(/\/profile\/$/);
  await page.goBack();
  await ready(page);
  await expect(card).toHaveAttribute('id', before ?? '');
});
