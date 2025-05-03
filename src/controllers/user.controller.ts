import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import UserService from '@/services/user.service';
import {
  addUserDto,
  deleteUserDto,
  getUserDto,
  updateUserDto,
} from '@/validator/user.validator';

class UserController {
  public userService = new UserService();

  public addUser = async (
    req: RequestWithUser<any, any, addUserDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.user;
      const body = req.body;
      const data = await this.userService.addUser(userData, body);

      res.status(200).json({ data, message: 'User added successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.user;
      const data = await this.userService.getUsers(userData);

      res.status(200).json({ data, message: 'Users retreived successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (
    req: RequestWithUser<getUserDto['params']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const userData = req.user;
      const data = await this.userService.getUser(userData, userId);

      res.status(200).json({ data, message: 'User retreived successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: RequestWithUser<updateUserDto['params'], null, updateUserDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const userData = req.user;
      const body = req.body;
      const data = await this.userService.updateUser(userData, userId, body);

      res.status(200).json({ data, message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: RequestWithUser<deleteUserDto['params']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const userData = req.user;
      const data = await this.userService.deleteUser(userData, userId);

      res.status(200).json({ data, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public seedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = this.userService.seedUsers();
      res.status(200).json({ data, message: 'Users seeded successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUsers = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.user;
      const data = this.userService.deleteAllUsers(userData);
      res.status(200).json({ data, message: 'Users deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
