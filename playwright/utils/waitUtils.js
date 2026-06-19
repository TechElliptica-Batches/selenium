import { EXPLICIT_WAIT_SECONDS } from "../config/config.js";

/** @param {import('@playwright/test').Page} page */
export function timeoutMs(seconds = EXPLICIT_WAIT_SECONDS) {
  return seconds * 1000;
}

/** @param {import('@playwright/test').Page} page */
export function locator(page, testId) {
  return page.getByTestId(testId);
}

/** @param {import('@playwright/test').Page} page */
export async function visible(page, testId, options = {}) {
  const ms = options.timeout ?? timeoutMs();
  await locator(page, testId).waitFor({ state: "visible", timeout: ms });
  return locator(page, testId);
}

/** @param {import('@playwright/test').Page} page */
export async function invisible(page, testId, options = {}) {
  const ms = options.timeout ?? timeoutMs();
  await locator(page, testId).waitFor({ state: "hidden", timeout: ms });
}

export async function debounce(ms = 500) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
