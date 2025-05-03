import { Router } from 'express';

import { Routes } from '@/interfaces/routes.interface';
import UserController from '@/controllers/user.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import ValidationMiddleware from '@/middlewares/validation.middleware';
import {
  addUserSchema,
  deleteUserSchema,
  getUserSchema,
  updateUserSchema,
} from '@/validator/user.validator';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AddUserRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [Admin, User, Guest]
 *           description: User's role
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         role: User
 *     UpdateUserRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [Admin, User, Guest]
 *           description: User's role
 *       example:
 *         firstName: Jane
 *         lastName: Smith
 *         email: jane.smith@example.com
 *         role: Admin
 *     UserIdParam:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique identifier of the user
 *       example:
 *         userId: 12345
 */

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /user:
     *   post:
     *     summary: Add a new user
     *     tags: [User]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AddUserRequest'
     *     responses:
     *       201:
     *         description: User added successfully
     *       400:
     *         description: Invalid input data
     */
    this.router.post(
      this.path,
      authMiddleware,
      ValidationMiddleware(addUserSchema),
      this.userController.addUser
    );

    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Get all users
     *     tags: [User]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: List of users retrieved successfully
     *       401:
     *         description: Unauthorized
     */
    this.router.get(this.path, authMiddleware, this.userController.getUsers);

    /**
     * @swagger
     * /user/{userId}:
     *   get:
     *     summary: Get a user by ID
     *     tags: [User]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/UserIdParam'
     *         description: ID of the user to retrieve
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *       404:
     *         description: User not found
     */
    this.router.get(
      `${this.path}/:userId`,
      authMiddleware,
      ValidationMiddleware(getUserSchema),
      this.userController.getUser
    );

    /**
     * @swagger
     * /user/{userId}:
     *   put:
     *     summary: Update a user by ID
     *     tags: [User]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/UserIdParam'
     *         description: ID of the user to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserRequest'
     *     responses:
     *       200:
     *         description: User updated successfully
     *       400:
     *         description: Invalid input data
     *       404:
     *         description: User not found
     */
    this.router.put(
      `${this.path}/:userId`,
      authMiddleware,
      ValidationMiddleware(updateUserSchema),
      this.userController.updateUser
    );

    /**
     * @swagger
     * /user/{userId}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [User]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/UserIdParam'
     *         description: ID of the user to delete
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       404:
     *         description: User not found
     */
    this.router.delete(
      `${this.path}/:userId`,
      authMiddleware,
      ValidationMiddleware(deleteUserSchema),
      this.userController.deleteUser
    );

    /**
     * @swagger
     * /user/seed/users:
     *   post:
     *     summary: Seed the database with multiple users
     *     tags: [User]
     *     responses:
     *       201:
     *         description: Users seeded successfully
     *       400:
     *         description: Invalid input data
     */
    this.router.post(`${this.path}/seed/users`, this.userController.seedUsers);

    /**
     * @swagger
     * /user/delete/users:
     *   post:
     *     summary: Delete all users in the database
     *     tags: [User]
     *     responses:
     *       201:
     *         description: Users deleted successfully
     *       400:
     *         description: Invalid input data
     */
    this.router.post(
      `${this.path}/delete/users`,
      this.userController.seedUsers
    );
  }
}

export default UserRoute;
