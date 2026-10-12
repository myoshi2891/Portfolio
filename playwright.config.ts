import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  webServer: { command: "bun run preview", url: "http://127.0.0.1:4173", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // COOP による about:blank からのブラウジングコンテキスト切替で Playwright が初回 goto の load を見失うため、
    // E2E の Firefox に限り COOP の適用を止める（配信ヘッダー自体は security-headers.spec で検証する）
    { name: "firefox", use: { ...devices["Desktop Firefox"], launchOptions: { firefoxUserPrefs: { "browser.tabs.remote.useCrossOriginOpenerPolicy": false } } } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
