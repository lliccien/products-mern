import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import request from 'supertest'
import App from '@/app'
import { CreateUserDto } from '@dtos/users.dto'
import AuthRoute from '@routes/auth.route'

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
})

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        email: 'test@email.com',
        password: 'q1w2E3r4!'
      }

      const authRoute = new AuthRoute()
      const users = authRoute.authController.authService.users

      users.findOne = jest.fn().mockReturnValue(null)
      users.create = jest.fn().mockReturnValue({
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([authRoute])
      return await request(app.getServer())
        .post(`/api${authRoute.path}signup`)
        .send(userData)
        .expect(201)
    })
  })

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData = {
        email: 'test@email.com',
        password: 'q1w2E3r4!!'
      }

      const authRoute = new AuthRoute()
      const users = authRoute.authController.authService.users

      users.findOne = jest.fn().mockReturnValue({
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([authRoute])
      return await request(app.getServer())
        .post(`/api${authRoute.path}login`)
        .send(userData)
        .expect(200)
    })
  })
})
