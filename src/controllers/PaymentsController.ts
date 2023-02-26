import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { paymentsService } from '../services/PaymentsService'
import AppError from '../types/AppError'

class PaymentsController {
  getPaymentsByClientId = asyncHandler(async (req: Request, res: Response) => {
    const { clientId } = req.params
    if (!clientId) {
      throw new AppError('ClientId must be supplied when retrieving payments for client!', 400)
    }

		const payments = await paymentsService.getPaymentsByClientId(clientId)

		res.send({payments: payments})
	})
}

const paymentsController = new PaymentsController()
export { paymentsController }