import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { calendarService } from "../services/CalendarService"
import { classesService } from '../services/ClassesService'
import AppError from '../types/AppError'

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
    const monthlySchedule = await calendarService.getMonthlySchedule(date, classes)

    res.send(Array.from(monthlySchedule))
  })
}

const calendarController = new CalendarController()
export { calendarController }