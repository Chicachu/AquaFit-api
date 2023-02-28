import { Role } from "./enums/Role"
import { IDocument } from "./IDocument"

export type User = IDocument & {
  username: string
  password: string
  role: Role
  accessToken?: string
}