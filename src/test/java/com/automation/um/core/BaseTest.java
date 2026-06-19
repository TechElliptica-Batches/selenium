package com.automation.um.core;

import com.automation.um.pages.AppLayout;
import com.automation.um.pages.DashboardPage;
import com.automation.um.pages.LoginPage;
import com.automation.um.pages.ProductsPage;
import com.automation.um.pages.UsersPage;
import com.automation.um.pages.components.ConfirmDialog;
import com.automation.um.pages.components.ToastComponent;
import com.automation.um.pages.components.UserDetailsDrawer;
import com.automation.um.pages.components.UserFormModal;
import com.automation.um.utils.ApiClient;
import com.automation.um.utils.ApiClient.AuthSession;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
  protected WebDriver driver;
  protected LoginPage loginPage;
  protected DashboardPage dashboardPage;
  protected UsersPage usersPage;
  protected ProductsPage productsPage;
  protected AppLayout appLayout;
  protected ToastComponent toast;
  protected ConfirmDialog confirmDialog;
  protected UserFormModal userFormModal;
  protected UserDetailsDrawer userDetailsDrawer;

  @BeforeMethod
  public void setUp() {
    driver = DriverFactory.createDriver();
    loginPage = new LoginPage(driver);
    dashboardPage = new DashboardPage(driver);
    usersPage = new UsersPage(driver);
    productsPage = new ProductsPage(driver);
    appLayout = new AppLayout(driver);
    toast = new ToastComponent(driver);
    confirmDialog = new ConfirmDialog(driver);
    userFormModal = new UserFormModal(driver);
    userDetailsDrawer = new UserDetailsDrawer(driver);
  }

  @AfterMethod(alwaysRun = true)
  public void tearDown() {
    if (driver != null) {
      driver.quit();
    }
  }

  protected void loginAsAdmin() {
    loginPage.openLogin();
    loginPage.loginWithDefaults();
    ExpectedConditions.urlToBe(com.automation.um.config.Config.BASE_URL + "/").apply(driver);
    dashboardPage.waitForLoaded();
  }

  protected AuthSession apiAuth() throws Exception {
    return ApiClient.loginViaApi();
  }

  protected void clearSession() {
    loginPage.clearStorage();
  }
}
