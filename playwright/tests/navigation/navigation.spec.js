import { test, expect } from "../../fixtures/index.js";

test.describe("Navigation", () => {
  test("should navigate between dashboard, users, and products", async ({
    page,
    loginAsAdmin,
    appLayout,
    dashboardPage,
    usersPage,
    productsPage
  }) => {
    await loginAsAdmin();
    await dashboardPage.waitForLoaded();

    await appLayout.goToUsers();
    await usersPage.waitForTableReady();
    expect(page.url()).toContain("/users");

    await appLayout.goToProducts();
    await productsPage.waitForGridReady();
    expect(page.url()).toContain("/products");

    await appLayout.goToDashboard();
    await dashboardPage.waitForLoaded();
  });

  test("should highlight active nav item", async ({ loginAsAdmin, appLayout, usersPage }) => {
    await loginAsAdmin();
    await appLayout.goToUsers();
    await usersPage.waitForTableReady();
    expect(await appLayout.isNavUsersActive()).toBe(true);
  });
});
