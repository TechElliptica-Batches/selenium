import { test, expect } from "../../fixtures/index.js";
import { getUsersViaApi } from "../../utils/apiClient.js";

test.describe("Users filters and sorting", () => {
  test.beforeEach(async ({ loginAsAdmin, usersPage, apiAuth }) => {
    await loginAsAdmin();
    await usersPage.openUsers();
    const data = await getUsersViaApi(apiAuth.token, "page=1&pageSize=1");
    test.skip(data.total === 0, "No seed users available");
  });

  test("should search users with debounced query", async ({ usersPage, apiAuth }) => {
    const data = await getUsersViaApi(apiAuth.token, "page=1&pageSize=1");
    const sample = data.items[0];
    await usersPage.search(sample.email);
    expect(await usersPage.isVisible("users-table")).toBe(true);
    expect(await usersPage.rowExistsForEmail(sample.email)).toBe(true);
  });

  test("should filter users by role", async ({ usersPage, page }) => {
    await usersPage.filterByRole("Engineer");
    const roleCells = page.locator("[data-testid^='user-row-'] td:nth-child(4)");
    const count = await roleCells.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      expect((await roleCells.nth(i).textContent())?.trim()).toBe("Engineer");
    }
  });

  test("should filter users by status", async ({ usersPage, page }) => {
    await usersPage.filterByStatus("Active");
    const userId = await usersPage.firstUserId();
    expect(userId).not.toBeNull();
    const status = await page.getByTestId(`user-status-${userId}`).textContent();
    expect(status).toBe("Active");
  });

  test("should sort users by email column", async ({ usersPage }) => {
    await usersPage.sortBy("email");
    expect(await usersPage.isVisible("users-table")).toBe(true);
  });

  test("should select users and show selected count", async ({ usersPage }) => {
    const userId = await usersPage.firstUserId();
    expect(userId).not.toBeNull();
    await usersPage.selectUser(userId);
    expect(await usersPage.selectedCountText()).toBe("Selected: 1");
    expect(await usersPage.isVisible("users-bulk-delete")).toBe(true);
  });

  test("should select all visible users", async ({ usersPage }) => {
    await usersPage.selectAllVisible();
    const visible = await usersPage.visibleRowCount();
    expect(await usersPage.selectedCountText()).toBe(`Selected: ${visible}`);
  });
});
