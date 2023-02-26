import dotenv from 'dotenv'
import path from 'path'
import { errorHandler } from './middleware/errorMiddleware'
import express from 'express'

dotenv.config({ path: path.join(__dirname, '..', '.env') })
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const store = new MongoDBStore({
  uri: process.env.MONOGO_URI,
  collection: 'sessions'
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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

app.use(errorHandler)

export default app