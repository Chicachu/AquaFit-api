import { Currency } from "./enums/Currency";
import { Meridiem } from "./enums/Meridiem";
import { IDocument } from "./IDocument";
import { Weekday } from "./enums/Weekday";
import { Location } from "./enums/Location";

export type Class = IDocument & {
  location: Location
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
  datesCancelled?: Date[]
  datesCheckedIn?: Date[]
}