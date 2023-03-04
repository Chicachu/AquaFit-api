import dotenv from 'dotenv'
import path from 'path'
import { errorHandler } from './middleware/errorMiddleware'
import express from 'express'
import jwt from 'jsonwebtoken'

dotenv.config({ path: path.join(__dirname, '..', '.env') })
//const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)
// const store = new MongoDBStore({
//   uri: process.env.MONOGO_URI,
//   collection: 'sessions'
// })

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(async(req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = <string>req.headers['x-access-token']
    const { userId, exp } = await <jwt.JwtPayload>jwt.verify(accessToken, process.env.JWT_SECRET!)

    if (exp && exp < Date.now().valueOf() / 1000) {
      throw new AppError('Your access token has expired. Please login to obtain a new one.', 401)
    }

    res.locals.loggedInUser = await usersService.getUserById(userId)
  } 

  const whitelist = 'http://localhost:4200'
  res.header('Access-Control-Allow-Origin', whitelist)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Content-Type', 'application/json')

  if (req.method === "OPTIONS") {
    res.status(200).end()
  } else {
    next()
  }
})

import authenticationRouter from './routes/authentication.routes'
app.use('/api/auth', authenticationRouter)

import clientsRouter from './routes/clients.routes'
app.use('/api/clients', clientsRouter)

import classesRouter from './routes/classes.routes'
app.use('/api/classes', classesRouter)

import paymentsRouter from './routes/payments.routes'
app.use('/api/payments', paymentsRouter)

import schedulesRouter from './routes/schedules.routes'
app.use('/api/schedules', schedulesRouter)

import usersRouter from './routes/users.routes'
import AppError from './types/AppError'
import { usersService } from './services/UsersService'
app.use('/api/users', usersRouter)

app.use(errorHandler)

export default app