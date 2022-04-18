import { Request } from 'express'
import { User } from '@interfaces/users.interface'

export interface DataStoredInToken {
  _id: string
}

export interface TokenData {
  access: string
  refresh: string
  expiresIn: string
}

export interface RequestWithUser extends Request {
  user?: User
}

export interface JwtPayload {
  _id: string
}
