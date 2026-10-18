import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const mobile of [false, true]) {
  for (const theme of ["light", "dark"] as const) {
    test(`profile navigation and layout: ${mobile ? "mobile" : "desktop"}, ${theme}`, async ({ page, browserName }) => {
      await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 });
      await page.goto("/");
      if (mobile) await page.locator(".mobile-menu summary").click();
      const nav = page.getByRole("navigation", { name: mobile ? "モバイルナビゲーション" : "メインナビゲーション", exact: true });
      await nav.getByRole("link", { name: "プロフィール", exact: true }).click();
      await expect(page).toHaveURL(/\/profile\/$/);
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
      await expect(page.getByRole("heading", { name: "プロフィール", exact: true })).toBeVisible();
      await expect(page.locator(".profile-certifications li")).toHaveCount(8);
      await expect(page.locator(".profile-certification-description")).toHaveCount(8);
      await expect(page.locator(".profile-certifications time")).toHaveCount(0);
      await expect.poll(() => page.locator(".profile-portrait img").evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.getByRole("link", { name: "GitHubでフォロー", exact: false }).focus();
      await expect(page.getByRole("link", { name: "GitHubでフォロー", exact: false })).toBeFocused();
      // macOS WebKit uses Option-Tab to include links in keyboard navigation.
      await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
      await expect(page.getByRole("link", { name: "Xでフォロー", exact: false })).toBeFocused();
      await page.goBack();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("heading", { name: "学びを、仕組みにする。" })).toBeVisible();
      await page.goto("/profile/");
      await expect(page.getByRole("heading", { name: "保有資格・スコア", exact: true })).toBeVisible();
    });
  }
}

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`profile remains readable at ${width}px and 200% text size`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/profile/");
    await page.evaluate(() => document.fonts.ready);
    for (const fontSize of ["100%", "200%"]) {
      await page.locator("html").evaluate((el, size) => { el.style.fontSize = size; }, fontSize);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const boxes = await page.locator(".profile-copy, .profile-portrait").evaluateAll(elements => elements.map(el => {
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x, y, width, height };
      }));
      const [copy, portrait] = boxes;
      if (!copy || !portrait) throw new Error("Profile introduction or portrait is missing.");
      if (width >= 768) expect(portrait.x).toBeGreaterThanOrEqual(copy.x + copy.width);
      else expect(portrait.y).toBeGreaterThanOrEqual(copy.y + copy.height);
      expect(await page.locator(".profile-social-card, .profile-certifications li, .profile-learning-link").evaluateAll(elements => elements.every(el => el.scrollWidth <= el.clientWidth + 1))).toBe(true);
      for (const heading of await page.locator(".profile-certifications h3").all()) await expect(heading).toBeVisible();
    }
  });
}

test("profile anchors keep the destination below the header and preserve return navigation", async ({ page }) => {
  await page.goto("/profile/");
  await page.getByRole("link", { name: "保有資格・スコアへ" }).click();
  await expect(page).toHaveURL(/\/profile\/#certifications$/);
  await expect.poll(async () => {
    const heading = await page.getByRole("heading", { name: "保有資格・スコア", exact: true }).boundingBox();
    const header = await page.locator(".masthead").boundingBox();
    return !!heading && !!header && heading.y >= header.y + header.height && heading.y < 900;
  }).toBe(true);
  await page.goBack();
  await expect(page).toHaveURL(/\/profile\/$/);
  await page.getByRole("link", { name: "制作を見る", exact: true }).click();
  await expect(page).toHaveURL(/\/#selected-work$/);
  await expect(page.locator("#selected-work")).toBeInViewport();
});

test("profile motion settles and respects reduced motion while scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/profile/");
  const profile = page.locator(".profile-page");
  await expect.poll(() => profile.evaluate(el => el.getAnimations({ subtree: true }).every(animation => animation.playState === "finished"))).toBe(true);
  await page.locator(".profile-certifications li").last().scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => profile.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.locator(".profile-certifications li").last()).toBeVisible();
  await page.locator(".profile-learning-link").scrollIntoViewIfNeeded();
  expect(await profile.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.getByRole("link", { name: "LeetCodeを見る" })).toBeVisible();
});

test.describe("profile without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("shows all content and supports the qualification anchor", async ({ page }) => {
    await page.goto("/profile/");
    await expect(page.getByRole("heading", { name: "プロフィール", exact: true })).toBeVisible();
    await expect(page.locator(".profile-certifications li")).toHaveCount(8);
    // CSS motion still runs without JavaScript; let the link settle before clicking.
    await expect.poll(() => page.locator(".profile-actions").evaluate(el => el.getAnimations().every(animation => animation.playState === "finished"))).toBe(true);
    await page.getByRole("link", { name: "保有資格・スコアへ" }).click();
    await expect(page.locator("#certifications")).toBeInViewport();
    await expect(page.getByRole("link", { name: "GitHubでフォロー" })).toHaveAttribute("href", "https://github.com/myoshi2891");
    await expect(page.getByRole("link", { name: "Xでフォロー" })).toHaveAttribute("href", "https://x.com/myoshi2891");
    await expect(page.getByRole("link", { name: "LeetCodeを見る" })).toBeVisible();
  });
});
