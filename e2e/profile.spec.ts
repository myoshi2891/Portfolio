import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const mobile of [false, true]) {
  for (const theme of ["light", "dark"] as const) {
    test(`profile navigation and layout: ${mobile ? "mobile" : "desktop"}, ${theme}`, async ({ page }) => {
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
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Xでフォロー", exact: false })).toBeFocused();
      await page.goBack();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("heading", { name: "学びを、仕組みにする。" })).toBeVisible();
      await page.goto("/profile/");
      await expect(page.getByRole("heading", { name: "資格", exact: true })).toBeVisible();
    });
  }
}
