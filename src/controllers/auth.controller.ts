import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import { loginDto, signupDto } from '@/validator/auth.validator';

class AuthController {
  public authService = new AuthService();

  public signUp = async (
    req: Request<any, any, signupDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const data = await this.authService.signup(body);

      res.status(201).json({ data, message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (
    req: Request<{}, {}, loginDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const data = await this.authService.login(body);

      res.setHeader('Set-Cookie', [data.cookie]);
      res.status(200).json({
        data,
        message: 'Loggedin successfull',
      });
    } catch (error) {
      next(error);
    }
  };

  public profile = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.user;
      const data = await this.authService.profile(userData);

      res
        .status(201)
        .json({ data, message: 'User profile retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.user;
      const data = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
