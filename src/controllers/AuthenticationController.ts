import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { usersService } from '../services/UsersService'
import AppError from '../types/AppError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { clientsService } from '../services/ClientsService'
import { User } from '../types/User'
import { roles } from '../config/roles'
import { Permission, Query } from 'accesscontrol'
import { Role } from '../types/enums/Role'

class AuthenticationController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
      throw new AppError(`Missing username or password. Try logging in again.`, 400)
    } 

    let user = await usersService.getUser(username)

    if (!user) {
      throw new AppError(`Incorrect username or password! Try logging in again.`, 400)
    }

    const authenticated = await bcrypt.compare(password, user.password)

    if (!authenticated) {
      throw new AppError(`Incorrect username or password! Try logging in again.`, 400)
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
    user = await usersService.saveAccessToken(user.id!, accessToken)

    res.send({ user: user })
  })

  registerNewUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
      throw new AppError('Missing information, cannot register new user!', 400)
    }

    if (role == Role.CLIENT) {
      const client = await clientsService.getClientByEmail(username)
      if (!client) {
        throw new AppError(`Email ${username} is not associated with an AquaFit client account. Try again or contact us to join!`, 400)
      }
    }

    const encryptedPassword = await bcrypt.genSalt().then(salt => bcrypt.hash(password, salt)).then(hash => hash)

    const userInfo: User = {
      username, 
      password: encryptedPassword, 
      role
    }
    let user = await usersService.createNewUser(userInfo)
    
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
    user = await usersService.saveAccessToken(user.id!, accessToken)

    res.send({ user: user })
  })

  checkAccess = function(action: string, resource: string) {
    return asyncHandler(async (req: Request, res: Response) => {
      try {
        const permission = <Permission>roles().can(req.user.role)[action as keyof Query](resource)

        if (!permission.granted) {
          throw new AppError('You do not have access to this resource!', 401)
        }
      } catch (error: any) {
        throw new AppError(error.message, 500)
      }
    })
  }

  checkIfLoggedIn = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = res.locals.loggedInUser

      if (!user) {
        throw new AppError('You are not logged in. Please login to access this page.', 400)
      }

      req.user = user
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  })
}

const authenticationController = new AuthenticationController()
export { authenticationController }