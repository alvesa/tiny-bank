import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { AccountModule } from '../account/account.module';

describe('User Service', () => {
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    UserRepository.cleanUp();
  });

  it('should create user', () => {
    const result = userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    expect(result).toEqual(1);

    const user = userService.getUser('email@example.com');

    expect(user.name).toBe('Andre');
  });

  it('should not create user case name or email are missing', () => {
    try {
      userService.createUser({
        name: 'Andre',
      });
    } catch (ex) {
      expect(ex.response).toMatchObject({
        message: 'Email, name and password are required',
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    try {
      userService.createUser({
        email: 'email@example.com',
      });
    } catch (ex) {
      expect(ex.response).toMatchObject({
        message: 'Email, name and password are required',
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  });

  it('should not create user, if the user already exists', () => {
    const result = userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    expect(result).toEqual(1);

    try {
      userService.createUser({
        name: 'Andre Copy',
        email: 'email@example.com',
      });
    } catch (ex) {
      expect(ex.response).toMatchObject({
        error: 'Bad Request',
        message: 'User already exists',
        statusCode: 400,
      });
    }
  });

  it('should deactivate user', () => {
    const result = userService.createUser({
      name: 'Andre',
      email: 'email@example.com',
    });

    expect(result).toEqual(1);

    const user = userService.getUser('email@example.com');
    expect(user.isActive).toBe(true);

    userService.deactivateUser('email@example.com');

    expect(user).toMatchObject({
      accounts: [
        {
          balance: 0,
          isActive: false,
          number: expect.any(String),
          userEmail: expect.any(String),
        },
      ],
      email: expect.any(String),
      isActive: false,
      name: expect.any(String),
    });
  });
});
