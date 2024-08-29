import { BadRequestException, Injectable } from '@nestjs/common';

export interface IAccount {
  number: string;
  balance: number;
  isActive: boolean;
  userEmail: string;
}

@Injectable()
export class AccountRepository {
  // static to simulate a stateful database
  private static accounts: IAccount[] = [];

  private static history: any[] = [];

  constructor() {}

  createAccount(account: IAccount) {
    AccountRepository.accounts.push({ ...account, isActive: true });

    return AccountRepository.accounts.find((a) => a.number === account.number);
  }

  deposit(accountNumber: string, amount: number) {
    const account = AccountRepository.accounts.find(
      (a) => a.number === accountNumber && a.isActive,
    );
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    AccountRepository.history.push({
      accountNumber,
      amount,
      type: 'deposit',
    });

    account.balance += amount;
  }

  withdraw(accountNumber: string, amount: number) {
    const account = AccountRepository.accounts.find(
      (a) => a.number === accountNumber,
    );
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    AccountRepository.history.push({
      accountNumber,
      amount,
      type: 'withdraw',
    });

    account.balance -= amount;
  }

  transfer(fromAccountNumber: string, toAccountNumber: string, amount: number) {
    this.withdraw(fromAccountNumber, amount);
    this.deposit(toAccountNumber, amount);
  }

  getBalance(accountNumber: string) {
    const account = AccountRepository.accounts.find(
      (a) => a.number === accountNumber,
    );
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    return account.balance;
  }

  getHistory(accountNumber: string) {
    const account = AccountRepository.accounts.find(
      (a) => a.number === accountNumber,
    );
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    return AccountRepository.history.filter(
      (h) => h.accountNumber === accountNumber,
    );
  }

  deactivateAccounts(userEmail: string) {
    AccountRepository.accounts.forEach((a) => {
      if (a.userEmail === userEmail) {
        a.isActive = false;
      }
    });
  }

  getAllAccounts(userEmail: string) {
    return AccountRepository.accounts.filter((a) => a.userEmail === userEmail);
  }

  static cleanUp() {
    AccountRepository.accounts = [];
    AccountRepository.history = [];
  }
}
