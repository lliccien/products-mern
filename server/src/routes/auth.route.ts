import { Router } from 'express'
import AuthController from '@controllers/auth.controller'
import { CreateUserDto } from '@dtos/users.dto'
import { Routes } from '@interfaces/routes.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import authMiddleware from '@/middlewares/auth.middleware'

class AuthRoute implements Routes {
  public path = '/'
  public router = Router()
  public authController = new AuthController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    /**
     * @swagger
     * components:
     *  schemas:
     *    User:
     *      type: object
     *      properties:
     *        _id:
     *          type: string
     *          format: uuid
     *          description: The uuid unique of user.
     *        email:
     *          type: string
     *          format: email
     *          description: The email unique of user.
     *        password:
     *          type: string
     *          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})$'
     *          format: password
     *          description: The password of user.
     *      reqired:
     *        - _id
     *        - email
     *        - passqord
     *      example:
     *        _id: 49ade180-932f-492f-aeb5-92b801aef423
     *        email: user@example.com
     *        password: 12345Aa!
     *    UserBody:
     *      type: object
     *      properties:
     *        email:
     *          type: string
     *          format: email
     *          description: The email unique of user.
     *        password:
     *          type: string
     *          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})$'
     *          format: password
     *          description: The password of user.
     *      example:
     *        email: user@example.com
     *        password: 12345Aa!
     *    RefreshTokenBody:
     *      type: object
     *      properties:
     *        refresh:
     *          type: string
     *          description: Refresh token JWT
     *      example:
     *        refreshToken: JWT
     *    Error:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *          description: Error definicion.
     *    MessageToken:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *          description: Message definicion.
     *        token:
     *          type: object
     *          properties:
     *            access:
     *              type: string
     *              description: Access token JWT
     *            refresh:
     *              type: string
     *              description: Refresh token JWT
     *
     */

    /**
     * @swagger
     *  tags:
     *    name: Authentication
     *    description: Authentication endpoints.
     */

    /**
     * @swagger
     * /signup:
     *  post:
     *    summary: Sign up new user.
     *    tags: [Authentication]
     *    requestBody:
     *      description: A Json object containing user information.
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/User'
     *    responses:
     *      201:
     *        description: The user was successfully signed up.
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/MessageToken'
     *            example:
     *              message: Signup
     *              token:
     *                access: JWT
     *                refresh: JWT
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            examples:
     *              user:
     *                value:
     *                 message: User data not sent
     *              password:
     *                value:
     *                  message: Password is not valid
     *      409:
     *        description: Conflict
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Email already exists
     */
    this.router.post(
      `${this.path}signup`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.signUp
    )

    /**
     * @swagger
     * /login:
     *  post:
     *    summary: Login with existing a user
     *    tags: [Authentication]
     *    requestBody:
     *      description: A Json object containing user information.
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UserBody'
     *    responses:
     *      200:
     *        description: The successfully login.
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/MessageToken'
     *            example:
     *              message: Login
     *              token:
     *                access: JWT
     *                refresh: JWT
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User data not sent
     *      409:
     *        description: Conflict
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            examples:
     *              email:
     *                value:
     *                 message: Email not found
     *              password:
     *                value:
     *                  message: Password not matching
     */
    this.router.post(
      `${this.path}login`,
      validationMiddleware(CreateUserDto, 'body', true),
      this.authController.logIn
    )

    /**
     * @swagger
     * /refresh-token:
     *  post:
     *    sumary: Request refresh token
     *    tags: [Authentication]
     *    requestBody:
     *      description: a Json object containing refresh token JWT
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/RefreshTokenBody'
     *    responses:
     *      200:
     *        description: The successfully refresh token.
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/MessageToken'
     *            example:
     *              message: refresh-token
     *              token:
     *                access: JWT
     *                refresh: JWT
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Refresh token no found'
     */
    this.router.post(`${this.path}refresh-token`, this.authController.refreshToken)

    /**
     * @swagger
     * /logout:
     *  post:
     *    summary: Logout user.
     *    security:
     *      - bearerAuth: []
     *    tags: [Authentication]
     *    responses:
     *      200:
     *        description: The successfully login.
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: logout
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User data not sent
     *      409:
     *        description: Conflict
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Email not found
     */
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut)
  }
}

export default AuthRoute
