import { Injectable, NotFoundException } from '@nestjs/common';
import { IAccount } from '../account/account.repository';
import { AccountService } from 'src/account/account.service';

export interface IUser {
  name: string;
  email: string;
  isActive: boolean;
  accounts: IAccount[];
}

@Injectable()
export class UserRepository {
  // static to simulate a stateful database
  private static users: IUser[] = [];

  constructor(private readonly accountService: AccountService) {}

  createUser(user: IUser) {
    return UserRepository.users.push({ ...user, isActive: true });
  }

  getAllUsers() {
    return UserRepository.users.filter((user) => user.isActive);
  }

  getUser(email: string) {
    return UserRepository.users.find(
      (user) => user.email === email && user.isActive,
    );
  }

  deactivateUser(userEmail: string) {
    const user = UserRepository.users.find((user) => user.email === userEmail);

    // Verify if user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify if there still balance in the account

    user.isActive = false;

    this.deactivateAccounts(user.email);
  }

  assignAccountToUser(userEmail: string, account: IAccount) {
    const user = UserRepository.users.find((user) => user.email === userEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.accounts = [...user.accounts, account];
  }

  private deactivateAccounts(userEmail: string) {
    UserRepository.users.forEach((account) => {
      if (account.email === userEmail) {
        account.isActive = false;
        this.accountService.deactivateAccounts(userEmail);
      }
    });
  }
}
