import { test, expect } from "../../fixtures/index.js";

test.describe("Route guard", () => {
  test.beforeEach(async ({ clearSession }) => {
    await clearSession();
  });

  test("should redirect unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect unauthenticated users from users page to login", async ({ page }) => {
    await page.goto("/users");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect unauthenticated users from products page to login", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect to intended page after login", async ({ page, loginPage, usersPage }) => {
    await page.goto("/users");
    await expect(page).toHaveURL(/\/login/);
    await loginPage.loginWithDefaults();
    await usersPage.waitForTableReady();
    await expect(page).toHaveURL(/\/users/);
  });
});
