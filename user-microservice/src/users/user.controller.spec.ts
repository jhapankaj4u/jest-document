import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserController', () => {
    let controller: UserController;
    let userService: UserService;
  
    const mockUserService = {
      updateRole: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [
          {
            provide: UserService,
            useValue: mockUserService,
          },
        ],
      }).compile();
  
      controller = module.get<UserController>(UserController);
      userService = module.get<UserService>(UserService);
    });
  
    
  
    describe('updateUserRole', () => {
      it('should update user role and return success message', async () => {

        mockUserService.updateRole.mockResolvedValueOnce(undefined); 
  
        const response = await controller.updateUserRole('1', 'editor');
  
        expect(userService.updateRole).toHaveBeenCalledWith('1', 'editor');
        expect(response).toEqual({ message: 'Role has been assigned successfully' });
      });
  
      it('should throw InternalServerErrorException if update fails', async () => {
        mockUserService.updateRole.mockRejectedValueOnce(new Error('DB error'));
  
        await expect(controller.updateUserRole('1', 'viewer')).rejects.toThrow(
          InternalServerErrorException,
        );
  
        expect(userService.updateRole).toHaveBeenCalledWith('1', 'viewer');
      });
    });
  });