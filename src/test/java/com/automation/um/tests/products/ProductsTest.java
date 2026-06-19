package com.automation.um.tests.products;

import com.automation.um.core.BaseTest;
import com.automation.um.utils.ApiClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ProductsTest extends BaseTest {
  @BeforeMethod
  public void openProducts() throws Exception {
    ApiClient.clearSelectedProducts(apiAuth().token());
    loginAsAdmin();
    productsPage.openProducts();
  }

  @Test
  public void shouldLoadProductsGridWithTotals() {
    Assert.assertTrue(productsPage.isVisible("products-grid") || driver.getPageSource().contains("No products found"));
    Assert.assertTrue(productsPage.isVisible("products-total"));
    Assert.assertEquals(productsPage.selectedCountText(), "Selected: 0");
  }

  @Test
  public void shouldRefreshProductsGrid() {
    productsPage.refresh();
    Assert.assertTrue(productsPage.isVisible("products-grid") || driver.getPageSource().contains("No products found"));
  }

  @Test
  public void shouldSearchProducts() throws Exception {
    JsonNode data = ApiClient.getProductsViaApi(apiAuth().token(), "page=1&pageSize=1");
    if (data.get("items").isEmpty()) {
      throw new org.testng.SkipException("No products available");
    }
    String name = data.get("items").get(0).get("name").asText();
    productsPage.search(name.substring(0, Math.min(3, name.length())));
    Assert.assertTrue(driver.getPageSource().toLowerCase().contains(name.substring(0, 3).toLowerCase()));
  }

  @Test
  public void shouldFilterProductsByStatus() {
    productsPage.filterByStatus("Active");
    var cards = driver.findElements(By.cssSelector("[data-testid^='product-card-']"));
    for (WebElement card : cards) {
      if ("product-card-skeleton".equals(card.getAttribute("data-testid"))) continue;
      Assert.assertTrue(card.getText().contains("Active"));
    }
  }

  @Test
  public void shouldSortProductsByNameAscending() {
    productsPage.sortBy("name-asc");
    Assert.assertTrue(productsPage.isVisible("products-grid"));
    Assert.assertEquals(
        new org.openqa.selenium.support.ui.Select(el("products-sort")).getFirstSelectedOption().getAttribute("value"),
        "name-asc"
    );
  }

  private org.openqa.selenium.WebElement el(String testId) {
    return driver.findElement(org.openqa.selenium.By.cssSelector("[data-testid='" + testId + "']"));
  }

  @Test
  public void shouldChangeProductsPageSize() {
    productsPage.setPageSize(6);
    long deadline = System.currentTimeMillis() + 10_000;
    int count = productsPage.visibleCardCount();
    while (count > 6 && System.currentTimeMillis() < deadline) {
      count = productsPage.visibleCardCount();
    }
    Assert.assertTrue(count <= 6);
  }

  @Test
  public void shouldPaginateProductsWhenMultiplePagesExist() {
    if (productsPage.isNextEnabled()) {
      String before = productsPage.pageText();
      productsPage.nextPage();
      Assert.assertNotEquals(productsPage.pageText(), before);
    }
  }

  @Test
  public void shouldSelectAndDeselectAProduct() {
    String productId = productsPage.firstProductId();
    if (productId == null) {
      throw new org.testng.SkipException("No products available");
    }
    productsPage.toggleProduct(productId);
    Assert.assertEquals(productsPage.selectedCountText(), "Selected: 1");
    Assert.assertTrue(productsPage.productToggleText(productId).contains("Selected"));

    productsPage.toggleProduct(productId);
    Assert.assertEquals(productsPage.selectedCountText(), "Selected: 0");
  }

  @Test
  public void shouldPersistSelectedProductsAfterRefresh() {
    String productId = productsPage.firstProductId();
    if (productId == null) {
      throw new org.testng.SkipException("No products available");
    }
    productsPage.toggleProduct(productId);
    productsPage.refresh();
    Assert.assertTrue(productsPage.productToggleText(productId).contains("Selected"));
    Assert.assertEquals(productsPage.selectedCountText(), "Selected: 1");
    productsPage.toggleProduct(productId);
  }
}
