import { Currency } from "./enums/Currency";
import { Discount } from "./enums/Discount";
import { Paid } from "./enums/Paid";
import { IDocument } from "./IDocument";

export type Schedule = IDocument & {
  classId: string
  clientId: string
  sessions: number
  startDate: Date
  datesCheckedIn?: Date[]
  datesCancelled?: Date[]
  discount?: {
    amount: number
    currency: Currency
    offerType: Discount
  }
  paid?: Paid
  payments?: {
    paymentId: string
    amount: number
  }[]
  autoEnroll?: boolean
}

