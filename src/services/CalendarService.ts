import { MonthClassSchedule } from "../types/MonthClassSchedule";

const DAY_MS = 60 * 60 * 24 * 1000;

class CalendarService {
  async getMonthlySchedule(date: Date, classes: MonthClassSchedule[]): Promise<Array<Date>> {
    const dates = this._getCalendarDays(date)
    return dates
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
}

const calendarService = new CalendarService()
export { calendarService, CalendarService }