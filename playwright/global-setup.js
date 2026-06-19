import { BASE_URL, PRODUCTS_API_BASE_URL, USERS_API_BASE_URL } from "./config/config.js";

async function checkHealth(name, url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${name} health check failed (${res.status}) at ${url}`);
  }
}

export default async function globalSetup() {
  const checks = [
    ["Frontend", BASE_URL],
    ["Users API", `${USERS_API_BASE_URL}/health`],
    ["Products API", `${PRODUCTS_API_BASE_URL}/health`]
  ];

  for (const [name, url] of checks) {
    try {
      await checkHealth(name, url);
    } catch (err) {
      console.warn(
        `[global-setup] ${err.message}\n` +
          "Start the app stack before running tests:\n" +
          "  npm run backend:users && npm run backend:products && npm run frontend\n" +
          "(from the api-practice repo root)"
      );
    }
  }
}
