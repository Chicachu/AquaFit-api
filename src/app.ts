import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

import { errorHandler } from './middleware/errorMiddleware'
import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

import clientsRouter from './routes/clients.routes'
app.use('/api/clients', clientsRouter)

import classesRouter from './routes/classes.routes'
app.use('/api/classes', classesRouter)

import paymentsRouter from './routes/payments.routes'
app.use('/api/payments', paymentsRouter)

app.use(errorHandler)

export default app