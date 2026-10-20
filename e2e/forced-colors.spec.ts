import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Forced colors (e.g. Windows contrast themes) drop author backgrounds and box shadows,
// so state must also be shown by text decoration, borders or system colors.
async function forceColors(page: Page, { rendering = false } = {}) {
  await page.emulateMedia({ forcedColors: 'active' });
  const state = await page.evaluate(() => {
    // Firefox and WebKit match the media query but keep author colors; only Chromium forces them.
    const probe = document.body.appendChild(document.createElement('div'));
    probe.style.backgroundColor = 'rgb(255, 0, 0)';
    const forced = getComputedStyle(probe).backgroundColor !== 'rgb(255, 0, 0)';
    probe.remove();
    return { matches: matchMedia('(forced-colors: active)').matches, forced };
  });
  test.skip(!state.matches, 'This browser does not emulate forced colors.');
  test.skip(rendering && !state.forced, 'This browser does not force colors when emulating the media query.');
}

test('study disclosure marks stay visible in forced colors', async ({ page }) => {
  await page.goto('/');
  await forceColors(page, { rendering: true });
  const mark = page.locator('#study-details-r10-toggle .disclosure-mark');
  const colors = await mark.evaluate(el => ({
    line: getComputedStyle(el, '::before').backgroundColor,
    canvas: getComputedStyle(document.body).backgroundColor,
  }));
  expect(colors.line).not.toBe(colors.canvas);
  expect(colors.line).not.toBe('rgba(0, 0, 0, 0)');
});

test('current page and current section are underlined in forced colors', async ({ page }) => {
  await page.goto('/profile/');
  await forceColors(page);
  const nav = page.locator('.desktop-nav a[aria-current="page"]');
  expect(await nav.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('underline');
  await page.goto('/projects/medical-studies/');
  await forceColors(page);
  const section = page.locator('.detail-contents a[aria-current]');
  await expect(section).toHaveCount(1);
  expect(await section.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('underline');
});

test('buttons keep visible boundaries in forced colors', async ({ page }) => {
  await page.goto('/projects/medical-studies/');
  await forceColors(page, { rendering: true });
  for (const selector of ['.theme-toggle', '.slideshow-toggle']) {
    const border = await page.locator(selector).first().evaluate(el => {
      const style = getComputedStyle(el);
      return { style: style.borderTopStyle, width: parseFloat(style.borderTopWidth) };
    });
    expect(border.style, selector).not.toBe('none');
    expect(border.width, selector).toBeGreaterThan(0);
  }
});

test('pages have no axe violations in forced colors', async ({ page }) => {
  for (const path of ['/', '/profile/', '/projects/medical-studies/']) {
    await page.goto(path);
    await forceColors(page, { rendering: true });
    expect((await new AxeBuilder({ page }).analyze()).violations, path).toEqual([]);
  }
});

test('the sticky header stays opaque in forced colors', async ({ page }) => {
  await page.goto('/projects/medical-studies/');
  await forceColors(page, { rendering: true });
  // Forced colors keep author alpha, so a translucent header would show content scrolling beneath it.
  const background = await page.locator('.masthead').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(background).toMatch(/^rgb\(/);
});
