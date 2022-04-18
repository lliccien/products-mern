import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { SECRET_KEY, SECRET_REFRESH, EXPIRES_TOKEN, EXPIRES_REFRESH } from '@config'
import { CreateUserDto } from '@dtos/users.dto'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, JwtPayload, TokenData } from '@interfaces/auth.interface'
import { User } from '@interfaces/users.interface'
import userModel from '@models/users.model'
import { isEmpty } from '@utils/util'
import RedisServise from '@services/redis.service'

class AuthService {
  // public users = userModel
  public redisService = new RedisServise()
  public passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  public secretKey = SECRET_KEY || 'secretKey'
  public secretRefresh = SECRET_REFRESH || 'secretRefresh'
  public expiresToken = EXPIRES_TOKEN || '1d'
  public expiresRefresh = EXPIRES_REFRESH || '2d'

  public async signup(
    userData: CreateUserDto
  ): Promise<{ token: TokenData; createUserData: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not sent')

    if (!this.passwordRegex.test(userData.password))
      throw new HttpException(400, 'Password is not valid')

    const findUser: User | null = await userModel.findOne({ email: userData.email })
    if (findUser) throw new HttpException(409, `Email ${userData.email} already exists`)

    const hashedPassword = await hash(userData.password, 10)
    const createUserData: User | null = await userModel.create({
      ...userData,
      password: hashedPassword
    })

    const token = this.createToken(createUserData)

    const key = createUserData._id
    const value = token.refresh

    await this.redisService.del(key)

    await this.redisService.set({ key, value })

    return { token, createUserData }
  }

  public async login(userData: CreateUserDto): Promise<{ token: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not sent')

    const findUser: User | null = await userModel.findOne({ email: userData.email })
    if (!findUser) throw new HttpException(409, `Email ${userData.email} not found`)

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password)
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching')

    const token = this.createToken(findUser)

    const key = findUser._id
    const value = token.refresh

    await this.redisService.del(key)

    await this.redisService.set({ key, value })

    return { token, findUser }
  }

  public async refreshToken(refreshToken: string): Promise<{ token: TokenData }> {
    const secretRefresh: string = SECRET_REFRESH!
    const { _id } = verify(refreshToken, secretRefresh) as JwtPayload
    const findUser: User | null = await userModel.findOne({ _id })
    if (!findUser) throw new HttpException(400, `Refresh token not found`)

    const redisId = await this.redisService.get(_id)
    if (!redisId) throw new HttpException(400, 'Refresh token no found')

    const token = this.createToken(findUser)

    const key = _id
    const value = token.refresh

    await this.redisService.del(key)

    await this.redisService.set({ key, value })

    return { token }
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data not sent')

    const findUser: User | null = await userModel.findOne({ email: userData.email })
    if (!findUser) throw new HttpException(409, `Email ${userData.email} not found`)

    await this.redisService.del(findUser._id)

    return findUser
  }

  private createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id }

    const access = sign(dataStoredInToken, this.secretKey, { expiresIn: this.expiresToken })

    const refresh = sign(dataStoredInToken, this.secretRefresh, {
      expiresIn: this.expiresRefresh
    })

    return { expiresIn: this.expiresToken, access, refresh }
  }
}

export default AuthService
