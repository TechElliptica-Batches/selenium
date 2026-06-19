package com.automation.um.tests.users;

import com.automation.um.core.BaseTest;
import com.automation.um.utils.ApiClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class UsersFiltersTest extends BaseTest {
  @BeforeMethod
  public void openUsersPage() throws Exception {
    loginAsAdmin();
    usersPage.openUsers();
    JsonNode data = ApiClient.getUsersViaApi(apiAuth().token(), "page=1&pageSize=1");
    if (data.get("total").asInt() == 0) {
      throw new org.testng.SkipException("No seed users available");
    }
  }

  @Test
  public void shouldSearchUsersWithDebouncedQuery() throws Exception {
    JsonNode data = ApiClient.getUsersViaApi(apiAuth().token(), "page=1&pageSize=1");
    JsonNode sample = data.get("items").get(0);
    usersPage.search(sample.get("email").asText());
    Assert.assertTrue(usersPage.isVisible("users-table"));
    Assert.assertTrue(usersPage.rowExistsForEmail(sample.get("email").asText()));
  }

  @Test
  public void shouldFilterUsersByRole() {
    usersPage.filterByRole("Engineer");
    var roleCells = driver.findElements(By.cssSelector("[data-testid^='user-row-'] td:nth-child(4)"));
    Assert.assertFalse(roleCells.isEmpty());
    for (WebElement cell : roleCells) {
      Assert.assertEquals(cell.getText().trim(), "Engineer");
    }
  }

  @Test
  public void shouldFilterUsersByStatus() {
    usersPage.filterByStatus("Active");
    String userId = usersPage.firstUserId();
    Assert.assertNotNull(userId);
    Assert.assertEquals(driver.findElement(By.cssSelector("[data-testid='user-status-" + userId + "']")).getText(), "Active");
  }

  @Test
  public void shouldSortUsersByEmailColumn() {
    usersPage.sortBy("email");
    Assert.assertTrue(usersPage.isVisible("users-table"));
  }

  @Test
  public void shouldSelectUsersAndShowSelectedCount() {
    String userId = usersPage.firstUserId();
    Assert.assertNotNull(userId);
    usersPage.selectUser(userId);
    Assert.assertEquals(usersPage.selectedCountText(), "Selected: 1");
    Assert.assertTrue(usersPage.isVisible("users-bulk-delete"));
  }

  @Test
  public void shouldSelectAllVisibleUsers() {
    usersPage.selectAllVisible();
    int visible = usersPage.visibleRowCount();
    Assert.assertEquals(usersPage.selectedCountText(), "Selected: " + visible);
  }
}
