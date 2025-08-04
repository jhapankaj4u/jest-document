import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    signToken: jest.fn(),
    deleteToken: jest.fn()
  };
 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        
        { provide: UserService, useValue: mockUserService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('jwtSecrate'),
          },
        }  


      ]
    }) 
      .compile();

      userController = module.get<UserController>(UserController);
 
  });

  describe('register', () => {
    it('should register user and return message', async () => {
      const userMock = { id: 1, email: 'test@test.com' };
      mockUserService.register.mockResolvedValue(userMock);
      const result = await userController.register({ email: 'test@test.com', password: '123456' });

      expect(result).toEqual({
        message: 'User registered',
        user: { id: 1, email: 'test@test.com' },
      });
    });

    it('should throw if email exists', async () => {
      mockUserService.register.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
      await expect(
        userController.register({ email: 'test@test.com', password: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });
  
  });

  describe('login', () => {
    it('should login user and return message', async () => {
      const userMock = { id: 1, email: 'test@test.com' };
      mockUserService.validateUser.mockResolvedValue(userMock);
      mockUserService.signToken.mockResolvedValue('mock_token');

      const req:any = { headers: {} };
      const result = await userController.login(req, {
        email: 'test@test.com',
        password: '123456',
      }); 
      expect(result).toEqual({ token: 'mock_token' });
    });

    it('should throw if 401', async () => {
      mockUserService.validateUser.mockRejectedValue(null);
      const req:any = { headers: {} };
      await expect(
        userController.login(req, { email: 'wrong@test.com', password: 'wrong' }),
      ).rejects.toThrow(new UnauthorizedException("Unable to login"));
    });
  
  });


  describe('logout', () => {
    it('should call deleteToken and return message', async () => {
      const req:any = {
        headers: {
          authorization: 'Bearer mocktoken',
        },
      };
      const result = await userController.logout(req);
      expect(result).toEqual({ message: 'Logged out' });
    });

  })

});
