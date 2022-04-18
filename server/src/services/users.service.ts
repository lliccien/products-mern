import { hash } from 'bcrypt'
import { CreateUserDto } from '@dtos/users.dto'
import { HttpException } from '@exceptions/HttpException'
import { User } from '@interfaces/users.interface'
import userModel from '@models/users.model'
import { isEmpty } from '@utils/util'

class UserService {
  // public users = userModel
  public passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await userModel.find()
    return users
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User id required')

    const findUser: User | null = await userModel.findOne({ _id: userId })
    if (!findUser) throw new HttpException(404, 'User no found')

    return findUser
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not sent')

    if (!this.passwordRegex.test(userData.password))
      throw new HttpException(400, 'Password is not valid')

    const findUser: User | null = await userModel.findOne({
      $or: [{ _id: userData._id }, { email: userData.email }]
    })
    if (findUser) throw new HttpException(409, `User id or email already exists`)

    const hashedPassword = await hash(userData.password, 10)
    const createUserData: User = await userModel.create({ ...userData, password: hashedPassword })

    return createUserData
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User id required')

    if (isEmpty(userData)) throw new HttpException(400, 'User data not sent')

    if (userData.email) {
      const findUser: User | null = await userModel.findOne({ email: userData.email })
      if (findUser && findUser._id != userId && findUser.email != userData.email)
        throw new HttpException(409, `Email can not changed`)
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10)
      userData = { ...userData, password: hashedPassword }
    }

    const updateUserById: User | null = await userModel.findByIdAndUpdate(userId, { ...userData })

    if (!updateUserById) throw new HttpException(404, 'User no found')

    const findUser: User | null = await userModel.findOne({ _id: userId })

    return findUser!
  }

  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User id required')

    const deleteUserById: User | null = await userModel.findByIdAndDelete(userId)

    if (!deleteUserById) throw new HttpException(404, 'User no found')

    return deleteUserById
  }
}

export default UserService
