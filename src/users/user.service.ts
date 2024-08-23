import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AccountService } from '../account/account.service';
import { IAccount } from '../account/account.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountService: AccountService,
  ) {}
  createUser(user: any) {
    if (!user.email || !user.name) {
      throw new BadRequestException('Email, name and password are required');
    }

    const existingUser = this.userRepository.getUser(user.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const account = this.accountService.createAccount(user.email);

    user.accounts = [account];

    return this.userRepository.createUser(user);
  }

  assignAccountToUser(userEmail: string, account: IAccount) {
    return this.userRepository.assignAccountToUser(userEmail, account);
  }

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  getUser(email: string) {
    return this.userRepository.getUser(email);
  }

  deactivateUser(userEmail: string) {
    return this.userRepository.deactivateUser(userEmail);
  }
}
