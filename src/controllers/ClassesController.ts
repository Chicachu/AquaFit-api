import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { classesService } from '../services/ClassesService'
import AppError from '../types/AppError'
import { Class } from '../types/Class'

class ClassesController {
  getClasses = asyncHandler(async (req: Request, res: Response) => {
    const classes = await classesService.getAllClasses()

    res.send({classes: classes})
  })

  addNewClass = asyncHandler(async (req: Request, res: Response) => {
    const { location, days, startTime, prices, maxAttendees } = req.body
    if (!location || !days || !startTime || !prices || !maxAttendees) {
      throw new AppError('Missing class information, cannot add new class!', 400)
    }

    const classToAdd: Class = {
      location,
      days, 
      startTime,
      prices, 
      maxAttendees,
    }

    const newClass = await classesService.addNewClass(classToAdd)
    
    res.send({ class: newClass })
  })

  getClassesForMonth = asyncHandler(async (req: Request, res: Response) => {
    const { month, year } = req.body

    if (!month || !year) {
      throw new AppError('Missing month or year, cannot get classes!', 400)
    }

    const classes = await classesService.getClassesForMonthOf(month, year)

    res.send(classes)
  })
}

const classesController = new ClassesController()
export { classesController }