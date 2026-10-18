import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`home composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const fontSize of ['100%', '200%']) {
      await page.locator('html').evaluate((el, size) => { el.style.fontSize = size; }, fontSize);
      const boxes = await page.locator('.hero-scene-node, .hero-scene-core').evaluateAll(els => els.map(el => {
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x, y, width, height };
      }));
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]!, b = boxes[j]!;
          expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y, `sculpture labels ${i}/${j} at ${fontSize}`).toBe(true);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.locator('html').evaluate(el => { el.style.fontSize = '100%'; });
    const project = page.locator('.project-row').first();
    const visual = await project.locator('.project-visual').boundingBox();
    const copy = await project.locator('.project-copy').boundingBox();
    if (width >= 960) expect(copy!.x).toBeGreaterThanOrEqual(visual!.x + visual!.width);
    else expect(copy!.y).toBeGreaterThanOrEqual(visual!.y + visual!.height);
    for (const image of await page.locator('.screen-preview img, .contact-logo').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: test.info().outputPath(`home-${width}-light.png`), fullPage: true });
    if (width === 390 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.screenshot({ path: test.info().outputPath(`home-${width}-dark.png`), fullPage: true });
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  });
}
