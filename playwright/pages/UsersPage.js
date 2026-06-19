import { BasePage } from "./BasePage.js";
import * as WaitUtils from "../utils/waitUtils.js";

export class UsersPage extends BasePage {
  async openUsers() {
    await this.open("/users");
    await this.waitForTableReady();
  }

  async waitForTableReady() {
    await WaitUtils.invisible(this.page, "users-row-skeleton").catch(() => {});
    const hasTable = await this.testId("users-table").count();
    if (hasTable === 0) {
      await this.el("users-empty-add");
    } else {
      await this.el("users-table");
    }
  }

  async search(query) {
    await this.fillInput("users-search", query);
    await WaitUtils.debounce();
    await this.waitForTableReady();
  }

  async filterByRole(role) {
    await this.selectOptionByValue("users-filter-role", role);
    await this.waitForTableReady();
  }

  async filterByStatus(status) {
    await this.selectOptionByValue("users-filter-status", status);
    await this.waitForTableReady();
  }

  async setPageSize(size) {
    await this.selectOptionByValue("users-page-size", String(size));
    await this.waitForTableReady();
  }

  async sortBy(column) {
    await this.testId(`sort-${column}`).click();
    await this.waitForTableReady();
  }

  async refresh() {
    await this.testId("users-refresh").click();
    await this.waitForTableReady();
  }

  async openCreateModal() {
    await this.testId("users-add").click();
    await this.el("user-form-submit");
  }

  async openEditForUser(userId) {
    await this.testId(`user-edit-${userId}`).click();
    await this.el("user-form-submit");
  }

  async openDetailsForUser(userId) {
    await this.testId(`user-view-${userId}`).click();
    await this.el("details-close");
  }

  async deleteUser(userId) {
    await this.testId(`user-delete-${userId}`).click();
  }

  async selectUser(userId) {
    const checkbox = this.testId(`user-select-${userId}`);
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  async selectAllVisible() {
    const checkbox = this.testId("users-select-all");
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  async bulkDelete() {
    await this.testId("users-bulk-delete").click();
  }

  async nextPage() {
    await this.testId("users-next").click();
    await this.waitForTableReady();
  }

  async previousPage() {
    await this.testId("users-prev").click();
    await this.waitForTableReady();
  }

  async visibleRowCount() {
    return this.page.locator("[data-testid^='user-row-']").count();
  }

  async firstUserId() {
    const testId = await this.page.locator("[data-testid^='user-row-']").first().getAttribute("data-testid");
    return testId?.replace("user-row-", "") ?? null;
  }

  async rowExistsForEmail(email) {
    const content = await this.page.content();
    return content.includes(email);
  }

  async rowExists(userId) {
    return this.isVisible(`user-row-${userId}`);
  }

  async selectedCountText() {
    return (await this.testId("users-selected-count").textContent())?.trim() ?? "";
  }

  async pageText() {
    return (await this.testId("users-page").textContent())?.trim() ?? "";
  }

  async isNextEnabled() {
    return this.testId("users-next").isEnabled();
  }
}
