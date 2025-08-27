import { Locator, Page } from '@playwright/test';
import { BankManagerLoginPage } from './bank-manager-login-page';

export class BmOpenAccountPage extends BankManagerLoginPage {
  readonly customerDropDownList: Locator;
  readonly currencyDropDownList: Locator;
  readonly processButton: Locator;

  constructor(page: Page) {
    super(page);
    this.customerDropDownList = page.locator('select#userSelect');
    this.currencyDropDownList = page.locator('select#currency');
    this.processButton = page.locator('button[type="submit"]');
  }
  async openAccount(customerName: string, currency: string): Promise<void> {
    await this.customerDropDownList.selectOption({ label: customerName });
    await this.currencyDropDownList.selectOption({ label: currency });

    this.page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await this.processButton.click();
  }
}
