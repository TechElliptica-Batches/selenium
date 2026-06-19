import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { UsersPage } from "../pages/UsersPage.js";
import { ProductsPage } from "../pages/ProductsPage.js";
import { AppLayout } from "../pages/AppLayout.js";
import { ToastComponent } from "../pages/components/ToastComponent.js";
import { ConfirmDialog } from "../pages/components/ConfirmDialog.js";
import { UserFormModal } from "../pages/components/UserFormModal.js";
import { UserDetailsDrawer } from "../pages/components/UserDetailsDrawer.js";
import { loginViaApi } from "../utils/apiClient.js";

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  appLayout: async ({ page }, use) => {
    await use(new AppLayout(page));
  },
  toast: async ({ page }, use) => {
    await use(new ToastComponent(page));
  },
  confirmDialog: async ({ page }, use) => {
    await use(new ConfirmDialog(page));
  },
  userFormModal: async ({ page }, use) => {
    await use(new UserFormModal(page));
  },
  userDetailsDrawer: async ({ page }, use) => {
    await use(new UserDetailsDrawer(page));
  },

  /** API auth token for setup/teardown (mirrors BaseTest.apiAuth). */
  apiAuth: async ({}, use) => {
    const session = await loginViaApi();
    await use(session);
  },

  /** Logs in through UI and lands on dashboard (mirrors BaseTest.loginAsAdmin). */
  loginAsAdmin: async ({ page, loginPage, dashboardPage }, use) => {
    await use(async () => {
      await loginPage.openLogin();
      await loginPage.loginWithDefaults();
      await page.waitForURL("/");
      await dashboardPage.waitForLoaded();
    });
  },

  /** Clears browser session (mirrors BaseTest.clearSession). */
  clearSession: async ({ loginPage }, use) => {
    await use(async () => {
      await loginPage.clearStorage();
    });
  }
});

export { expect } from "@playwright/test";
