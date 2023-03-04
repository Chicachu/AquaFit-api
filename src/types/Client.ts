import { Currency } from './enums/Currency'
import { IDocument } from './IDocument'

export type Client = IDocument & {
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  credits?: {
    amount: number
    currency: Currency
  }
}