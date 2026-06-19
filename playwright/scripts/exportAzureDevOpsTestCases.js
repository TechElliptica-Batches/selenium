/**
 * Generates Azure DevOps Test Plans CSV from framework test definitions.
 * Run: node scripts/exportAzureDevOpsTestCases.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTestData } from "../utils/testDataLoader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "exports", "azure-devops-testcases.csv");

// Update these before importing into Azure DevOps
const AZURE_CONFIG = {
  areaPath: "REPLACE_WITH_YOUR_PROJECT\\E2E",
  assignedTo: "REPLACE_WITH_YOUR_EMAIL@contoso.com",
  state: "Design"
};

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatCredential(value) {
  if (value === "USE_ADMIN_EMAIL") return "{admin email from config}";
  if (value === "USE_ADMIN_PASSWORD") return "{admin password from config}";
  if (value === "" || value === "   ") return value === "   " ? "(whitespace only)" : "(empty)";
  return value;
}

function loginExpectedText(scenario, data) {
  const { expected } = scenario;
  if (expected.type === "success") {
    if (expected.toast) {
      const toast = data.toasts[expected.toast];
      return `User is redirected to dashboard. Success toast "${toast.title}" is displayed.`;
    }
    return "User is redirected to dashboard (/).";
  }
  if (expected.type === "auth-error") {
    const toast = data.toasts[expected.toast];
    return `User remains on login page. Error toast "${toast.title}" is displayed.`;
  }
  if (expected.type === "validation-error") {
    return `Validation message "${data.validationErrors[expected.errorKey]}" is displayed. User remains on login page.`;
  }
  if (expected.type === "prefill") {
    return "Email and password fields are pre-filled with sample admin credentials.";
  }
  return "Expected outcome is met.";
}

function loginSteps(scenario, data) {
  if (scenario.expected?.type === "prefill") {
    return [
      {
        action: "Open the application login page (/login).",
        expected: "Login form is displayed with email and password fields."
      },
      {
        action: "Observe the email and password input fields without entering data.",
        expected: loginExpectedText(scenario, data)
      }
    ];
  }

  const email = formatCredential(scenario.email);
  const password = formatCredential(scenario.password);

  return [
    {
      action: "Open the application login page (/login). Clear browser session/local storage.",
      expected: "Login form is displayed."
    },
    {
      action: `Enter email: ${email}`,
      expected: "Email value is entered in the email field."
    },
    {
      action: `Enter password: ${password}`,
      expected: "Password value is entered in the password field."
    },
    {
      action: "Click the Sign in / Login submit button.",
      expected: loginExpectedText(scenario, data)
    }
  ];
}

function buildLoginTestCases(loginData) {
  const cases = [];

  for (const scenario of loginData.scenarios) {
    cases.push({
      id: scenario.id,
      title: `[${scenario.id}] ${scenario.name}`,
      module: "Auth - Login",
      category: scenario.category,
      tags: ["E2E", "Playwright", "Login", ...(scenario.tags ?? [])].join("; "),
      automationPath: "tests/auth/login.spec.js",
      priority: scenario.category === "positive" ? "1" : "2",
      steps: loginSteps(scenario, loginData)
    });
  }

  for (const check of loginData.uiChecks) {
    cases.push({
      id: check.id,
      title: `[${check.id}] ${check.name}`,
      module: "Auth - Login",
      category: check.category,
      tags: ["E2E", "Playwright", "Login", "UI"].join("; "),
      automationPath: "tests/auth/login.spec.js",
      priority: "2",
      steps: loginSteps(check, loginData)
    });
  }

  return cases;
}

const MANUAL_TEST_CASES = [
  {
    id: "LOGOUT-001",
    title: "[LOGOUT-001] Should logout and redirect to login with success toast",
    module: "Auth - Logout",
    category: "positive",
    tags: "E2E; Playwright; Logout",
    automationPath: "tests/auth/logout.spec.js",
    priority: "1",
    steps: [
      { action: "Login as admin user.", expected: "Dashboard is displayed." },
      { action: "Click Logout from the app layout.", expected: "User is redirected to /login. Success toast 'Logged out' is displayed." }
    ]
  },
  {
    id: "LOGOUT-002",
    title: "[LOGOUT-002] Should block access to protected routes after logout",
    module: "Auth - Logout",
    category: "security",
    tags: "E2E; Playwright; Logout; Route Guard",
    automationPath: "tests/auth/logout.spec.js",
    priority: "2",
    steps: [
      { action: "Login as admin and then logout.", expected: "User is on login page." },
      { action: "Navigate directly to /users.", expected: "User is redirected to /login." }
    ]
  },
  {
    id: "GUARD-001",
    title: "[GUARD-001] Should redirect unauthenticated users from dashboard to login",
    module: "Auth - Route Guard",
    category: "security",
    tags: "E2E; Playwright; Route Guard",
    automationPath: "tests/auth/route-guard.spec.js",
    priority: "2",
    steps: [
      { action: "Clear session and open / (dashboard) without logging in.", expected: "User is redirected to /login." }
    ]
  },
  {
    id: "GUARD-002",
    title: "[GUARD-002] Should redirect unauthenticated users from users page to login",
    module: "Auth - Route Guard",
    category: "security",
    tags: "E2E; Playwright; Route Guard",
    automationPath: "tests/auth/route-guard.spec.js",
    priority: "2",
    steps: [
      { action: "Clear session and open /users without logging in.", expected: "User is redirected to /login." }
    ]
  },
  {
    id: "GUARD-003",
    title: "[GUARD-003] Should redirect unauthenticated users from products page to login",
    module: "Auth - Route Guard",
    category: "security",
    tags: "E2E; Playwright; Route Guard",
    automationPath: "tests/auth/route-guard.spec.js",
    priority: "2",
    steps: [
      { action: "Clear session and open /products without logging in.", expected: "User is redirected to /login." }
    ]
  },
  {
    id: "GUARD-004",
    title: "[GUARD-004] Should redirect to intended page after login",
    module: "Auth - Route Guard",
    category: "positive",
    tags: "E2E; Playwright; Route Guard",
    automationPath: "tests/auth/route-guard.spec.js",
    priority: "2",
    steps: [
      { action: "Clear session and navigate to /users.", expected: "User is redirected to /login." },
      { action: "Login with valid admin credentials.", expected: "User is redirected to /users and users table loads." }
    ]
  },
  {
    id: "DASH-001",
    title: "[DASH-001] Should display dashboard heading and total users stat",
    module: "Dashboard",
    category: "positive",
    tags: "E2E; Playwright; Dashboard",
    automationPath: "tests/dashboard/dashboard.spec.js",
    priority: "1",
    steps: [
      { action: "Login as admin.", expected: "Dashboard loads." },
      { action: "Verify Total Users stat card displays a numeric value.", expected: "UI total users count matches API total users count." }
    ]
  },
  {
    id: "DASH-002",
    title: "[DASH-002] Should show dashboard as default landing page after login",
    module: "Dashboard",
    category: "positive",
    tags: "E2E; Playwright; Dashboard",
    automationPath: "tests/dashboard/dashboard.spec.js",
    priority: "1",
    steps: [
      { action: "Login as admin with valid credentials.", expected: "URL is dashboard (/). Dashboard stats are visible." }
    ]
  },
  {
    id: "NAV-001",
    title: "[NAV-001] Should navigate between dashboard, users, and products",
    module: "Navigation",
    category: "positive",
    tags: "E2E; Playwright; Navigation",
    automationPath: "tests/navigation/navigation.spec.js",
    priority: "2",
    steps: [
      { action: "Login as admin.", expected: "Dashboard is displayed." },
      { action: "Click Users in navigation.", expected: "Users page loads (/users)." },
      { action: "Click Products in navigation.", expected: "Products page loads (/products)." },
      { action: "Click Dashboard in navigation.", expected: "Dashboard loads (/)." }
    ]
  },
  {
    id: "NAV-002",
    title: "[NAV-002] Should highlight active nav item",
    module: "Navigation",
    category: "ui-behavior",
    tags: "E2E; Playwright; Navigation",
    automationPath: "tests/navigation/navigation.spec.js",
    priority: "3",
    steps: [
      { action: "Login as admin and navigate to Users.", expected: "Users nav item has active highlight styling." }
    ]
  },
  {
    id: "ULIST-001",
    title: "[ULIST-001] Should load users table with pagination info",
    module: "Users - List",
    category: "positive",
    tags: "E2E; Playwright; Users",
    automationPath: "tests/users/users-list.spec.js",
    priority: "2",
    steps: [
      { action: "Login and open Users page.", expected: "Users table or empty state is visible. Total count and page info are displayed." }
    ]
  },
  {
    id: "ULIST-002",
    title: "[ULIST-002] Should refresh users list",
    module: "Users - List",
    category: "positive",
    tags: "E2E; Playwright; Users",
    automationPath: "tests/users/users-list.spec.js",
    priority: "3",
    steps: [
      { action: "Click Refresh on Users page.", expected: "Users table reloads successfully." }
    ]
  },
  {
    id: "ULIST-003",
    title: "[ULIST-003] Should paginate users",
    module: "Users - List",
    category: "positive",
    tags: "E2E; Playwright; Users; Pagination",
    automationPath: "tests/users/users-list.spec.js",
    priority: "3",
    steps: [
      { action: "If next page is enabled, click Next.", expected: "Page indicator changes. Previous page can be navigated back." }
    ]
  },
  {
    id: "ULIST-004",
    title: "[ULIST-004] Should change page size",
    module: "Users - List",
    category: "positive",
    tags: "E2E; Playwright; Users; Pagination",
    automationPath: "tests/users/users-list.spec.js",
    priority: "3",
    steps: [
      { action: "Set page size to 5.", expected: "At most 5 user rows are displayed." }
    ]
  },
  {
    id: "ULIST-005",
    title: "[ULIST-005] Should open user details drawer",
    module: "Users - List",
    category: "positive",
    tags: "E2E; Playwright; Users",
    automationPath: "tests/users/users-list.spec.js",
    priority: "3",
    steps: [
      { action: "Click View on first user row.", expected: "User details drawer opens with name and email." },
      { action: "Close details drawer.", expected: "Drawer is closed." }
    ]
  },
  {
    id: "UFILT-001",
    title: "[UFILT-001] Should search users with debounced query",
    module: "Users - Filters",
    category: "positive",
    tags: "E2E; Playwright; Users; Search",
    automationPath: "tests/users/users-filters.spec.js",
    priority: "2",
    steps: [
      { action: "Enter a known user email in search.", expected: "Table filters to matching user after debounce." }
    ]
  },
  {
    id: "UFILT-002",
    title: "[UFILT-002] Should filter users by role",
    module: "Users - Filters",
    category: "positive",
    tags: "E2E; Playwright; Users; Filter",
    automationPath: "tests/users/users-filters.spec.js",
    priority: "3",
    steps: [
      { action: "Filter by role Engineer.", expected: "All visible rows show role Engineer." }
    ]
  },
  {
    id: "UFILT-003",
    title: "[UFILT-003] Should filter users by status",
    module: "Users - Filters",
    category: "positive",
    tags: "E2E; Playwright; Users; Filter",
    automationPath: "tests/users/users-filters.spec.js",
    priority: "3",
    steps: [
      { action: "Filter by status Active.", expected: "Visible users show Active status." }
    ]
  },
  {
    id: "UFILT-004",
    title: "[UFILT-004] Should sort users by email column",
    module: "Users - Filters",
    category: "positive",
    tags: "E2E; Playwright; Users; Sort",
    automationPath: "tests/users/users-filters.spec.js",
    priority: "3",
    steps: [
      { action: "Click sort on Email column.", expected: "Users table remains visible with sorted data." }
    ]
  },
  {
    id: "UFILT-005",
    title: "[UFILT-005] Should select users and show selected count",
    module: "Users - Filters",
    category: "positive",
    tags: "E2E; Playwright; Users; Selection",
    automationPath: "tests/users/users-filters.spec.js",
    priority: "3",
    steps: [
      { action: "Select one user checkbox.", expected: "Selected count shows 'Selected: 1'. Bulk delete is available." }
    ]
  },
  {
    id: "UFILT-006",
    title: "[UFILT-006] Should select all visible users",
    module: "Users - Filters",
    category: "positive",
    tags: "E2E; Playwright; Users; Selection",
    automationPath: "tests/users/users-filters.spec.js",
    priority: "3",
    steps: [
      { action: "Click select-all checkbox.", expected: "Selected count matches number of visible rows." }
    ]
  },
  {
    id: "UCRUD-001",
    title: "[UCRUD-001] Should create a new user",
    module: "Users - CRUD",
    category: "positive",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "1",
    steps: [
      { action: "Click Add User and fill valid user form.", expected: "Success toast 'User created' appears. New user row is visible." }
    ]
  },
  {
    id: "UCRUD-002",
    title: "[UCRUD-002] Should validate required fields in user form",
    module: "Users - CRUD",
    category: "validation",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "2",
    steps: [
      { action: "Open create user modal and submit empty form.", expected: "Required field validation messages are displayed." }
    ]
  },
  {
    id: "UCRUD-003",
    title: "[UCRUD-003] Should show duplicate email error",
    module: "Users - CRUD",
    category: "negative",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "2",
    steps: [
      { action: "Create user via API, then attempt to create another user with same email in UI.", expected: "Server error about duplicate email is displayed." }
    ]
  },
  {
    id: "UCRUD-004",
    title: "[UCRUD-004] Should edit an existing user",
    module: "Users - CRUD",
    category: "positive",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "2",
    steps: [
      { action: "Open edit for existing user and update first/last name.", expected: "Success toast 'User updated'. Row shows updated name." }
    ]
  },
  {
    id: "UCRUD-005",
    title: "[UCRUD-005] Should delete a single user",
    module: "Users - CRUD",
    category: "positive",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "2",
    steps: [
      { action: "Click delete on user and confirm dialog.", expected: "Success toast 'Deleted'. User row is removed." }
    ]
  },
  {
    id: "UCRUD-006",
    title: "[UCRUD-006] Should bulk delete selected users",
    module: "Users - CRUD",
    category: "positive",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "2",
    steps: [
      { action: "Select multiple users and click Bulk Delete, then confirm.", expected: "Success toast 'Deleted'. Selected rows are removed." }
    ]
  },
  {
    id: "UCRUD-007",
    title: "[UCRUD-007] Should cancel delete from confirmation dialog",
    module: "Users - CRUD",
    category: "positive",
    tags: "E2E; Playwright; Users; CRUD",
    automationPath: "tests/users/users-crud.spec.js",
    priority: "3",
    steps: [
      { action: "Click delete on user and cancel confirmation.", expected: "User row remains in the table." }
    ]
  },
  {
    id: "PROD-001",
    title: "[PROD-001] Should load products grid with totals",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products",
    automationPath: "tests/products/products.spec.js",
    priority: "2",
    steps: [
      { action: "Login and open Products page.", expected: "Grid or empty state visible. Total and 'Selected: 0' displayed." }
    ]
  },
  {
    id: "PROD-002",
    title: "[PROD-002] Should refresh products grid",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products",
    automationPath: "tests/products/products.spec.js",
    priority: "3",
    steps: [
      { action: "Click Refresh on Products page.", expected: "Products grid reloads." }
    ]
  },
  {
    id: "PROD-003",
    title: "[PROD-003] Should search products",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Search",
    automationPath: "tests/products/products.spec.js",
    priority: "3",
    steps: [
      { action: "Search with partial product name.", expected: "Matching products appear in grid." }
    ]
  },
  {
    id: "PROD-004",
    title: "[PROD-004] Should filter products by status",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Filter",
    automationPath: "tests/products/products.spec.js",
    priority: "3",
    steps: [
      { action: "Filter by status Active.", expected: "Visible product cards show Active status." }
    ]
  },
  {
    id: "PROD-005",
    title: "[PROD-005] Should sort products by name ascending",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Sort",
    automationPath: "tests/products/products.spec.js",
    priority: "3",
    steps: [
      { action: "Select sort option name-asc.", expected: "Products grid remains visible with sort applied." }
    ]
  },
  {
    id: "PROD-006",
    title: "[PROD-006] Should change products page size",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Pagination",
    automationPath: "tests/products/products.spec.js",
    priority: "3",
    steps: [
      { action: "Set page size to 6.", expected: "At most 6 product cards are displayed." }
    ]
  },
  {
    id: "PROD-007",
    title: "[PROD-007] Should paginate products when multiple pages exist",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Pagination",
    automationPath: "tests/products/products.spec.js",
    priority: "3",
    steps: [
      { action: "If next page enabled, click Next.", expected: "Page indicator changes." }
    ]
  },
  {
    id: "PROD-008",
    title: "[PROD-008] Should select and deselect a product",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Selection",
    automationPath: "tests/products/products.spec.js",
    priority: "2",
    steps: [
      { action: "Toggle select on a product.", expected: "Selected count is 1. Toggle shows Selected." },
      { action: "Toggle same product again.", expected: "Selected count returns to 0." }
    ]
  },
  {
    id: "PROD-009",
    title: "[PROD-009] Should persist selected products after refresh",
    module: "Products",
    category: "positive",
    tags: "E2E; Playwright; Products; Selection",
    automationPath: "tests/products/products.spec.js",
    priority: "2",
    steps: [
      { action: "Select a product and refresh page.", expected: "Product remains selected after refresh." }
    ]
  }
];

function toCsvRows(testCases) {
  const header = [
    "ID",
    "Work Item Type",
    "Title",
    "Test Step",
    "Step Action",
    "Step Expected",
    "Area Path",
    "Assigned To",
    "State",
    "Priority",
    "Tags",
    "Test Case ID",
    "Module",
    "Category",
    "Automation Path"
  ];

  const rows = [header.join(",")];

  for (const tc of testCases) {
    tc.steps.forEach((step, index) => {
      const row = [
        "",
        "Test Case",
        tc.title,
        String(index + 1),
        step.action,
        step.expected,
        AZURE_CONFIG.areaPath,
        AZURE_CONFIG.assignedTo,
        AZURE_CONFIG.state,
        tc.priority ?? "2",
        tc.tags ?? "E2E; Playwright",
        tc.id,
        tc.module,
        tc.category,
        tc.automationPath
      ].map(csvEscape);
      rows.push(row.join(","));
    });
  }

  return rows.join("\n");
}

function main() {
  const loginData = loadTestData("auth/login.json");
  const allCases = [...buildLoginTestCases(loginData), ...MANUAL_TEST_CASES];

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  const csv = `\uFEFF${toCsvRows(allCases)}`;
  fs.writeFileSync(OUTPUT, csv, "utf8");

  console.log(`Exported ${allCases.length} test cases to ${OUTPUT}`);
}

main();
