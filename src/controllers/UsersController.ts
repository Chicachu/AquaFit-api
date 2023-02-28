import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { usersService } from '../services/UsersService'
import AppError from '../types/AppError'

class UsersController {
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await usersService.getAllUsers()

    res.send({ users: users })
  })
}

const usersController = new UsersController()
export { usersController }