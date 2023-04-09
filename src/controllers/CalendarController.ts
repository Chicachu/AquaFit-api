import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { calendarService } from "../services/CalendarService"
import { classesService } from '../services/ClassesService'
import { schedulesService } from '../services/SchedulesService'
import AppError from '../types/AppError'
import { DailyClass } from '../types/DailyClass'
import { MonthClassSchedule } from '../types/MonthClassSchedule'

class CalendarController {
  getMonthlySchedule = asyncHandler(async (req: Request, res: Response) => {
    const { month, year } = req.params

    if (!month || !year) {
      throw new AppError('Missing month and year, cannot get classes!', 400)
    }

    const date = new Date()
    date.setMonth(parseInt(month as string))
    date.setFullYear(parseInt(year as string))                        

    const classes = await classesService.getClassesForMonthOf(date.getMonth(), date.getFullYear())
    const dates = await calendarService.getMonthlySchedule(date, classes)

    const monthlySchedule = await this._mapClassesToDates(dates, classes) 

    res.send(Array.from(monthlySchedule))
  })

  private async _mapClassesToDates(dates: Date[], classes: MonthClassSchedule[]): Promise<Map<Number, DailyClass[]>> {
    const monthlySchedule = new Map<Number, DailyClass[]>()

    dates.forEach((day) => {
      monthlySchedule.set(this._getDateWithoutTime(day).getTime(), [])
    })

    for (let i = 0; i < classes.length; i++) {
      const mapOfLastDayClientIds = await schedulesService.getLastDayClientIdsByClassId(classes[i].classId, classes[i].classes[0].date)
      classes[i].classes.forEach((c) => {
        const dayClasses = monthlySchedule.get(this._getDateWithoutTime(new Date(c.date)).getTime())!
        dayClasses.push({
          classId: classes[i].classId,
          startTime: new Date(c.date),
          location: classes[i].location, 
          checkedIn: c.checkedIn, 
          cancelled: c.cancelled,
          lastDayClientIds: mapOfLastDayClientIds.get(this._getDateWithoutTime(new Date(c.date)).getTime())
        })
      })
    }

    return monthlySchedule
  }

  private _getDateWithoutTime(date: Date): Date {
    const dateWithoutTime = new Date(date)
    dateWithoutTime.setHours(0, 0, 0, 0)
    return dateWithoutTime
  }
}

const calendarController = new CalendarController()
export { calendarController }