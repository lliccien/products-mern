import { Router } from 'express'
import UsersController from '@controllers/users.controller'
import { CreateUserDto } from '@dtos/users.dto'
import { Routes } from '@interfaces/routes.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import authMiddleware from '@/middlewares/auth.middleware'

class UsersRoute implements Routes {
  public path = '/users'
  public router = Router()
  public usersController = new UsersController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    /**
     * @swagger
     * components:
     *  securitySchemes:
     *    bearerAuth:
     *      type: http
     *      scheme: bearer
     *      bearerFormat: JWT
     *
     *  schemas:
     *    User:
     *      type: object
     *      properties:
     *        _id:
     *          type: string
     *          format: uuid
     *          description: The uuid unique for user.
     *        email:
     *          type: string
     *          format: email
     *          description: The email of user.
     *        password:
     *          type: string
     *          format: passwrod
     *          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})$'
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
     *    Error:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *          description: Error definicion.
     *    Message:
     *      type: object
     *      properties:
     *        message:
     *          type: string
     *          description: Message definicion.
     *
     *  parameters:
     *    idParam:
     *      name: _id
     *      in: path
     *      description: Identificator unique uuid.
     *      required: true
     *      schema:
     *        type: string
     *        format: uuid
     */

    /**
     * @swagger
     *  tags:
     *    name: Users
     *    description: Users endpoints.
     */

    /**
     * @swagger
     * /users:
     *  get:
     *    summary: Return a Users list.
     *    security:
     *      - bearerAuth: []
     *    tags: [Users]
     *    responses:
     *      200:
     *        description: List of Users.
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: '#/components/schemas/User'
     *      401:
     *        description: Unauthorized
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Wrong authentication token
     *      403:
     *        description: Forbidden
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Authentication token missing
     */
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers)

    /**
     * @swagger
     * /users/{_id}:
     *  get:
     *    summary: Returns a user by Id
     *    security:
     *      - bearerAuth: []
     *    tags: [Users]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    responses:
     *      200:
     *        description: Found user
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/User'
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User id required
     *      404:
     *        description: Not Found
     *        content:
     *          aplication/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User no found
     */
    this.router.get(`${this.path}/:_id`, authMiddleware, this.usersController.getUserById)

    /**
     * @swagger
     * /users/{_id}:
     *  post:
     *    summary: Create new user
     *    security:
     *      - bearerAuth: []
     *    tags: [Users]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UserBody'
     *    responses:
     *      201:
     *        description: The user was successfully created
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: Created
     *      400:
     *        description: Bad request
     *        content:
     *          aplication/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            examples:
     *              data:
     *                value:
     *                  message: User data not sent
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
     *              message: User id or email already exists
     */
    this.router.post(
      `${this.path}/:_id`,
      authMiddleware,
      validationMiddleware(CreateUserDto, 'params', true),
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.createUser
    )

    /**
     * @swagger
     * /userss{_id}:
     *  put:
     *    summary: Update user by Id
     *    security:
     *      - bearerAuth: []
     *    tags: [Users]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UserBody'
     *    responses:
     *      200:
     *        description: The user was updated
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: Updated
     *      400:
     *        description: Bad request
     *        content:
     *           application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            examples:
     *              id:
     *                value:
     *                 message: User id required
     *              data:
     *                value:
     *                  message: User data not sent
     *      404:
     *        description: Not Fount
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User no found
     *      409:
     *        description: Conflict
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: Email can not changed
     */
    this.router.put(
      `${this.path}/:_id`,
      authMiddleware,
      validationMiddleware(CreateUserDto, 'params', true),
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.updateUser
    )

    /**
     * @swagger
     * /Users/{_id}:
     *  delete:
     *    summary: Delete user by Id
     *    security:
     *      - bearerAuth: []
     *    tags: [Users]
     *    parameters:
     *      - $ref: '#/components/parameters/idParam'
     *    responses:
     *      200:
     *        description: The user was deleted
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Message'
     *            example:
     *              message: Deleted
     *      400:
     *        description: Bad request
     *        content:
     *          aplication/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User id required
     *      404:
     *        description: Not Fount
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Error'
     *            example:
     *              message: User no found
     */
    this.router.delete(`${this.path}/:_id`, authMiddleware, this.usersController.deleteUser)
  }
}

export default UsersRoute
