import { NextFunction, Request, Response } from 'express'
import { CreateUserDto } from '@dtos/users.dto'
import { RequestWithUser } from '@interfaces/auth.interface'
import { User } from '@interfaces/users.interface'
import AuthService from '@services/auth.service'

class AuthController {
  public authService = new AuthService()

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body
      const { token } = await this.authService.signup(userData)

      res.status(201).json({ message: 'Signup', token })
    } catch (error) {
      next(error)
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body
      const { token } = await this.authService.login(userData)

      res.status(200).json({ token, message: 'login' })
    } catch (error) {
      next(error)
    }
  }

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body?.refreshToken
      const { token } = await this.authService.refreshToken(refreshToken)
      res.status(200).json({ token, message: 'refresh-token' })
    } catch (error) {
      next(error)
    }
  }

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.user!)
      res.status(200).json({ message: 'logout' })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
