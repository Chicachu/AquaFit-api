import { Location } from './enums/Location'

export type MonthClassSchedule = {
  classId: string
  location: Location
  classes: {
    date: Date
    cancelled: boolean
    checkedIn: boolean
  }[]
}