import { Currency } from "./enums/Currency";
import { ClassDays } from "./enums/ClassDays";
import { Meridiem } from "./enums/Meridiem";
import { IDocument } from "./IDocument";

export type Class = IDocument & {
  days: ClassDays
  startTime: {
    time: number 
    meridiem: Meridiem
  }
  prices: {
      currency: Currency
      value: number
  }[]
  maxAttendees: number
}