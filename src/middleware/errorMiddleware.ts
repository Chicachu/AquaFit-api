import { Request, Response, NextFunction } from 'express'

const errorHandler = (err: {message: string, stack: string}, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode ? res.statusCode : 500

  res.status(statusCode)

  res.json({
    message: err.message,
    stack: err.stack
  })
}

export { errorHandler }