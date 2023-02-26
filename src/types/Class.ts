import { Currency } from "./enums/Currency";
import { Days } from "./enums/Days";
import { Meridiem } from "./enums/Meridiem";
import { IDocument } from "./IDocument";

export type Class = IDocument & {
  days: Days[]
  startTime: {
    time: number, 
    meridiem: Meridiem
  }
  prices: {
      currency: Currency,
      value: number
  }[],
  maxAttendees: number, 
  attendeeIds: string[]
}