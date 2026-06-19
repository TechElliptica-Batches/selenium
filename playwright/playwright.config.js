import { defineConfig, devices } from "@playwright/test";
import { BASE_URL, BROWSER, EXPLICIT_WAIT_SECONDS, HEADLESS } from "./config/config.js";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ...(process.env.CI ? [["junit", { outputFile: "test-results/junit-results.xml" }]] : [])
  ],
  timeout: 60_000,
  expect: { timeout: EXPLICIT_WAIT_SECONDS * 1000 },
  use: {
    baseURL: BASE_URL,
    headless: HEADLESS,
    viewport: { width: 1440, height: 900 },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: EXPLICIT_WAIT_SECONDS * 1000,
    navigationTimeout: 30_000
  },
  globalSetup: "./global-setup.js",
  projects: [
    {
      name: BROWSER,
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
