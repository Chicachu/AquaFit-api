import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { paymentsService } from '../services/PaymentsService'
import AppError from '../types/AppError'
import { Payment } from '../types/Payment'

class PaymentsController {
  getPaymentsByClientId = asyncHandler(async (req: Request, res: Response) => {
    const { clientId } = req.params
    if (!clientId) {
      throw new AppError('ClientId must be supplied when retrieving payments for client!', 400)
    }

		const payments = await paymentsService.getPaymentsByClientId(clientId)

		res.send({payments: payments})
	})

  makePayment = asyncHandler(async (req: Request, res: Response) => {
    const { clientId, amount, scheduleIds } = req.body
    if (!clientId || !amount || !scheduleIds.length) {
      throw new AppError('Missing payment information, cannot make payment!', 400)
    }

    const paymentInfo: Payment = {
      clientId, 
      amount
    }

    const payment = await paymentsService.makePayment(paymentInfo)

    // for each schedule, get the price of the class for the currency used in the payment
    // apply payment amount to each schedule until
        // 1. amount is used up (remaining schedules partial or unpaid)
        // 2. schedules are paid (client gets credits)
  })
}

const paymentsController = new PaymentsController()
export { paymentsController }