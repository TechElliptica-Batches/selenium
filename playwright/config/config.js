import * as EnvironmentConfig from "./environmentConfig.js";

/**
 * Typed accessors for framework configuration loaded from property files.
 * Override any value via environment variable (BASE_URL, ADMIN_EMAIL, …).
 */
export const ENVIRONMENT = EnvironmentConfig.environment();
export const BASE_URL = EnvironmentConfig.get("base.url", "http://localhost:5173");
export const USERS_API_BASE_URL = EnvironmentConfig.get("users.api.base.url", "http://localhost:4000/api");
export const PRODUCTS_API_BASE_URL = EnvironmentConfig.get("products.api.base.url", "http://localhost:4001/api");
export const ADMIN_EMAIL = EnvironmentConfig.get("admin.email", "admin@acme.test");
export const ADMIN_PASSWORD = EnvironmentConfig.get("admin.password", "admin123");
export const HEADLESS = EnvironmentConfig.getBoolean("headless", false);
export const BROWSER = EnvironmentConfig.get("browser", "chromium");
export const EXPLICIT_WAIT_SECONDS = EnvironmentConfig.getInt("explicit.wait.seconds", 15);
