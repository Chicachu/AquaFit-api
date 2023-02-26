import { IDocument } from "./IDocument";

export type Payment = IDocument & {
  clientId: string
  amount: {
    currency: string,
    value: number
  }
}