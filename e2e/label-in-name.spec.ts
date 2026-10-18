import { expect, test } from "@playwright/test";

// WCAG 2.5.3 Label in Name: hydration 後に描画される操作部品も含めて、表示文字をアクセシブルネームに含める
for (const path of ["/", "/profile/", "/projects/comparison-of-llms/"]) {
  test(`interactive controls on ${path} include their visible text in the accessible name`, async ({ page }) => {
    await page.goto(path);
    if (path.startsWith("/projects/")) await expect(page.locator(".project-slideshow button").first()).toBeVisible();
    const mismatches = await page.locator("a[aria-label], button[aria-label], summary[aria-label]").evaluateAll(nodes => nodes.flatMap(node => {
      const clone = node.cloneNode(true) as Element;
      clone.querySelectorAll('[aria-hidden="true"]').forEach(hidden => hidden.remove());
      const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
      const visible = normalize(clone.textContent ?? "");
      const label = normalize(node.getAttribute("aria-label") ?? "");
      return visible && !label.includes(visible) ? [`${visible} -> ${label}`] : [];
    }));
    expect(mismatches).toEqual([]);
  });
}
