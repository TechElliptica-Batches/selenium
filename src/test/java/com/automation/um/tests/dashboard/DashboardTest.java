package com.automation.um.tests.dashboard;

import com.automation.um.core.BaseTest;
import com.automation.um.utils.ApiClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DashboardTest extends BaseTest {
  @Test
  public void shouldDisplayDashboardHeadingAndTotalUsersStat() throws Exception {
    loginAsAdmin();
    dashboardPage.waitForLoaded();
    int uiTotal = dashboardPage.getTotalUsersCount();
    JsonNode apiData = ApiClient.getUsersViaApi(apiAuth().token(), "page=1&pageSize=1");
    Assert.assertEquals(uiTotal, apiData.get("total").asInt());
  }

  @Test
  public void shouldShowDashboardAsDefaultLandingPageAfterLogin() {
    loginAsAdmin();
    Assert.assertTrue(driver.getCurrentUrl().endsWith("/") || driver.getCurrentUrl().endsWith(":5173/"));
    dashboardPage.waitForLoaded();
  }
}
