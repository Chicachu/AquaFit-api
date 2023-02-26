import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { usersService } from '../services/UsersService'
import AppError from '../types/AppError'
import bcrypt from 'bcrypt'

class AuthenticationController {
  authenticate = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
      throw new AppError(`Missing username or password. Try logging in again.`, 400)
    } 

    const user = await usersService.getUser(username)

    if (!user) {
      throw new AppError(`Incorrect username or password! Try logging in again.`, 400)
    }

    const authenticated = bcrypt.compare(password, user.password)

    if (!authenticated) {
      throw new AppError(`Incorrect username or password! Try logging in again.`, 400)
    }

    res.send({ user: user })
  })
}

const authenticationController = new AuthenticationController()
export { authenticationController }