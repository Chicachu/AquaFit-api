import express from 'express'
import { paymentsController } from '../controllers/PaymentsController'

const router = express.Router()

router.get('/:clientId', paymentsController.getPaymentsByClientId)

export default router