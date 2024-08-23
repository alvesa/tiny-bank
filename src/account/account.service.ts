import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  createAccount(userEmail: string) {
    return this.accountRepository.createAccount({
      balance: 0,
      number: Math.random().toString().slice(2, 10), // TODO: use uuid
      userEmail: userEmail,
      isActive: true,
    });
  }

  deposit(accountNumber: string, amount: number) {
    return this.accountRepository.deposit(accountNumber, amount);
  }

  withdraw(accountNumber: string, amount: number) {
    return this.accountRepository.withdraw(accountNumber, amount);
  }

  transfer(fromAccountNumber: string, toAccountNumber: string, amount: number) {
    return this.accountRepository.transfer(
      fromAccountNumber,
      toAccountNumber,
      amount,
    );
  }

  getBalance(accountNumber: string) {
    return this.accountRepository.getBalance(accountNumber);
  }

  getHistory(accountNumber: string) {
    return this.accountRepository.getHistory(accountNumber);
  }

  deactivateAccounts(userEmail: string) {
    return this.accountRepository.deactivateAccounts(userEmail);
  }

  getAllAccounts(userEmail: string) {
    return this.accountRepository.getAllAccounts(userEmail);
  }
}
