import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import { signupSchema } from '@/validator/auth.validator';
import AuthController from '@controllers/auth.controller';
import authMiddleware from '@middlewares/auth.middleware';
import ValidationMiddleware from '@/middlewares/validation.middleware';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *       example:
 *         email: oluwayeluifeoluwa@gmail.com
 *         password: asdfghjkl
 *         firstName: Ifeoluwa
 *         lastName: Oluwayelu
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: oluwayeluifeoluwa@gmail.com
 *         password: asdfghjkl
 */

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /auth/signup:
     *   post:
     *     summary: Sign up a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupRequest'
     *     responses:
     *       201:
     *         description: User signed up successfully
     *       400:
     *         description: Invalid input data
     */
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(signupSchema),
      this.authController.signUp
    );

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Log in a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       401:
     *         description: Invalid credentials
     */
    this.router.post(`${this.path}/login`, this.authController.logIn);

    /**
     * @swagger
     * /auth:
     *   get:
     *     summary: Get user profile
     *     tags: [Auth]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *       401:
     *         description: Invalid User
     */
    this.router.get(this.path, authMiddleware, this.authController.profile);

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Log out a user
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: User logged out successfully
     */
    this.router.post(
      `${this.path}/logout`,
      authMiddleware,
      this.authController.logOut
    );
  }
}

export default AuthRoute;
