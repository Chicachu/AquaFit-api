import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { read } from 'fs'
import { classesService } from '../services/ClassesService'
import AppError from '../types/AppError'
import { Class } from '../types/Class'

class ClassesController {
  getClasses = asyncHandler(async (req: Request, res: Response) => {
    const classes = classesService.getAllClasses()

    res.send({classes: classes})
  })

  addNewClass = asyncHandler(async (req: Request, res: Response) => {
    const { days, startTime, prices, maxAttendees, attendeeIds } = req.body
    if (!days || !startTime || !prices || !maxAttendees || !attendeeIds) {
      throw new AppError('Missing class information, cannot add new class!', 400)
    }

    const classToAdd: Class = {
      days, 
      startTime,
      prices, 
      maxAttendees, 
      attendeeIds
    }

    const newClass = await classesService.addNewClass(classToAdd)
    
    res.send({ class: newClass })
  })

  addClientToClass = asyncHandler(async (req: Request, res: Response) => {
    const { clientId, classId } = req.params

    if (!clientId) {
        throw new AppError('Client ID must be supplied when adding client to a class!', 400)
    }

    if (!classId) {
        throw new AppError('Class ID must be supplied when adding client to a class!', 400)
    }

    const updatedClass = classesService.addClientToClass(classId, clientId)

    res.send({ class: updatedClass })
  })
}

const classesController = new ClassesController()
export { classesController }