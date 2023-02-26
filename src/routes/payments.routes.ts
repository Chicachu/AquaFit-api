import express from 'express'
import { paymentsController } from '../controllers/PaymentsController'

const router = express.Router()

router.get('/clients/:clientId', paymentsController.getPaymentsByClientId)
router.post('/clients/:clientId', paymentsController.makePayment)

export default router