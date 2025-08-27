import { Locator, Page } from '@playwright/test';
import { CustomerAccountPage } from './customer-account-page';

export interface Transaction {
  date: string;
  amount: string;
  type: string;
  balance: string;
}

export class CTransactionsPage extends CustomerAccountPage {
  readonly backButton: Locator;
  readonly resetButton: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly tableOverview: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly topButton: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.startDate = page.locator('#start');
    this.endDate = page.locator('#end');
    this.tableOverview = page.locator('table.table');
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.topButton = page.getByRole('button', { name: 'Top' });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactions: Transaction[] = [];

    await this.tableOverview.waitFor({ state: 'visible', timeout: 5000 });

    do {
      const rows = this.tableOverview
        .locator('tr')
        .filter({ has: this.tableOverview.locator('td') });
      const rowCount = await rows.count();

      if (rowCount === 0) break; // no rows, exit loop

      for (let i = 0; i < rowCount; i++) {
        const cells = rows.nth(i).locator('td');
        const cellCount = await cells.count();
        if (cellCount < 4) continue;

        const date = await cells.nth(0).innerText();
        const amount = await cells.nth(1).innerText();
        const type = await cells.nth(2).innerText();
        const balance = await cells.nth(3).innerText();

        transactions.push({ date, amount, type, balance });
      }

      if (await this.nextButton.isEnabled()) {
        await this.nextButton.click();
        await this.page.waitForTimeout(300);
      } else {
        break;
      }
    } while (true);

    return transactions;
  }
}
