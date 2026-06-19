package com.automation.um.pages;

import com.automation.um.utils.WaitUtils;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class ProductsPage extends BasePage {
  public ProductsPage(WebDriver driver) {
    super(driver);
  }

  public void openProducts() {
    open("/products");
    waitForGridReady();
  }

  public void waitForGridReady() {
    WaitUtils.invisible(driver, testId("product-card-skeleton"));
    if (driver.findElements(testId("products-grid")).isEmpty()) {
      wait.until(d -> d.getPageSource().contains("No products found"));
    } else {
      el("products-grid");
    }
  }

  public void search(String query) {
    fillInput("products-search", query);
    WaitUtils.debounce();
    waitForGridReady();
  }

  public void filterByStatus(String status) {
    selectOptionByValue("products-filter-status", status);
    waitForGridReady();
  }

  public void sortBy(String optionValue) {
    selectOptionByValue("products-sort", optionValue);
    waitForGridReady();
  }

  public void setPageSize(int size) {
    selectOptionByValue("products-page-size", String.valueOf(size));
    waitForGridReady();
  }

  public void refresh() {
    el("products-refresh").click();
    waitForGridReady();
  }

  public void toggleProduct(String productId) {
    el("product-toggle-" + productId).click();
    WaitUtils.invisible(driver, testId("products-saving"));
  }

  public void nextPage() {
    el("products-next").click();
    waitForGridReady();
  }

  public int visibleCardCount() {
    List<WebElement> cards = driver.findElements(By.cssSelector("[data-testid^='product-card-']"));
    return (int) cards.stream().filter(c -> !"product-card-skeleton".equals(c.getAttribute("data-testid"))).count();
  }

  public String firstProductId() {
    return driver.findElements(By.cssSelector("[data-testid^='product-card-']")).stream()
        .map(el -> el.getAttribute("data-testid"))
        .filter(id -> id != null && !id.equals("product-card-skeleton"))
        .map(id -> id.replace("product-card-", ""))
        .findFirst()
        .orElse(null);
  }

  public String selectedCountText() {
    return el("products-selected-count").getText();
  }

  public String productToggleText(String productId) {
    return el("product-toggle-" + productId).getText();
  }

  public String pageText() {
    return el("products-page").getText();
  }

  public boolean isNextEnabled() {
    return el("products-next").isEnabled();
  }
}
