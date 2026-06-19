# Azure DevOps Test Case Import

CSV export of all Playwright E2E test cases for Azure Test Plans.

## File

`exports/azure-devops-testcases.csv`

## Regenerate

```bash
cd selenium/playwright
node scripts/exportAzureDevOpsTestCases.js
```

Login scenarios are auto-generated from `testdata/auth/login.json`. All other modules are defined in the export script.

## Before importing — update placeholders

Edit `scripts/exportAzureDevOpsTestCases.js` and set:

```javascript
const AZURE_CONFIG = {
  areaPath: "YourProject\\YourArea",      // must match Azure DevOps Area Path
  assignedTo: "you@yourcompany.com",       // valid org user email
  state: "Design"
};
```

Then re-run the export script.

## Import into Azure DevOps

1. Open your project in **Azure DevOps**
2. Go to **Test Plans** → select or create a **Test Plan**
3. Select or create a **Test Suite**
4. Click **⋯** (suite menu) → **Import test cases from CSV/XLSX**
5. Upload `exports/azure-devops-testcases.csv`
6. Map columns in the wizard (required Azure fields are included):
   - **Work Item Type** → `Test Case`
   - **Title**
   - **Test Step**
   - **Step Action**
   - **Step Expected**
   - **Area Path**
   - **Assigned To**
   - **State** → `Design`
7. Complete import and review imported work items

## CSV columns

| Column | Purpose |
|--------|---------|
| ID | Empty (creates new test cases) |
| Work Item Type | `Test Case` |
| Title | Test case title with ID prefix |
| Test Step | Step number (1, 2, 3…) |
| Step Action | Manual test step action |
| Step Expected | Expected result per step |
| Area Path | Azure area (update before import) |
| Assigned To | Owner email (update before import) |
| State | `Design` |
| Priority | 1 = high, 2 = medium, 3 = low |
| Tags | Semicolon-separated tags |
| Test Case ID | Framework ID (LOGIN-001, UCRUD-003, …) |
| Module | Feature area |
| Category | positive / validation / security / etc. |
| Automation Path | Playwright spec file path |

## Test case count

- **Auth - Login:** 17 (from JSON scenarios)
- **Auth - Logout:** 2
- **Auth - Route Guard:** 4
- **Dashboard:** 2
- **Navigation:** 2
- **Users - List:** 5
- **Users - Filters:** 6
- **Users - CRUD:** 7
- **Products:** 9

**Total: 54 test cases**

## Notes

- Save file as **UTF-8** (BOM included for Excel compatibility)
- Each test step is a separate CSV row; Title repeats per step (Azure requirement)
- Extra columns (Tags, Test Case ID, Module) map via import wizard if your process supports them
- Link automated tests in Azure DevOps using **Automation Status** after import
