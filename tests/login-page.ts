import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { SERVICE_URL } from '../config/env-data';

export class LoginPage extends BasePage {
  readonly url: string = SERVICE_URL;
  readonly customerButton: Locator;
  readonly bankManagerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.customerButton = page.getByRole('button', { name: 'Customer Login' });
    this.bankManagerButton = page.getByRole('button', { name: 'Bank Manager Login' });
  }

  async open() {
    await this.page.goto(this.url);
  }
}
