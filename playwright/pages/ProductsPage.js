import { BasePage } from "./BasePage.js";
import * as WaitUtils from "../utils/waitUtils.js";

export class ProductsPage extends BasePage {
  async openProducts() {
    await this.open("/products");
    await this.waitForGridReady();
  }

  async waitForGridReady() {
    await WaitUtils.invisible(this.page, "product-card-skeleton").catch(() => {});
    const hasGrid = await this.testId("products-grid").count();
    if (hasGrid === 0) {
      await this.page.getByText("No products found").waitFor({ state: "visible" }).catch(() => {});
    } else {
      await this.el("products-grid");
    }
  }

  async search(query) {
    await this.fillInput("products-search", query);
    await WaitUtils.debounce();
    await this.waitForGridReady();
  }

  async filterByStatus(status) {
    await this.selectOptionByValue("products-filter-status", status);
    await this.waitForGridReady();
  }

  async sortBy(optionValue) {
    await this.selectOptionByValue("products-sort", optionValue);
    await this.waitForGridReady();
  }

  async setPageSize(size) {
    await this.selectOptionByValue("products-page-size", String(size));
    await this.waitForGridReady();
  }

  async refresh() {
    await this.testId("products-refresh").click();
    await this.waitForGridReady();
  }

  async toggleProduct(productId) {
    await this.testId(`product-toggle-${productId}`).click();
    await WaitUtils.invisible(this.page, "products-saving").catch(() => {});
  }

  async nextPage() {
    await this.testId("products-next").click();
    await this.waitForGridReady();
  }

  async visibleCardCount() {
    const cards = this.page.locator("[data-testid^='product-card-']");
    const count = await cards.count();
    let visible = 0;
    for (let i = 0; i < count; i++) {
      const id = await cards.nth(i).getAttribute("data-testid");
      if (id && id !== "product-card-skeleton") visible++;
    }
    return visible;
  }

  async firstProductId() {
    const cards = this.page.locator("[data-testid^='product-card-']");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const id = await cards.nth(i).getAttribute("data-testid");
      if (id && id !== "product-card-skeleton") {
        return id.replace("product-card-", "");
      }
    }
    return null;
  }

  async selectedCountText() {
    return (await this.testId("products-selected-count").textContent())?.trim() ?? "";
  }

  async productToggleText(productId) {
    return (await this.testId(`product-toggle-${productId}`).textContent())?.trim() ?? "";
  }

  async pageText() {
    return (await this.testId("products-page").textContent())?.trim() ?? "";
  }

  async isNextEnabled() {
    return this.testId("products-next").isEnabled();
  }
}
