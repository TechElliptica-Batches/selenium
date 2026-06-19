import { test, expect } from "../../fixtures/index.js";
import { buildUser } from "../../utils/testDataFactory.js";
import {
  createUserViaApi,
  deleteUserViaApi,
  getUsersViaApi
} from "../../utils/apiClient.js";

test.describe("Users CRUD", () => {
  /** @type {string[]} */
  let createdUserIds = [];
  /** @type {string} */
  let apiToken;

  test.beforeEach(async ({ loginAsAdmin, usersPage, apiAuth }) => {
    apiToken = apiAuth.token;
    createdUserIds = [];
    await loginAsAdmin();
    await usersPage.openUsers();
  });

  test.afterEach(async () => {
    for (const id of [...createdUserIds]) {
      await deleteUserViaApi(id, apiToken).catch(() => {});
    }
    createdUserIds = [];
  });

  test("should create a new user", async ({ usersPage, userFormModal, toast }) => {
    const user = buildUser();
    await usersPage.openCreateModal();
    await userFormModal.fill(user);
    await userFormModal.submit();
    expect(await toast.hasTitle("success", "User created")).toBe(true);
    expect(await usersPage.rowExistsForEmail(user.email)).toBe(true);

    const list = await getUsersViaApi(apiToken, `q=${user.email}`);
    createdUserIds.push(list.items[0].id);
  });

  test("should validate required fields in user form", async ({ usersPage, userFormModal }) => {
    await usersPage.openCreateModal();
    await userFormModal.fill({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      status: ""
    });
    await userFormModal.submit();
    expect(await userFormModal.hasValidationError("First name is required")).toBe(true);
    expect(await userFormModal.hasValidationError("Email is required")).toBe(true);
  });

  test("should show duplicate email error", async ({ usersPage, userFormModal }) => {
    const existing = buildUser();
    const created = await createUserViaApi(existing, apiToken);
    createdUserIds.push(created.id);

    await usersPage.openCreateModal();
    await userFormModal.fill({ ...buildUser(), email: existing.email });
    await userFormModal.submit();
    expect(
      await userFormModal.hasServerError("That email already exists. Please use a different email.")
    ).toBe(true);
  });

  test("should edit an existing user", async ({ usersPage, userFormModal, toast, page }) => {
    const user = buildUser();
    const created = await createUserViaApi(user, apiToken);
    createdUserIds.push(created.id);

    await usersPage.refresh();
    await usersPage.openEditForUser(created.id);
    await userFormModal.fill({ firstName: "Updated", lastName: "Name" });
    await userFormModal.submit();
    expect(await toast.hasTitle("success", "User updated")).toBe(true);
    expect(await usersPage.rowExists(created.id)).toBe(true);
    expect(await page.content()).toContain("Updated Name");
  });

  test("should delete a single user", async ({ usersPage, confirmDialog, toast }) => {
    const user = buildUser();
    const created = await createUserViaApi(user, apiToken);

    await usersPage.refresh();
    await usersPage.deleteUser(created.id);
    await confirmDialog.confirm();
    expect(await toast.hasTitle("success", "Deleted")).toBe(true);
    expect(await usersPage.rowExists(created.id)).toBe(false);
  });

  test("should bulk delete selected users", async ({ usersPage, confirmDialog, toast }) => {
    const u1 = await createUserViaApi(buildUser(), apiToken);
    const u2 = await createUserViaApi(buildUser(), apiToken);

    await usersPage.refresh();
    await usersPage.selectUser(u1.id);
    await usersPage.selectUser(u2.id);
    await usersPage.bulkDelete();
    await confirmDialog.confirm();
    expect(await toast.hasTitle("success", "Deleted")).toBe(true);
    expect(await usersPage.rowExists(u1.id)).toBe(false);
    expect(await usersPage.rowExists(u2.id)).toBe(false);
  });

  test("should cancel delete from confirmation dialog", async ({ usersPage, confirmDialog }) => {
    const user = buildUser();
    const created = await createUserViaApi(user, apiToken);
    createdUserIds.push(created.id);

    await usersPage.refresh();
    await usersPage.deleteUser(created.id);
    await confirmDialog.cancel();
    expect(await usersPage.rowExists(created.id)).toBe(true);
  });
});
