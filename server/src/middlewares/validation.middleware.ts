import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { RequestHandler } from 'express'
import { HttpException } from '@exceptions/HttpException'

// const validationMiddleware = (type: any, skipMissingProperties = false): RequestHandler => {
//   return (req, res, next) => {
//     const dtoObj = plainToClass(type, req.body)
//     validate(dtoObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
//       if (errors.length > 0) {
//         const dtoErrors = errors
//           .map((error: ValidationError) => (Object as any).values(error.constraints))
//           .join(', ')
//         next(new HttpException(400, dtoErrors))
//       } else {
//         //sanitize the object and call the next middleware
//         sanitize(dtoObj)
//         req.body = dtoObj
//         next()
//       }
//     })
//   }
// }

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req[value]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints!))
          .join(', ')
        next(new HttpException(400, message))
      } else {
        next()
      }
    })
  }
}

export default validationMiddleware
