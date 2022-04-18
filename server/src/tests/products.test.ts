import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import request from 'supertest'
import App from '@/app'
import { CreateProductDto } from '@dtos/products.dto'
import ProductsRoute from '@routes/products.route'
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

describe('Testing Products', () => {
  describe('[GET] /products', () => {
    it('response fineAll Products', async () => {
      const productsRoute = new ProductsRoute()
      const products = productsRoute.productsController.productService.products

      products.find = jest.fn().mockReturnValue([
        {
          _id: '49ade180-932f-492f-aeb5-92b801aef423',
          name: 'product',
          description: 'example product',
          quantity: 100,
          amount: 12.3,
          image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
        }
      ])
      ;(mongoose as any).connect = jest.fn()
      const app = new App([productsRoute])
      return request(app.getServer())
        .get(`/api${productsRoute.path}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })

  describe('[GET] /products/:id', () => {
    it('response findOne User', async () => {
      const productId = '49ade180-932f-492f-aeb5-92b801aef423'

      const productsRoute = new ProductsRoute()
      const products = productsRoute.productsController.productService.products

      products.findOne = jest.fn().mockReturnValue({
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        name: 'product',
        description: 'example product',
        quantity: 100,
        amount: 12.3,
        image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([productsRoute])
      return request(app.getServer())
        .get(`/api${productsRoute.path}/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })

  describe('[POST] /products:id', () => {
    it('response Create User', async () => {
      const productId = '49ade180-932f-492f-aeb5-92b801aef423'
      const productData: CreateProductDto = {
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        name: 'product',
        description: 'example product',
        quantity: '100',
        amount: '12.3',
        image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
      }

      const productsRoute = new ProductsRoute()
      const products = productsRoute.productsController.productService.products

      products.findOne = jest.fn().mockReturnValue(null)
      products.create = jest.fn().mockReturnValue({
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        name: 'product',
        description: 'example product',
        quantity: 100,
        amount: 12.3,
        image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([productsRoute])
      return request(app.getServer())
        .post(`/api${productsRoute.path}/${productId}`)
        .send(productData)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
    })
  })

  describe('[PUT] /products/:id', () => {
    it('response Update User', async () => {
      const productId = '49ade180-932f-492f-aeb5-92b801aef423'
      const productData: CreateProductDto = {
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        name: 'product',
        description: 'example product',
        quantity: '100',
        amount: '12.3',
        image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
      }

      const productsRoute = new ProductsRoute()
      const products = productsRoute.productsController.productService.products

      if (productData.name) {
        products.findOne = jest.fn().mockReturnValue({
          _id: '49ade180-932f-492f-aeb5-92b801aef423',
          name: 'product',
          description: 'example product',
          quantity: '100',
          amount: '12.3',
          image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
        })
      }

      products.findByIdAndUpdate = jest.fn().mockReturnValue({
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        name: 'product',
        description: 'example product',
        quantity: '100',
        amount: '12.3',
        image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([productsRoute])
      return request(app.getServer())
        .put(`/api${productsRoute.path}/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(productData)
    })
  })

  xdescribe('[DELETE] /products/:id', () => {
    it('response Delete User', async () => {
      const productId = '49ade180-932f-492f-aeb5-92b801aef423'

      const productsRoute = new ProductsRoute()
      const products = productsRoute.productsController.productService.products

      products.findByIdAndDelete = jest.fn().mockReturnValue({
        _id: '49ade180-932f-492f-aeb5-92b801aef423',
        name: 'product',
        description: 'example product',
        quantity: '100',
        amount: '12.3',
        image: 'upload/5c22ceff-54e3-4368-989f-984fff81b291.png'
      })
      ;(mongoose as any).connect = jest.fn()
      const app = new App([productsRoute])
      return request(app.getServer())
        .delete(`/api${productsRoute.path}/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })
})
