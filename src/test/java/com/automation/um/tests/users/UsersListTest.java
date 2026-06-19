package com.automation.um.tests.users;

import com.automation.um.core.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class UsersListTest extends BaseTest {
  @Test
  public void shouldLoadUsersTableWithPaginationInfo() {
    loginAsAdmin();
    usersPage.openUsers();
    Assert.assertTrue(usersPage.isVisible("users-table") || usersPage.isVisible("users-empty-add"));
    Assert.assertTrue(usersPage.isVisible("users-total"));
    Assert.assertTrue(usersPage.isVisible("users-page"));
  }

  @Test
  public void shouldRefreshUsersList() {
    loginAsAdmin();
    usersPage.openUsers();
    usersPage.refresh();
    Assert.assertTrue(usersPage.isVisible("users-table") || usersPage.isVisible("users-empty-add"));
  }

  @Test
  public void shouldPaginateUsers() {
    loginAsAdmin();
    usersPage.openUsers();
    if (usersPage.isNextEnabled()) {
      String before = usersPage.pageText();
      usersPage.nextPage();
      Assert.assertNotEquals(usersPage.pageText(), before);
      usersPage.previousPage();
    }
  }

  @Test
  public void shouldChangePageSize() {
    loginAsAdmin();
    usersPage.openUsers();
    usersPage.setPageSize(5);
    long deadline = System.currentTimeMillis() + 10_000;
    int count = usersPage.visibleRowCount();
    while (count > 5 && System.currentTimeMillis() < deadline) {
      count = usersPage.visibleRowCount();
    }
    Assert.assertTrue(count <= 5, "Expected at most 5 rows but got " + count);
  }

  @Test
  public void shouldOpenUserDetailsDrawer() {
    loginAsAdmin();
    usersPage.openUsers();
    String userId = usersPage.firstUserId();
    if (userId == null) {
      return;
    }
    usersPage.openDetailsForUser(userId);
    Assert.assertTrue(userDetailsDrawer.isLoaded());
    userDetailsDrawer.close();
  }
}
