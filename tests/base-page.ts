import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly homeButton: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.logo = page.getByText('XYZ Bank');
    this.homeButton = page.getByRole('button', { name: 'Home' });
  }
}
