package com.automation.um.pages;

import com.automation.um.utils.WaitUtils;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class UsersPage extends BasePage {
  public UsersPage(WebDriver driver) {
    super(driver);
  }

  public void openUsers() {
    open("/users");
    waitForTableReady();
  }

  public void waitForTableReady() {
    WaitUtils.invisible(driver, testId("users-row-skeleton"));
    if (driver.findElements(testId("users-table")).isEmpty()) {
      WaitUtils.visible(driver, testId("users-empty-add"));
    } else {
      el("users-table");
    }
  }

  public void search(String query) {
    fillInput("users-search", query);
    WaitUtils.debounce();
    waitForTableReady();
  }

  public void filterByRole(String role) {
    selectOptionByValue("users-filter-role", role);
    waitForTableReady();
  }

  public void filterByStatus(String status) {
    selectOptionByValue("users-filter-status", status);
    waitForTableReady();
  }

  public void setPageSize(int size) {
    selectOptionByValue("users-page-size", String.valueOf(size));
    waitForTableReady();
  }

  public void sortBy(String column) {
    el("sort-" + column).click();
    waitForTableReady();
  }

  public void refresh() {
    el("users-refresh").click();
    waitForTableReady();
  }

  public void openCreateModal() {
    el("users-add").click();
    el("user-form-submit");
  }

  public void openEditForUser(String userId) {
    el("user-edit-" + userId).click();
    el("user-form-submit");
  }

  public void openDetailsForUser(String userId) {
    el("user-view-" + userId).click();
    el("details-close");
  }

  public void deleteUser(String userId) {
    el("user-delete-" + userId).click();
  }

  public void selectUser(String userId) {
    WebElement checkbox = el("user-select-" + userId);
    if (!checkbox.isSelected()) {
      checkbox.click();
    }
  }

  public void selectAllVisible() {
    WebElement checkbox = el("users-select-all");
    if (!checkbox.isSelected()) {
      checkbox.click();
    }
  }

  public void bulkDelete() {
    el("users-bulk-delete").click();
  }

  public void nextPage() {
    el("users-next").click();
    waitForTableReady();
  }

  public void previousPage() {
    el("users-prev").click();
    waitForTableReady();
  }

  public int visibleRowCount() {
    return driver.findElements(By.cssSelector("[data-testid^='user-row-']")).size();
  }

  public String firstUserId() {
    List<WebElement> rows = driver.findElements(By.cssSelector("[data-testid^='user-row-']"));
    if (rows.isEmpty()) return null;
    String testId = rows.get(0).getAttribute("data-testid");
    return testId == null ? null : testId.replace("user-row-", "");
  }

  public boolean rowExistsForEmail(String email) {
    return driver.getPageSource().contains(email);
  }

  public boolean rowExists(String userId) {
    return isVisible("user-row-" + userId);
  }

  public String selectedCountText() {
    return el("users-selected-count").getText();
  }

  public String pageText() {
    return el("users-page").getText();
  }

  public boolean isNextEnabled() {
    return el("users-next").isEnabled();
  }
}
