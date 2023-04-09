import { Location } from './enums/Location'

export type DailyClass = {
  classId: string
  startTime: Date
  location: Location
  checkedIn: boolean
  cancelled: boolean
  lastDayClientIds: string[] | undefined
}