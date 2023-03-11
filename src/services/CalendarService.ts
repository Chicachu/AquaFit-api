import { DailyClass } from "../types/DailyClass";
import { MonthClassSchedule } from "../types/MonthClassSchedule";

const DAY_MS = 60 * 60 * 24 * 1000;

class CalendarService {
  async getMonthlySchedule(date: Date, classes: MonthClassSchedule[]): Promise<Map<Number, DailyClass[]>> {
    const dates = this._getCalendarDays(date)
    const monthlySchedule = this._mapClassesToDates(dates, classes)

    return monthlySchedule
  }

  private _mapClassesToDates(dates: Date[], classes: MonthClassSchedule[]): Map<Number, DailyClass[]> {
    const monthlySchedule = new Map<Number, DailyClass[]>()

    dates.forEach((day) => {
      monthlySchedule.set(this._getDateWithoutTime(day).getTime(), [])
    })

    classes.forEach((mClass) => {
      mClass.classes.forEach((c) => {
        const dayClasses = monthlySchedule.get(this._getDateWithoutTime(new Date(c.date)).getTime())!
        dayClasses.push({
          classId: mClass.classId,
          startTime: new Date(c.date),
          location: mClass.location, 
          checkedIn: c.checkedIn, 
          cancelled: c.cancelled
        })
      })
    })

    return monthlySchedule
  }

  private _getCalendarDays(date = new Date): Array<Date> {
    const calendarStartTime =  this._getCalendarStartDay(date)?.getTime();

    return this._range(0, 41)
      .map(num => new Date(calendarStartTime! + DAY_MS * num));
  }

  private _range(start: number, end: number, length = end - start + 1) {
    return Array.from({ length }, (_, i) => start + i)
  }

  private _getCalendarStartDay(date = new Date) {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();

    return this._range(1,7)
      .map(num => new Date(firstDayOfMonth - DAY_MS * num))
      .find(dt => dt.getDay() === 0)
  }
  
  private _getDateWithoutTime(date: Date): Date {
    const dateWithoutTime = new Date(date)
    dateWithoutTime.setHours(0, 0, 0, 0)
    return dateWithoutTime
  }
}

const calendarService = new CalendarService()
export { calendarService, CalendarService }