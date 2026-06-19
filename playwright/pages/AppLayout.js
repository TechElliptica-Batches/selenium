import { BasePage } from "./BasePage.js";

export class AppLayout extends BasePage {
  async goToDashboard() {
    await this.testId("nav-dashboard").click();
    await this.page.waitForURL("/");
  }

  async goToUsers() {
    await this.testId("nav-users").click();
    await this.page.waitForURL("**/users");
  }

  async goToProducts() {
    await this.testId("nav-products").click();
    await this.page.waitForURL("**/products");
  }

  async logout() {
    if (await this.isVisible("logout")) {
      await this.testId("logout").click();
    } else {
      await this.testId("logout-mobile").click();
    }
    await this.page.waitForURL("**/login");
  }

  async isNavUsersActive() {
    const className = await this.testId("nav-users").getAttribute("class");
    return className?.includes("bg-indigo-50") ?? false;
  }
}
