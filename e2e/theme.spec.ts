import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/projects/multi-vendor-e-commerce/", "/projects/comparison-of-llms/", "/projects/medical-studies/", "/projects/the-wild-oasis-for-admin/", "/projects/unknown/"];

test("a saved color choice overrides the OS and persists across all screens and reloads", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "ライトモードに切り替える" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("portfolio-theme"))).toBe("light");
  for (const path of paths) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "ダークモードに切り替える" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await page.locator("html").evaluate(element => getComputedStyle(element).colorScheme)).toBe("light");
    expect(await page.locator("body").evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(247, 248, 250)");
  }
  await page.getByRole("button", { name: "ダークモードに切り替える" }).press("Enter");
  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  await expect(page.getByRole("button", { name: "ライトモードに切り替える" })).toBeVisible();
  expect(await page.locator("body").evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(13, 20, 32)");
  expect(errors).toEqual([]);
});

test("a choice survives client navigation and browser back", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "ライトモードに切り替える" }).click();
  await page.locator('a[href="/projects/comparison-of-llms/"]').first().click();
  await expect(page).toHaveURL(/\/projects\/comparison-of-llms\/?$/);
  await expect(page.getByRole("button", { name: "ダークモードに切り替える" })).toBeVisible();
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "ダークモードに切り替える" })).toBeVisible();
});

test("unselected mode follows the OS and the toggle remains usable when storage is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", { value() { throw new Error("storage denied"); } });
    Object.defineProperty(Storage.prototype, "setItem", { value() { throw new Error("storage denied"); } });
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "ダークモードに切り替える" })).toBeVisible();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.getByRole("button", { name: "ライトモードに切り替える" })).toBeVisible();
  await page.getByRole("button", { name: "ライトモードに切り替える" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("the theme control synchronizes an explicit choice between tabs", async ({ context, page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/projects/medical-studies/");
  await expect(other.locator(".theme-toggle")).toHaveJSProperty("tagName", "BUTTON");
  await page.getByRole("button", { name: "ダークモードに切り替える" }).click();
  await expect(other.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(other.getByRole("button", { name: "ライトモードに切り替える" })).toBeVisible();
});

test("the toggle fits narrow and enlarged headers and is accessible in both modes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/projects/medical-studies/");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const fontSize of ["100%", "200%"]) {
      await page.evaluate(value => { document.documentElement.style.fontSize = value; }, fontSize);
      const toggle = page.locator("button.theme-toggle");
      await expect(toggle).toBeVisible();
      const box = await toggle.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(await page.locator("html").evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = "100%"; });
  await page.getByRole("button", { name: "ライトモードに切り替える" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "ダークモードに切り替える" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
