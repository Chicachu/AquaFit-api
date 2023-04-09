import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { classesService } from '../services/ClassesService'
import { clientsService } from '../services/ClientsService'
import { schedulesService } from '../services/SchedulesService'
import AppError from '../types/AppError'
import { Class } from '../types/Class'
import { ClassInfo } from '../types/ClassInfo'

class ClassesController {
  getClasses = asyncHandler(async (req: Request, res: Response) => {
    const classes = await classesService.getAllClasses()

    res.send(classes)
  })

  getClassInfo = asyncHandler(async (req: Request, res: Response) => {
    const { classId, dateInMillis } = req.params

    if (!classId) {
      throw new AppError('Missing classId, cannot get class information!', 400)
    }

    if (!dateInMillis) {
      throw new AppError('Missing month and year, cannot get class information!', 400)
    }
    
    const classInfo = await this._getClassInfo(classId, dateInMillis)

    res.send(classInfo)
  })

  addNewClass = asyncHandler(async (req: Request, res: Response) => {
    const { location, days, startDate, startTime, prices, maxAttendees } = req.body
    if (!location || !days || !startDate || !startTime || !prices || !maxAttendees) {
      throw new AppError('Missing class information, cannot add new class!', 400)
    }

    const classToAdd: Class = {
      classLocation: location,
      days, 
      startDate,
      startTime,
      prices, 
      maxAttendees,
    }

    const newClass = await classesService.addNewClass(classToAdd)
    
    res.send(newClass)
  })

  cancelClass = asyncHandler(async (req: Request, res: Response) => {
    const { classId, dateInMillis } = req.params
    const { addFreeSessions } = req.body

    if (!classId) {
      throw new AppError('Missing classId, cannot cancel class!', 400)
    }

    if (!dateInMillis) {
      throw new AppError('Missing month and year, cannot cancel class!', 400)
    }

    const date = new Date(parseInt(dateInMillis))
    await classesService.cancelClass(classId, date)
    if (addFreeSessions) {
      await this._giveClientsFreeSession(classId, dateInMillis)
    }

    const classInfo = this._getClassInfo(classId, dateInMillis)

    res.send(classInfo)
  })

  private async _getClassInfo(classId: string, dateInMillis: string): Promise<ClassInfo> {
    const date = new Date(parseInt(dateInMillis))

    const foundClass = await classesService.getClassById(classId)
    const clientsIds = await schedulesService.getClientIdsByClassId(classId, date)
    const clients = await clientsService.getClientsFromIds(clientsIds)

    const classInfo: ClassInfo = {
      classLocation: foundClass.classLocation, 
      days: foundClass.days,
      startTime: foundClass.startTime,
      prices: foundClass.prices,
      maxAttendees: foundClass.maxAttendees,
      cancelled: !!foundClass.datesCancelled?.includes(date),
      checkedIn: !!foundClass.datesCheckedIn?.includes(date),
      clients
    }

    return classInfo
  }

  private async _giveClientsFreeSession(classId: string, dateInMillis: string): Promise<void> {
    const date = new Date(parseInt(dateInMillis))
    const clientsIds = await schedulesService.getClientIdsByClassId(classId, date)

    for (let clientId of clientsIds) {
      await schedulesService.giveClientExtraClass(clientId, classId)
    }
  }
}

const classesController = new ClassesController()
export { classesController }