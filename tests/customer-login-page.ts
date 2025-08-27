import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login-page';

export class CustomerLoginPage extends LoginPage {
  readonly yourNameDropDownList: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.yourNameDropDownList = page.locator('select#userSelect');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async login(customerName: string): Promise<void> {
    await this.yourNameDropDownList.selectOption({ label: customerName });
    await this.loginButton.click();
  }
}
