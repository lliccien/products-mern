import { NextFunction, Request, Response } from 'express'
import { PORT } from '@config'

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ docs: `http://localhost:${PORT}/api/docs` })
    } catch (error) {
      next(error)
    }
  }
}

export default IndexController
