import { NextFunction, Request, Response } from 'express'
import { CreateUserDto } from '@dtos/users.dto'
import { User } from '@interfaces/users.interface'
import userService from '@services/users.service'

class UsersController {
  public userService = new userService()

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser()

      res.status(200).json({ data: findAllUsersData, message: 'FindAll' })
    } catch (error) {
      next(error)
    }
  }

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params._id
      const findOneUserData: User = await this.userService.findUserById(userId)

      res.status(200).json({ data: findOneUserData, message: 'FindOne' })
    } catch (error) {
      next(error)
    }
  }

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params._id
      const userData: CreateUserDto = {
        _id: userId,
        email: req.body.email,
        password: req.body.password
      }
      await this.userService.createUser(userData)

      res.status(201).json({ message: 'Created' })
    } catch (error) {
      next(error)
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params._id
      const userData: CreateUserDto = req.body
      await this.userService.updateUser(userId, userData)

      res.status(200).json({ message: 'Updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params._id
      await this.userService.deleteUser(userId)

      res.status(200).json({ message: 'Deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default UsersController
