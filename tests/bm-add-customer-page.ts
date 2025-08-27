import { Locator, Page } from '@playwright/test';
import { BankManagerLoginPage } from './bank-manager-login-page';
import { faker } from '@faker-js/faker';

export class BmAddCustomerPage extends BankManagerLoginPage {
  readonly firstnameField: Locator;
  readonly lastnameField: Locator;
  readonly postCodeField: Locator;
  readonly addCustomerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstnameField = page.locator('input[ng-model="fName"]');
    this.lastnameField = page.locator('input[ng-model="lName"]');
    this.postCodeField = page.locator('input[ng-model="postCd"]');
    this.addCustomerButton = page.getByRole('form').getByRole('button', { name: 'Add Customer' });
  }

  async addCustomer(): Promise<{ firstName: string; lastName: string; postCode: string }> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const postCode = faker.location.zipCode();

    await this.firstnameField.fill(firstName);
    await this.lastnameField.fill(lastName);
    await this.postCodeField.fill(postCode);
    await this.addCustomerButton.click();

    this.page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    return { firstName, lastName, postCode };
  }
  async addSpecialCustomer(
    firstName: string,
    lastName: string,
    postCode: string,
  ): Promise<{ firstName: string; lastName: string; postCode: string }> {
    this.page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await this.firstnameField.fill(firstName);
    await this.lastnameField.fill(lastName);
    await this.postCodeField.fill(postCode);
    await this.addCustomerButton.click();

    return { firstName, lastName, postCode };
  }
}
