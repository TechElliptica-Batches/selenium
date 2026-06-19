import { randomUUID } from "crypto";

export function uniqueEmail(prefix = "user") {
  const stamp = Date.now();
  const rand = randomUUID().slice(0, 6);
  return `${prefix}.${stamp}.${rand}@acme.test`;
}

/**
 * @param {Record<string, string>} [overrides]
 * @returns {Record<string, string>}
 */
export function buildUser(overrides = {}) {
  const stamp = String(Date.now()).slice(-6);
  return {
    firstName: "E2E",
    lastName: `User${stamp}`,
    email: uniqueEmail("user"),
    phone: `555-${stamp.slice(0, 3)}-${stamp.slice(3)}`,
    role: "Engineer",
    status: "Active",
    ...overrides
  };
}
