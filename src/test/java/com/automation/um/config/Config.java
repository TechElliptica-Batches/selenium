package com.automation.um.config;

/**
 * Typed accessors for framework configuration loaded from property files.
 * Override any value via environment variable or {@code -D} system property.
 */
public final class Config {
  private Config() {}

  public static final String ENVIRONMENT = EnvironmentConfig.environment();
  public static final String BASE_URL = EnvironmentConfig.get("base.url", "http://localhost:5173");
  public static final String USERS_API_BASE_URL = EnvironmentConfig.get("users.api.base.url", "http://localhost:4000/api");
  public static final String PRODUCTS_API_BASE_URL = EnvironmentConfig.get("products.api.base.url", "http://localhost:4001/api");
  public static final String ADMIN_EMAIL = EnvironmentConfig.get("admin.email", "admin@acme.test");
  public static final String ADMIN_PASSWORD = EnvironmentConfig.get("admin.password", "admin123");
  public static final boolean HEADLESS = EnvironmentConfig.getBoolean("headless", false);
  public static final String BROWSER = EnvironmentConfig.get("browser", "chrome");
  public static final int EXPLICIT_WAIT_SECONDS = EnvironmentConfig.getInt("explicit.wait.seconds", 15);

  // Legacy env-var aliases (BASE_URL, ADMIN_EMAIL, …) still work via EnvironmentConfig.
}
