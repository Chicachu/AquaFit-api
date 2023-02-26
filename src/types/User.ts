import { Role } from "./enums/Role"

export type User = {
  username: string
  password: string
  role: Role
}