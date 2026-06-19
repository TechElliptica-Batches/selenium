import { BASE_URL } from "../config/config.js";
import * as WaitUtils from "../utils/waitUtils.js";

export class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async open(path = "/") {
    await this.page.goto(path);
  }

  testId(id) {
    return this.page.getByTestId(id);
  }

  async el(testId, options = {}) {
    return WaitUtils.visible(this.page, testId, options);
  }

  async clearStorage() {
    await this.open("/login");
    await this.page.evaluate(() => localStorage.clear());
  }

  async fillInput(testId, value) {
    const input = await this.el(testId);
    await input.fill(value);
  }

  async selectOptionByValue(testId, value) {
    await this.testId(testId).selectOption(value);
  }

  async isVisible(testId) {
    return this.testId(testId).isVisible();
  }

  fullUrl(path) {
    return `${BASE_URL.replace(/\/$/, "")}${path}`;
  }
}
