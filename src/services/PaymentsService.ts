import { paymentCollection, PaymentCollection } from "../models/payment/payment.class"
import { PaymentDocument } from "../models/payment/payment.schema"
import AppError from "../types/AppError"

class PaymentsService {
  paymentCollection: PaymentCollection

  constructor(paymentCollection: PaymentCollection) {
    this.paymentCollection = paymentCollection
  }

  async getPaymentsByClientId(clientId: string): Promise<PaymentDocument[]> {
    try {
      return await this.paymentCollection.getPaymentsByClientId(clientId)
    } catch (error) {
      throw new AppError('Could not get payments by client!', 500)
    }
  }

  async makePayment(payment: PaymentDocument) {
    try {
      return await this.paymentCollection.insertOne(payment)
    } catch (error) {
      throw new AppError('Could not make payment!', 500)
    }
  }
}

const paymentsService = new PaymentsService(paymentCollection)
export { paymentsService, PaymentsService }