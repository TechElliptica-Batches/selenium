package com.automation.um.pages;

import com.automation.um.config.Config;
import com.automation.um.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class BasePage {
  protected final WebDriver driver;
  protected final WebDriverWait wait;

  protected BasePage(WebDriver driver) {
    this.driver = driver;
    this.wait = WaitUtils.wait(driver);
  }

  protected void open(String path) {
    driver.get(Config.BASE_URL + path);
  }

  protected By testId(String id) {
    return By.cssSelector("[data-testid='" + id + "']");
  }

  protected WebElement el(String testId) {
    return WaitUtils.visible(driver, testId(testId));
  }

  public void clearStorage() {
    open("/login");
    ((JavascriptExecutor) driver).executeScript("localStorage.clear();");
  }

  protected void fillInput(String testId, String value) {
    WebElement input = el(testId);
    input.clear();
    input.sendKeys(value);
  }

  protected void selectOption(String testId, String value) {
    new Select(el(testId)).selectByVisibleText(value);
  }

  protected void selectOptionByValue(String testId, String value) {
    new Select(el(testId)).selectByValue(value);
  }

  public boolean isVisible(String testId) {
    return !driver.findElements(testId(testId)).isEmpty()
        && driver.findElement(testId(testId)).isDisplayed();
  }
}
