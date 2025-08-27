import { test, expect } from '@playwright/test';
import { LoginPage } from './login-page';
import { CustomerAccountPage } from './customer-account-page';
import { CustomerLoginPage } from './customer-login-page';
import { CTransactionsPage } from './c-transactions-page';
import { BmAddCustomerPage } from './bm-add-customer-page';
import { BankManagerLoginPage } from './bank-manager-login-page';
import { BmOpenAccountPage } from './bm-open-account-page';
import { BmCustomersListPage } from './bm-customers-list-page';

let homePage: LoginPage;

test.beforeEach(async ({ page }) => {
  homePage = new LoginPage(page);
  await homePage.open();
});

test('all elements on the home page are visible', async ({ page }) => {
  await expect.soft(homePage.logo).toBeVisible();
  await expect.soft(homePage.logo).toHaveText('XYZ Bank');
  await expect.soft(homePage.homeButton).toBeVisible();
  await expect.soft(homePage.customerButton).toBeVisible();
  await expect.soft(homePage.bankManagerButton).toBeVisible();
});

test('login as a customer, all elements on the customer account page are visible', async ({
  page,
}) => {
  await homePage.customerButton.click();
  const customerLoginPage = new CustomerLoginPage(page);
  await customerLoginPage.login('Harry Potter');
  const customCustomerAccountPage = new CustomerAccountPage(page);
  await expect.soft(customCustomerAccountPage.welcomeMessage).toBeVisible();
  await expect
    .soft(customCustomerAccountPage.welcomeMessage)
    .toHaveText(' Welcome Harry Potter !!');
  await expect.soft(customCustomerAccountPage.transactionsTab).toBeVisible();
  await expect.soft(customCustomerAccountPage.depositTab).toBeVisible();
  await expect.soft(customCustomerAccountPage.withdrawalTab).toBeVisible();
  await expect.soft(customCustomerAccountPage.yearDropdown).toBeVisible();
  await expect.soft(customCustomerAccountPage.logOutButton).toBeVisible();
  await expect.soft(customCustomerAccountPage.homeButton).toBeVisible();
  await expect.soft(customCustomerAccountPage.logo).toBeVisible();
});

test('login as a customer, check all transactions, reset, deposit a sum of money, withdraw a sum of money, logout', async ({
  page,
}) => {
  await homePage.customerButton.click();
  const customerLoginPage = new CustomerLoginPage(page);
  await customerLoginPage.login('Hermoine Granger');
  const customerAccountPage = new CustomerAccountPage(page);
  await customerAccountPage.transactionsTab.click();
  const cTransactionsPage = new CTransactionsPage(page);
  await cTransactionsPage.startDate.fill('2015-02-01T00:00');
  await cTransactionsPage.endDate.fill('2015-02-15T23:59');
  const febTransactions = await cTransactionsPage.getAllTransactions();
  console.log(febTransactions);
  await cTransactionsPage.resetButton.click();
  await expect.soft(cTransactionsPage.tableOverview.locator('tbody tr')).toHaveCount(0);
  await cTransactionsPage.backButton.click();
  await customerAccountPage.deposit(10000);
  await expect.soft(customerAccountPage.successfulDepositMessage).toHaveText(/Deposit Successful/i);
  await customerAccountPage.transactionsTab.click();
  await cTransactionsPage.backButton.click();
  await customerAccountPage.withdraw(20);
  await expect
    .soft(customerAccountPage.transactionSuccessfulMessage)
    .toHaveText(/Transaction successful/i);
  await customerAccountPage.logOutButton.click();
  await expect.soft(customerLoginPage.yourNameDropDownList).toBeVisible();
});

test('login as a customer, try to withdraw a sum of money larger than the balance', async ({
  page,
}) => {
  await homePage.customerButton.click();
  const customerLoginPage = new CustomerLoginPage(page);
  await customerLoginPage.login('Harry Potter');
  const customerAccountPage = new CustomerAccountPage(page);
  const result = await customerAccountPage.withdrawSuccessOrFailed(20);
  await expect(result).toBe('failed');
});

test('login as a bank manager, all elements on the bank managers page are visible', async ({
  page,
}) => {
  await homePage.bankManagerButton.click();
  const bankManagerLoginPage = new BankManagerLoginPage(page);
  await expect.soft(bankManagerLoginPage.addCustomerTab).toBeVisible();
  await expect.soft(bankManagerLoginPage.openAccountTab).toBeVisible();
  await expect.soft(bankManagerLoginPage.customersListTab).toBeVisible();
  await expect.soft(bankManagerLoginPage.homeButton).toBeVisible();
  await expect.soft(bankManagerLoginPage.logo).toHaveText('XYZ Bank');
});

test('login as a bank manager and create a customer', async ({ page }) => {
  await homePage.bankManagerButton.click();
  const bankManagerLoginPage = new BankManagerLoginPage(page);
  await bankManagerLoginPage.addCustomerTab.click();
  const bmAddCustomerPage = new BmAddCustomerPage(page);
  const customer = await bmAddCustomerPage.addCustomer();
  console.log(`Customer created: ${customer.firstName} ${customer.lastName}`);
});

test('login as a bank manager and open an account for the existing customer', async ({ page }) => {
  await homePage.bankManagerButton.click();
  const bankManagerLoginPage = new BankManagerLoginPage(page);
  await bankManagerLoginPage.openAccountTab.click();
  const bmOpenAccountPage = new BmOpenAccountPage(page);
  await bmOpenAccountPage.openAccount('Harry Potter', 'Dollar');
  console.log(`Opening account for customer: Harry Potter with currency: Dollar`);
});

test('login as a bank manager, check the existing customers and delete using search field one of them', async ({
  page,
}) => {
  await homePage.bankManagerButton.click();
  const bankManagerLoginPage = new BankManagerLoginPage(page);
  await bankManagerLoginPage.customersListTab.click();
  const bmCustomersListPage = new BmCustomersListPage(page);
  const rowsBefore = bmCustomersListPage.customerListTable.locator('tbody tr');
  await expect.soft(rowsBefore).toHaveCount(5);
  await bmCustomersListPage.deleteCustomerManually('Potter');
  const rowsAfter = bmCustomersListPage.customerListTable.locator('tbody tr');
  await expect.soft(rowsAfter).toHaveCount(0);
});

test('login as a bank manager, check the existing customers and delete one of them from the list', async ({
  page,
}) => {
  await homePage.bankManagerButton.click();
  const bankManagerLoginPage = new BankManagerLoginPage(page);
  await bankManagerLoginPage.customersListTab.click();
  const bmCustomersListPage = new BmCustomersListPage(page);
  const rowsBefore = bmCustomersListPage.customerListTable.locator('tbody tr');
  await expect.soft(rowsBefore).toHaveCount(5);
  await bmCustomersListPage.deleteCustomer('Potter');
  const rowsAfter = bmCustomersListPage.customerListTable.locator('tbody tr');
  await expect.soft(rowsAfter).toHaveCount(4);
});

test('login as a bank manager, add a customer, open an account for this customer, delete the customer and return to homepage', async ({
  page,
}) => {
  await homePage.bankManagerButton.click();
  const bankManagerLoginPage = new BankManagerLoginPage(page);
  await bankManagerLoginPage.addCustomerTab.click();
  const bmAddCustomerPage = new BmAddCustomerPage(page);
  const customer = await bmAddCustomerPage.addSpecialCustomer('Severus', 'Snape', 'E502JB');
  console.log(`Customer created: ${customer.firstName} ${customer.lastName}`);
  await bankManagerLoginPage.openAccountTab.click();
  const bmOpenAccountPage = new BmOpenAccountPage(page);
  await bmOpenAccountPage.openAccount('Severus Snape', 'Pound');
  console.log(`Account opened for Severus Snape in Pound`);
  await bankManagerLoginPage.customersListTab.click();
  const bmCustomersListPage = new BmCustomersListPage(page);
  const rowsBefore = bmCustomersListPage.customerListTable.locator('tbody tr');
  await expect.soft(rowsBefore).toHaveCount(6);
  await bmCustomersListPage.deleteCustomer('Snape');
  const rowsAfter = bmCustomersListPage.customerListTable.locator('tbody tr');
  await expect.soft(rowsAfter).toHaveCount(5);
  await bmCustomersListPage.homeButton.click();
  await expect.soft(homePage).toBeTruthy();
});
