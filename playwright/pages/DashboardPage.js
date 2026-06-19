import { BasePage } from "./BasePage.js";
import { BASE_URL } from "../config/config.js";

export class DashboardPage extends BasePage {
  async waitForLoaded() {
    await this.el("stat-total-users");
    await this.page.waitForFunction(() => {
      const el = document.querySelector("[data-testid='stat-total-users']");
      if (!el) return false;
      return /^\d+$/.test(el.textContent?.trim() || "");
    });
  }

  async getTotalUsersCount() {
    const text = await this.testId("stat-total-users").textContent();
    return Number.parseInt(text?.trim() || "0", 10);
  }

  async isOnDashboard() {
    const url = this.page.url().replace(/\/$/, "");
    const base = BASE_URL.replace(/\/$/, "");
    return (url === base || url.endsWith("/")) && (await this.isVisible("stat-total-users"));
  }
}
