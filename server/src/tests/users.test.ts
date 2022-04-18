import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import request from 'supertest'
import App from '@/app'
import { CreateUserDto } from '@dtos/users.dto'
import UsersRoute from '@routes/users.route'
import AuthRoute from '@/routes/auth.route'

let token: string

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000))
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
    const response = await request(app.getServer())
      .post(`/api${authRoute.path}login`)
      .send(userData)

    token = response.body.token.access
  })
})

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response fineAll Users', async () => {
      const usersRoute = new UsersRoute()
      const users = usersRoute.usersController.userService.users

      users.find = jest.fn().mockReturnValue([
        {
          _id: '61dbe90a-a060-4765-957d-ddd9d9341f3e',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10)
        },
        {
          _id: '61dbe90a-a060-4765-957d-ddd9d9341f3e',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10)
        },
        {
          _id: '61dbe90a-a060-4765-957d-ddd9d9341f3e',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10)
        }
      ])
      ;(mongoose as any).connect = jest.fn()
      const app = new App([usersRoute])
      return request(app.getServer())
        .get(`/api${usersRoute.path}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })

  describe('[GET] /users/:id', () => {
    it('response findOne User', async () => {
      const userId = '61dbe90a-a060-4765-957d-ddd9d9341f3e'

      const usersRoute = new UsersRoute()
      const users = usersRoute.usersController.userService.users

      users.findOne = jest.fn().mockReturnValue({
        _id: '61dbe90a-a060-4765-957d-ddd9d9341f3e',
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([usersRoute])
      return request(app.getServer())
        .get(`/api${usersRoute.path}/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })

  xdescribe('[POST] /users:id', () => {
    it('response Create User', async () => {
      const userId = '49ade180-932f-492f-aeb5-92b801aef423'
      const userData: CreateUserDto = {
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        email: 'test@email.com',
        password: 'q1w2E3r4!!'
      }

      const usersRoute = new UsersRoute()
      const users = usersRoute.usersController.userService.users

      users.findOne = jest.fn().mockReturnValue(null)
      users.create = jest.fn().mockReturnValue({
        _id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([usersRoute])
      return request(app.getServer())
        .post(`/api${usersRoute.path}/${userId}`)
        .send(userData)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
    })
  })

  describe('[PUT] /users/:id', () => {
    it('response Update User', async () => {
      const userId = '61dbe90a-a060-4765-957d-ddd9d9341f3e'
      const userData: CreateUserDto = {
        _id: '61dbe90a-a060-4765-957d-ddd9d9341f3e',
        email: 'test@email.com',
        password: 'q1w2E3r4!!'
      }

      const usersRoute = new UsersRoute()
      const users = usersRoute.usersController.userService.users

      if (userData.email) {
        users.findOne = jest.fn().mockReturnValue({
          _id: userId,
          email: userData.email,
          password: await bcrypt.hash(userData.password, 10)
        })
      }

      users.findByIdAndUpdate = jest.fn().mockReturnValue({
        _id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([usersRoute])
      return request(app.getServer())
        .put(`/api${usersRoute.path}/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
    })
  })

  describe('[DELETE] /users/:id', () => {
    it('response Delete User', async () => {
      const userId = '61dbe90a-a060-4765-957d-ddd9d9341f3e'

      const usersRoute = new UsersRoute()
      const users = usersRoute.usersController.userService.users

      users.findByIdAndDelete = jest.fn().mockReturnValue({
        _id: '61dbe90a-a060-4765-957d-ddd9d9341f3e',
        email: 'test@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([usersRoute])
      return request(app.getServer())
        .delete(`/api${usersRoute.path}/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })
})
