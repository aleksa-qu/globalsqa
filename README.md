XYZ Bank Playwright Tests

This repository contains automated end-to-end tests for the XYZ Bank demo application, implemented using Playwright
.

The tests cover:

Customer login, account operations, and transactions

Bank manager login, customer management, and account management

Verification of UI elements and workflows

Getting Started
1. Clone the repository https://github.com/aleksa-qu/globalsqa
2. Install dependencies npm install
3. Install Playwright npm init playwright@latest
4. Install dotenv: npm install dotenv --save

Running the Tests
1. Run all tests: npx playwright test
2. Run tests in headed mode (see the browser UI): npx playwright test --headed
3. Run a specific test file: npx playwright test tests/globalsqa.spec.ts
4. Run with UI mode: npx playwright test --ui

Test Scenarios

The suite covers the following workflows:

Customer

Verify all elements on the home page are visible.

Login as a customer and verify all elements on the account page.

Perform transactions: check history, reset, deposit, withdraw, logout.

Attempt withdrawal with insufficient funds.

Bank Manager

Verify all elements on the manager’s dashboard.

Add new customers.

Open accounts for existing customers.

Search and delete customers (via search field or direct delete).

Full flow: Add → Open account → Delete → Return to homepage.

Reports

After running tests, Playwright generates reports. To view them:
npx playwright show-report