import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UserService } from '../users/user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('accounts')
@ApiTags('tiny-bank')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}

  @Post()
  createAccount(@Body() { userEmail }: { userEmail: string }) {
    const user = this.userService.getUser(userEmail);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const account = this.accountService.createAccount(userEmail);

    this.userService.assignAccountToUser(userEmail, account);

    return account;
  }

  @Post('deposit')
  deposit(
    @Body()
    { accountNumber, amount }: { accountNumber: string; amount: number },
  ) {
    return this.accountService.deposit(accountNumber, amount);
  }

  @Post('withdraw')
  withdraw(
    @Body()
    { accountNumber, amount }: { accountNumber: string; amount: number },
  ) {
    return this.accountService.withdraw(accountNumber, amount);
  }

  @Post('transfer')
  transfer(
    @Body()
    {
      fromAccountNumber,
      toAccountNumber,
      amount,
    }: {
      fromAccountNumber: string;
      toAccountNumber: string;
      amount: number;
    },
  ) {
    return this.accountService.transfer(
      fromAccountNumber,
      toAccountNumber,
      amount,
    );
  }

  @Get('balance/:accountNumber')
  getBalance(@Param('accountNumber') accountNumber: string) {
    return this.accountService.getBalance(accountNumber);
  }

  @Get('history/:accountNumber')
  getHistory(@Param('accountNumber') accountNumber: string) {
    return this.accountService.getHistory(accountNumber);
  }

  @Get(':userEmail')
  getAllAccounts(@Param('userEmail') userEmail: string) {
    return this.accountService.getAllAccounts(userEmail);
  }
}
