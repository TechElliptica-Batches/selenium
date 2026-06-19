package com.automation.um.tests.users;

import com.automation.um.core.BaseTest;
import com.automation.um.utils.ApiClient;
import com.automation.um.utils.ApiClient.UserRecord;
import com.fasterxml.jackson.databind.JsonNode;
import com.automation.um.utils.TestDataFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class UsersCrudTest extends BaseTest {
  private final List<String> createdUserIds = new ArrayList<>();
  private String apiToken;

  @BeforeMethod
  public void openUsers() throws Exception {
    apiToken = apiAuth().token();
    loginAsAdmin();
    usersPage.openUsers();
  }

  @AfterMethod(alwaysRun = true)
  public void cleanup() {
    for (String id : new ArrayList<>(createdUserIds)) {
      try {
        ApiClient.deleteUserViaApi(id, apiToken);
      } catch (Exception ignored) {
        // best-effort cleanup
      }
    }
    createdUserIds.clear();
  }

  @Test
  public void shouldCreateANewUser() throws Exception {
    Map<String, String> user = TestDataFactory.buildUser();
    usersPage.openCreateModal();
    userFormModal.fill(user);
    userFormModal.submit();
    Assert.assertTrue(toast.hasTitle("success", "User created"));
    Assert.assertTrue(usersPage.rowExistsForEmail(user.get("email")));

    JsonNode list = ApiClient.getUsersViaApi(apiToken, "q=" + user.get("email"));
    createdUserIds.add(list.get("items").get(0).get("id").asText());
  }

  @Test
  public void shouldValidateRequiredFieldsInUserForm() {
    Map<String, String> empty = new HashMap<>();
    empty.put("firstName", "");
    empty.put("lastName", "");
    empty.put("email", "");
    empty.put("phone", "");
    empty.put("role", "");
    empty.put("status", "");

    usersPage.openCreateModal();
    userFormModal.fill(empty);
    userFormModal.submit();
    Assert.assertTrue(userFormModal.hasValidationError("First name is required"));
    Assert.assertTrue(userFormModal.hasValidationError("Email is required"));
  }

  @Test
  public void shouldShowDuplicateEmailError() throws Exception {
    Map<String, String> existing = TestDataFactory.buildUser();
    UserRecord created = ApiClient.createUserViaApi(existing, apiToken);
    createdUserIds.add(created.id());

    usersPage.openCreateModal();
    Map<String, String> duplicate = TestDataFactory.buildUser(Map.of("email", existing.get("email")));
    userFormModal.fill(duplicate);
    userFormModal.submit();
    Assert.assertTrue(userFormModal.hasServerError("That email already exists. Please use a different email."));
  }

  @Test
  public void shouldEditAnExistingUser() throws Exception {
    Map<String, String> user = TestDataFactory.buildUser();
    UserRecord created = ApiClient.createUserViaApi(user, apiToken);
    createdUserIds.add(created.id());

    usersPage.refresh();
    usersPage.openEditForUser(created.id());
    userFormModal.fill(Map.of("firstName", "Updated", "lastName", "Name"));
    userFormModal.submit();
    Assert.assertTrue(toast.hasTitle("success", "User updated"));
    Assert.assertTrue(usersPage.rowExists(created.id()));
    Assert.assertTrue(driver.getPageSource().contains("Updated Name"));
  }

  @Test
  public void shouldDeleteASingleUser() throws Exception {
    Map<String, String> user = TestDataFactory.buildUser();
    UserRecord created = ApiClient.createUserViaApi(user, apiToken);

    usersPage.refresh();
    usersPage.deleteUser(created.id());
    confirmDialog.confirm();
    Assert.assertTrue(toast.hasTitle("success", "Deleted"));
    Assert.assertFalse(usersPage.rowExists(created.id()));
  }

  @Test
  public void shouldBulkDeleteSelectedUsers() throws Exception {
    UserRecord u1 = ApiClient.createUserViaApi(TestDataFactory.buildUser(), apiToken);
    UserRecord u2 = ApiClient.createUserViaApi(TestDataFactory.buildUser(), apiToken);

    usersPage.refresh();
    usersPage.selectUser(u1.id());
    usersPage.selectUser(u2.id());
    usersPage.bulkDelete();
    confirmDialog.confirm();
    Assert.assertTrue(toast.hasTitle("success", "Deleted"));
    Assert.assertFalse(usersPage.rowExists(u1.id()));
    Assert.assertFalse(usersPage.rowExists(u2.id()));
  }

  @Test
  public void shouldCancelDeleteFromConfirmationDialog() throws Exception {
    Map<String, String> user = TestDataFactory.buildUser();
    UserRecord created = ApiClient.createUserViaApi(user, apiToken);
    createdUserIds.add(created.id());

    usersPage.refresh();
    usersPage.deleteUser(created.id());
    confirmDialog.cancel();
    Assert.assertTrue(usersPage.rowExists(created.id()));
  }
}
