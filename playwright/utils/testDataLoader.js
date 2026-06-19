import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const TESTDATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../testdata");

/**
 * Load static test data from a JSON file under testdata/.
 * @param {string} relativePath - e.g. "auth/login.json"
 */
export function loadTestData(relativePath) {
  const fullPath = path.join(TESTDATA_DIR, relativePath);
  const content = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(content);
}
