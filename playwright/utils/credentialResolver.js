import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";

const PLACEHOLDERS = {
  USE_ADMIN_EMAIL: () => ADMIN_EMAIL,
  USE_ADMIN_PASSWORD: () => ADMIN_PASSWORD
};

/**
 * Resolve email/password from JSON — supports USE_ADMIN_* placeholders or literal values.
 * @param {string} value
 */
export function resolveCredential(value) {
  const resolver = PLACEHOLDERS[value];
  return resolver ? resolver() : value;
}

/**
 * Resolve all credential fields in a scenario object.
 * @param {{ email?: string, password?: string }} scenario
 */
export function resolveScenarioCredentials(scenario) {
  return {
    email: scenario.email != null ? resolveCredential(scenario.email) : undefined,
    password: scenario.password != null ? resolveCredential(scenario.password) : undefined
  };
}
