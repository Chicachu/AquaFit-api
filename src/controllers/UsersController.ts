import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { clientsService } from '../services/ClientsService'
import { usersService } from '../services/UsersService'
import AppError from '../types/AppError'
import { User } from '../types/User'
import bcrypt from 'bcrypt'

class UsersController {
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {

  })

  createNewUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
      throw new AppError('Missing information, cannot create new user!', 400)
    }

    const client = await clientsService.getClientByEmail(username)
    if (!client) {
      throw new AppError(`Email ${username} is not associated with an AquaFit client account. Try again or contact us to join!`, 400)
    }

    const encryptedPassword = await bcrypt.genSalt().then(salt => bcrypt.hash(password, salt)).then(hash => hash)

    const userInfo: User = {
      username, 
      password: encryptedPassword, 
      role
    }

    const user = await usersService.createNewUser(userInfo)
    res.send({ user: user })
  })
}

const usersController = new UsersController()
export { usersController }