import { chromium, expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  // Firefox can replace the execution context while a history traversal settles.
  // Retry the read as well as the assertion, with a bounded readiness deadline.
  await expect(async () => {
    expect(await page.evaluate(() => Boolean(history.state?.portfolioNavigation))).toBe(true);
  }).toPass({ timeout: 5000 });
}

test("shared hidden anchors open without stealing focus; same hash can be selected again", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (...args) {
      document.documentElement.dataset.scriptFocus = this.id;
      return original.apply(this, args);
    };
  });
  await page.goto("/#study-r10");
  await ready(page);
  await expect(page.locator("#study-r10")).toBeInViewport();
  // Native fragment focus is allowed; application code must not force it on arrival.
  expect(await page.locator("html").getAttribute("data-script-focus")).toBeNull();
  await page.locator("#more-studies-toggle").click();
  await page.getByRole("link", { name: "Cloud", exact: false }).click();
  await expect(page.locator("#study-r10")).toBeFocused();
  await expect(page.locator("#study-r10")).toBeInViewport();
});

test("anchor history restores closed state, scroll and focus independently of the hash", async ({ page }) => {
  await page.goto("/"); await ready(page);
  await page.getByRole("link", { name: "Cloud", exact: false }).click();
  await page.locator("#more-studies-toggle").click();
  await expect(page.locator("#more-studies")).not.toHaveAttribute("open", "");
  await page.locator("#more-studies-toggle").focus();
  await page.evaluate(() => window.scrollBy(0, -100));
  const y = await page.evaluate(() => window.scrollY);
  // Synthetic activation avoids Playwright scrolling the departing link into view.
  await page.locator('a[href="/#work-r01"]').evaluate((el: HTMLAnchorElement) => el.click());
  await expect(page.locator("#work-r01")).toBeFocused();
  expect(await page.evaluate(() => history.state.portfolioNavigation.focusId)).toBe("work-r01");
  await page.goBack();
  await expect(page).toHaveURL(/#study-r10$/);
  await expect(page.locator("#more-studies")).not.toHaveAttribute("open", "");
  await expect(page.locator("#more-studies-toggle")).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(y, -1);
  await page.goForward();
  await expect(page.locator("#work-r01")).toBeFocused();
});

test("detail round trip and reload restore expanded notes and a return focus", async ({ page }) => {
  await page.goto("/"); await ready(page);
  await page.locator("#more-studies-toggle").click();
  await page.locator("#note-r10-toggle").click();
  await page.locator("#github-r10").focus();
  const y = await page.evaluate(() => window.scrollY);
  await page.locator('a[href="/projects/multi-vendor-e-commerce/"]').first().evaluate((el: HTMLAnchorElement) => el.click());
  await expect(page).toHaveURL(/projects\/multi-vendor-e-commerce\/$/);
  await page.goBack(); await ready(page);
  await expect(page.locator("#more-studies")).toHaveAttribute("open", "");
  await expect(page.locator("#note-r10")).toHaveAttribute("open", "");
  await expect(page.locator("#github-r10")).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(y, -1);
  await page.reload(); await ready(page);
  await expect(page.locator("#note-r10")).toHaveAttribute("open", "");
  await expect(page.locator("#github-r10")).toBeFocused();
});

for (const mode of ["denied", "corrupt"] as const) {
  test(`navigation works with ${mode} storage and unknown fragments`, async ({ page }) => {
    await page.addInitScript(mode => {
      if (mode === "denied") Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("denied", "SecurityError"); } });
      else sessionStorage.setItem("portfolio.navigation.v1", "{invalid");
    }, mode);
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    await page.goto("/#%E0%A4%A"); await ready(page);
    await page.getByRole("link", { name: "Cloud", exact: false }).click();
    await expect(page.locator("#study-r10")).toBeFocused();
    await page.reload(); await ready(page);
    await expect(page.locator("#study-r10")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("persisted pageshow preserves restored DOM and keeps router state", async ({ page }) => {
  await page.goto("/"); await ready(page);
  await page.evaluate(() => history.replaceState({ ...history.state, sentinel: "keep" }, ""));
  await page.locator("#more-studies-toggle").click();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expect(page.locator("#more-studies")).toHaveAttribute("open", "");
  expect(await page.evaluate(() => history.state.sentinel)).toBe("keep");
});

test("actual Chromium BFCache restores the document and its disclosures", async ({ browserName }, testInfo) => {
  test.skip(browserName !== "chromium", "The explicit BFCache launch configuration is Chromium-specific.");
  const browser = await chromium.launch({ channel: "chromium", ignoreDefaultArgs: ["--disable-back-forward-cache"] });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.addEventListener("pageshow", e => { document.documentElement.dataset.persisted = String(e.persisted); });
    });
    await page.goto("http://127.0.0.1:4173/"); await ready(page);
    await page.locator("#more-studies-toggle").click();
    await page.locator("#note-r10-toggle").click();
    await page.locator("#github-r10").focus();
    await page.locator('a[href="/projects/multi-vendor-e-commerce/"]').first().evaluate((el: HTMLAnchorElement) => el.click());
    await expect(page).toHaveURL(/projects\/multi-vendor-e-commerce\/$/);
    await page.goBack();
    await expect(page.locator("html")).toHaveAttribute("data-persisted", "true");
    await expect(page.locator("#more-studies")).toHaveAttribute("open", "");
    await expect(page.locator("#note-r10")).toHaveAttribute("open", "");
    await expect(page.locator("#github-r10")).toBeFocused();
    testInfo.annotations.push({ type: "BFCache", description: "Actual pageshow.persisted=true confirmed" });
  } finally { await browser.close(); }
});
