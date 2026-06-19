import { test, expect } from "../../fixtures/index.js";

test.describe("Users list", () => {
  test.beforeEach(async ({ loginAsAdmin, usersPage }) => {
    await loginAsAdmin();
    await usersPage.openUsers();
  });

  test("should load users table with pagination info", async ({ usersPage }) => {
    const hasTable = await usersPage.isVisible("users-table");
    const hasEmpty = await usersPage.isVisible("users-empty-add");
    expect(hasTable || hasEmpty).toBe(true);
    expect(await usersPage.isVisible("users-total")).toBe(true);
    expect(await usersPage.isVisible("users-page")).toBe(true);
  });

  test("should refresh users list", async ({ usersPage }) => {
    await usersPage.refresh();
    const hasTable = await usersPage.isVisible("users-table");
    const hasEmpty = await usersPage.isVisible("users-empty-add");
    expect(hasTable || hasEmpty).toBe(true);
  });

  test("should paginate users", async ({ usersPage }) => {
    if (await usersPage.isNextEnabled()) {
      const before = await usersPage.pageText();
      await usersPage.nextPage();
      expect(await usersPage.pageText()).not.toBe(before);
      await usersPage.previousPage();
    }
  });

  test("should change page size", async ({ usersPage }) => {
    await usersPage.setPageSize(5);
    await expect.poll(async () => usersPage.visibleRowCount(), { timeout: 10_000 }).toBeLessThanOrEqual(5);
  });

  test("should open user details drawer", async ({ usersPage, userDetailsDrawer }) => {
    const userId = await usersPage.firstUserId();
    test.skip(!userId, "No users available");

    await usersPage.openDetailsForUser(userId);
    expect(await userDetailsDrawer.isLoaded()).toBe(true);
    await userDetailsDrawer.close();
  });
});
