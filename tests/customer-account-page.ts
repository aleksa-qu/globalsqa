import { Locator, Page, expect } from '@playwright/test';
import { LoginPage } from './login-page';

export class CustomerAccountPage extends LoginPage {
  readonly transactionsTab: Locator;
  readonly depositTab: Locator;
  readonly withdrawalTab: Locator;
  readonly logOutButton: Locator;
  readonly welcomeMessage: Locator;
  readonly yearDropdown: Locator;
  readonly depositButton: Locator;
  readonly amountToDepositField: Locator;
  readonly successfulDepositMessage: Locator;
  readonly withdrawalButton: Locator;
  readonly amountToWithdrawField: Locator;
  readonly transactionSuccessfulMessage: Locator;
  readonly transactionFailedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.transactionsTab = page.getByRole('button', { name: 'Transactions' });
    this.depositTab = page.getByRole('button', { name: 'Deposit' }).first();
    this.withdrawalTab = page.getByRole('button', { name: 'Withdrawl' });
    this.logOutButton = page.getByRole('button', { name: 'Logout' });
    this.welcomeMessage = page.getByText('Welcome', { exact: false });
    this.yearDropdown = page.locator('#accountSelect');
    this.depositButton = page.getByRole('form').getByRole('button', { name: 'Deposit' });
    this.amountToDepositField = page.getByPlaceholder('amount');
    this.successfulDepositMessage = page.getByText('Deposit Successful', { exact: false });
    this.withdrawalButton = page.getByRole('button', { name: 'Withdraw', exact: true });
    this.amountToWithdrawField = page.getByPlaceholder('amount');
    this.transactionSuccessfulMessage = page.getByText('Transaction successful', { exact: false });
    this.transactionFailedMessage = page.getByText(
      'Transaction Failed. You can not withdraw amount more than the balance.',
      { exact: false },
    );
  }

  async deposit(amount: number) {
    await this.depositTab.click();
    await this.amountToDepositField.fill(amount.toString());
    await this.depositButton.click();
    await expect.soft(this.successfulDepositMessage).toBeVisible();
  }

  async withdraw(amount: number) {
    await this.withdrawalTab.click();
    await this.amountToWithdrawField.fill(amount.toString());
    await this.withdrawalButton.click();
    await expect.soft(this.transactionSuccessfulMessage).toBeVisible();
  }

  async withdrawSuccessOrFailed(amount: number): Promise<'success' | 'failed'> {
    await this.withdrawalTab.click();
    await this.amountToWithdrawField.fill(amount.toString());
    await this.withdrawalButton.click();

    const success = this.transactionSuccessfulMessage;
    const failure = this.transactionFailedMessage;

    const result = await Promise.race([
      success.waitFor({ state: 'visible' }).then(() => 'success' as const),
      failure.waitFor({ state: 'visible' }).then(() => 'failed' as const),
    ]);

    return result;
  }
}
