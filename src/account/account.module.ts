import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { UserService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, UserService, UserRepository, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
