import { Locator, Page, expect } from '@playwright/test';
import { BankManagerLoginPage } from './bank-manager-login-page';

export class BmCustomersListPage extends BankManagerLoginPage {
  readonly searchCustomerField: Locator;
  readonly customerListTable: Locator;
  readonly firstNameColumn: Locator;
  readonly lastNameColumn: Locator;
  readonly postCodeColumn: Locator;
  readonly accountNumberColumn: Locator;
  readonly deleteButton: Locator;
  readonly customersTable: Locator;

  constructor(page: Page) {
    super(page);
    this.searchCustomerField = page.locator('input[ng-model="searchCustomer"]');
    this.customerListTable = page.locator('table.table.table-bordered.table-striped');
    this.firstNameColumn = page.locator('th[ng-click*="fName"]');
    this.lastNameColumn = page.locator('th[ng-click*="lName"]');
    this.postCodeColumn = page.locator('th[ng-click*="postCd"]');
    this.accountNumberColumn = page.locator('th:nth-child(4)');
    this.deleteButton = page.locator('button[ng-click="deleteCust(cust)"]');
    this.customersTable = page.locator('.marTop > div');
  }
  async deleteCustomerManually(customerName: string): Promise<void> {
    await this.searchCustomerField.fill(customerName);
    const customerRow = this.customerListTable.locator('tbody tr').first();
    await customerRow.waitFor({ state: 'visible' });
    await customerRow.locator('button[ng-click="deleteCust(cust)"]').click();
    await expect(customerRow).toHaveCount(0);
  }

  async deleteCustomer(customerName: string): Promise<void> {
    const rows = this.customerListTable.locator('tbody tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.textContent();

      if (rowText && rowText.includes(customerName)) {
        await row.locator('button[ng-click="deleteCust(cust)"]').click();
        return;
      }
    }
    throw new Error(`Customer "${customerName}" not found in the list.`);
  }
}
