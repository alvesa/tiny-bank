import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { UserService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';
import { AccountRepository } from './account.repository';

describe('Account Service', () => {
  let userService: UserService;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AccountService,
        UserService,
        UserRepository,
        AccountRepository,
      ],
      exports: [AccountService],
    }).compile();

    userService = module.get<UserService>(UserService);
    accountService = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    UserRepository.cleanUp();
  });

  it('should create account', () => {
    userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    const result = accountService.createAccount('email@example.com');

    expect(result).toMatchObject({
      balance: 0,
      isActive: true,
      number: expect.any(String),
      userEmail: 'email@example.com',
    });

    const user = userService.getUser('email@example.com');

    expect(user).toMatchObject({
      name: 'Andre',
      email: 'email@example.com',
      accounts: [
        {
          balance: 0,
          number: expect.any(String),
          userEmail: 'email@example.com',
          isActive: true,
        },
      ],
      isActive: true,
    });
  });

  it('should deposit in account', () => {
    userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    const user = userService.getUser('email@example.com');
    accountService.deposit(user.accounts[0].number, 100);
    const result = accountService.getBalance(user.accounts[0].number);
    expect(result).toEqual(100);
  });

  it('should be able to withdraw in account', () => {
    userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    const user = userService.getUser('email@example.com');
    accountService.deposit(user.accounts[0].number, 100);
    const balanceBefore = accountService.getBalance(user.accounts[0].number);
    expect(balanceBefore).toEqual(100);

    accountService.withdraw(user.accounts[0].number, 100);
    const balanceAfter = accountService.getBalance(user.accounts[0].number);
    expect(balanceAfter).toEqual(0);
  });

  it('should be able to transfer between accounts', () => {
    userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    userService.createUser({
      name: 'Andre Alves',
      email: 'email2@example.com',
    });

    const user1 = userService.getUser('email@example.com');
    accountService.deposit(user1.accounts[0].number, 100);

    const user2 = userService.getUser('email2@example.com');

    accountService.transfer(
      user1.accounts[0].number,
      user2.accounts[0].number,
      25,
    );

    const balanceUser1 = accountService.getBalance(user1.accounts[0].number);
    expect(balanceUser1).toEqual(75);

    const balanceUser2 = accountService.getBalance(user2.accounts[0].number);
    expect(balanceUser2).toEqual(25);
  });

  it('should be able to see transaction history', () => {
    userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    const user = userService.getUser('email@example.com');
    accountService.deposit(user.accounts[0].number, 100);
    accountService.deposit(user.accounts[0].number, 50);
    accountService.withdraw(user.accounts[0].number, 100);

    accountService.deposit(user.accounts[0].number, 100);
    accountService.withdraw(user.accounts[0].number, 50);
    accountService.withdraw(user.accounts[0].number, 50);

    const history = accountService.getHistory(user.accounts[0].number);

    expect(history.length).toEqual(6);
    expect(history.filter((x) => x.type === 'deposit')).toHaveLength(3);
    expect(history.filter((x) => x.type === 'withdraw')).toHaveLength(3);
  });
});
