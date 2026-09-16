import { expect, test } from "@playwright/test";

test("intro settles, replay restarts, and reduced motion keeps all content visible", async ({ page }) => {
  await page.goto("/");
  const stack = page.locator(".layer-stack");
  await expect.poll(() => stack.evaluate(el => el.getAnimations().every(a => a.playState === "finished")), { timeout: 7000 }).toBe(true);
  await page.getByRole("button", { name: "立体アニメーションを再生" }).click();
  expect(await stack.evaluate(el => el.getAnimations().some(a => a.playState === "running"))).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "立体アニメーションを再生" })).toBeHidden();
  expect(await stack.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "制作を見る", exact: true }).first()).toBeVisible();
});
