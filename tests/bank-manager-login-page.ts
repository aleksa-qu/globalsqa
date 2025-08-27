import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login-page';

export class BankManagerLoginPage extends LoginPage {
  readonly addCustomerTab: Locator;
  readonly openAccountTab: Locator;
  readonly customersListTab: Locator;

  constructor(page: Page) {
    super(page);
    this.addCustomerTab = page.getByRole('button', { name: 'Add Customer' });
    this.openAccountTab = page.getByRole('button', { name: 'Open Account' });
    this.customersListTab = page.getByRole('button', { name: 'Customers' });
  }
}
