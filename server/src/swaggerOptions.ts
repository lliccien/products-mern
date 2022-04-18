import { PORT } from './config'
export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products API',
      version: '1.0.0',
      description: 'Api Rest Full of Products'
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`
      }
    ]
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  apis: ['./src/routes/*.ts']
}
