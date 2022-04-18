import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import hpp from 'hpp'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { PORT, ORIGIN } from '@config'
import { Routes } from './interfaces/routes.interface'
import errorMiddleware from '@middlewares/error.middleware'
import { options } from './swaggerOptions'

class App {
  public app: express.Application
  public port: string | number

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = PORT || 3000

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on http://localhost:${this.port}`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev'))
    this.app.use(cors())
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use('/uploads', express.static(path.resolve('uploads')))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/api', route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeSwagger() {
    const specs = swaggerJSDoc(options)
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))
  }
}

export default App
