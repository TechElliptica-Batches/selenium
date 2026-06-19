import { test, expect } from "../../fixtures/index.js";
import { clearSelectedProducts, getProductsViaApi } from "../../utils/apiClient.js";

test.describe("Products", () => {
  test.beforeEach(async ({ loginAsAdmin, productsPage, apiAuth }) => {
    await clearSelectedProducts(apiAuth.token);
    await loginAsAdmin();
    await productsPage.openProducts();
  });

  test("should load products grid with totals", async ({ productsPage, page }) => {
    const hasGrid = await productsPage.isVisible("products-grid");
    const noProducts = (await page.content()).includes("No products found");
    expect(hasGrid || noProducts).toBe(true);
    expect(await productsPage.isVisible("products-total")).toBe(true);
    expect(await productsPage.selectedCountText()).toBe("Selected: 0");
  });

  test("should refresh products grid", async ({ productsPage, page }) => {
    await productsPage.refresh();
    const hasGrid = await productsPage.isVisible("products-grid");
    const noProducts = (await page.content()).includes("No products found");
    expect(hasGrid || noProducts).toBe(true);
  });

  test("should search products", async ({ productsPage, apiAuth, page }) => {
    const data = await getProductsViaApi(apiAuth.token, "page=1&pageSize=1");
    test.skip(data.items.length === 0, "No products available");

    const name = data.items[0].name;
    const query = name.substring(0, Math.min(3, name.length));
    await productsPage.search(query);
    expect((await page.content()).toLowerCase()).toContain(query.toLowerCase());
  });

  test("should filter products by status", async ({ productsPage, page }) => {
    await productsPage.filterByStatus("Active");
    const cards = page.locator("[data-testid^='product-card-']");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const id = await cards.nth(i).getAttribute("data-testid");
      if (id === "product-card-skeleton") continue;
      expect(await cards.nth(i).textContent()).toContain("Active");
    }
  });

  test("should sort products by name ascending", async ({ productsPage }) => {
    await productsPage.sortBy("name-asc");
    expect(await productsPage.isVisible("products-grid")).toBe(true);
    const value = await productsPage.page.locator("[data-testid='products-sort']").inputValue();
    expect(value).toBe("name-asc");
  });

  test("should change products page size", async ({ productsPage }) => {
    await productsPage.setPageSize(6);
    await expect.poll(async () => productsPage.visibleCardCount(), { timeout: 10_000 }).toBeLessThanOrEqual(6);
  });

  test("should paginate products when multiple pages exist", async ({ productsPage }) => {
    if (await productsPage.isNextEnabled()) {
      const before = await productsPage.pageText();
      await productsPage.nextPage();
      expect(await productsPage.pageText()).not.toBe(before);
    }
  });

  test("should select and deselect a product", async ({ productsPage }) => {
    const productId = await productsPage.firstProductId();
    test.skip(!productId, "No products available");

    await productsPage.toggleProduct(productId);
    expect(await productsPage.selectedCountText()).toBe("Selected: 1");
    expect(await productsPage.productToggleText(productId)).toContain("Selected");

    await productsPage.toggleProduct(productId);
    expect(await productsPage.selectedCountText()).toBe("Selected: 0");
  });

  test("should persist selected products after refresh", async ({ productsPage }) => {
    const productId = await productsPage.firstProductId();
    test.skip(!productId, "No products available");

    await productsPage.toggleProduct(productId);
    await productsPage.refresh();
    expect(await productsPage.productToggleText(productId)).toContain("Selected");
    expect(await productsPage.selectedCountText()).toBe("Selected: 1");
    await productsPage.toggleProduct(productId);
  });
});
