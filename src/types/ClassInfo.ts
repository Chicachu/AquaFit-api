import { Location } from "./enums/Location";
import { Client } from './Client'
import { Currency } from "./enums/Currency";
import { Meridiem } from "./enums/Meridiem";
import { Weekday } from "./enums/Weekday";
import { IDocument } from "./IDocument";

export type ClassInfo = IDocument & {
  classLocation: Location
  days: Weekday[]
  startTime: {
    time: number 
    meridiem: Meridiem
  }
  prices: {
      currency: Currency
      value: number
  }[]
  maxAttendees: number
  cancelled: boolean
  checkedIn: boolean
  clients: Client[]
}