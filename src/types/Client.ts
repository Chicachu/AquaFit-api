import { Class } from './Class'
import { IDocument } from './IDocument'

export type Client = IDocument & {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}