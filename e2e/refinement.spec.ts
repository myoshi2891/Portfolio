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

test("LLM Studies gallery slides horizontally and provides an autoplay control", async ({ page }) => {
  await page.clock.install();
  await page.goto('/projects/comparison-of-llms/');
  const gallery = page.locator('.project-slideshow');
  const track = gallery.locator('.slideshow-track');
  const initialTransform = await track.evaluate(element => getComputedStyle(element).transform);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveAttribute('src', /cost-calculator-overview\.png$/);
  const viewportBox = await gallery.locator('.slideshow-viewport').boundingBox();
  const activeBox = await gallery.locator('.slideshow-slide').nth(1).boundingBox();
  const previousBox = await gallery.locator('.slideshow-slide').nth(0).boundingBox();
  const nextBox = await gallery.locator('.slideshow-slide').nth(2).boundingBox();
  expect(activeBox!.x).toBeGreaterThan(viewportBox!.x);
  expect(previousBox!.x + previousBox!.width).toBeGreaterThan(viewportBox!.x);
  expect(nextBox!.x).toBeLessThan(viewportBox!.x + viewportBox!.width);
  const toggle = gallery.getByRole('button', { name: 'スライドショーを一時停止' });
  await expect(toggle).toBeVisible();
  await toggle.focus();
  await page.clock.fastForward(5100);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveAttribute('src', /cost-calculator-overview\.png$/);
  await toggle.press('Enter');
  await page.keyboard.press('Tab');
  await page.clock.fastForward(5100);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveAttribute('src', /cost-calculator-overview\.png$/);
  await gallery.getByRole('button', { name: 'スライドショーを再生' }).click();
  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
  await page.clock.fastForward(5100);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveAttribute('src', /claude-code-spec-driven-development-guide\.png$/);
  await expect.poll(() => track.evaluate(element => getComputedStyle(element).transform)).not.toBe(initialTransform);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.fastForward(5100);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveAttribute('src', /claude-code-spec-driven-development-guide\.png$/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.fastForward(5100);
  await expect(gallery.locator('.slideshow-slide.is-active img')).toHaveAttribute('src', /antigravity-agent-skills-guide\.png$/);
});

test("LLM Studies gallery slides are reachable with previous and next buttons under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/comparison-of-llms/');
  const gallery = page.locator('.project-slideshow');
  const activeImage = gallery.locator('.slideshow-slide.is-active img');
  await gallery.getByRole('button', { name: '前のスライド' }).press('Enter');
  await expect(activeImage).toHaveAttribute('src', /whats-new-guides\.png$/);
  await expect(gallery.locator('figcaption')).toContainText('9 / 9');
  await gallery.getByRole('button', { name: '次のスライド' }).press('Enter');
  await gallery.getByRole('button', { name: '次のスライド' }).press('Enter');
  await expect(activeImage).toHaveAttribute('src', /claude-code-spec-driven-development-guide\.png$/);
  await expect(gallery.locator('figcaption')).toContainText('2 / 9');
});

test("wrapped masthead height offsets anchors and sticky contents", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('/projects/comparison-of-llms/');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.getByRole('navigation', { name: 'このページの内容' }).getByRole('link', { name: 'アーキテクチャ' }).click();
  await expect.poll(() => page.locator('.masthead').evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(75);
  const masthead = await page.locator('.masthead').boundingBox();
  const heading = await page.locator('#architecture').boundingBox();
  const contents = await page.locator('.detail-contents').boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(masthead!.y + masthead!.height);
  expect(contents!.y).toBeGreaterThanOrEqual(masthead!.y + masthead!.height);
});

test("LLM Studies copy uses the available detail width before wrapping", async ({ page }) => {
  await page.goto('/projects/comparison-of-llms/');
  const heroLead = await page.locator('.detail-header .hero-lead').boundingBox();
  const intro = await page.locator('#features > .section-intro').boundingBox();
  const section = await page.locator('#features').boundingBox();
  expect(heroLead!.width).toBeGreaterThan(900);
  expect(Math.abs(intro!.width - section!.width)).toBeLessThan(2);
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
