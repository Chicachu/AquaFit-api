import { paymentCollection, PaymentCollection } from "../models/payment/payment.class"
import AppError from "../types/AppError"
import { Payment } from "../types/Payment"

class PaymentsService {
  paymentCollection: PaymentCollection

  constructor(paymentCollection: PaymentCollection) {
    this.paymentCollection = paymentCollection
  }

  async getPaymentsByClientId(clientId: string): Promise<Payment[]> {
    try {
      return await this.paymentCollection.getPaymentsByClientId(clientId)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async makePayment(payment: Payment) {
    try {
      return await this.paymentCollection.insertOne(payment)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }
}

const paymentsService = new PaymentsService(paymentCollection)
export { paymentsService, PaymentsService }