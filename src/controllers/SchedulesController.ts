import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { classesService } from '../services/ClassesService'
import { clientsService } from '../services/ClientsService'
import { schedulesService } from '../services/SchedulesService'
import AppError from '../types/AppError'
import { Class } from '../types/Class'
import { Client } from '../types/Client'
import { Paid } from '../types/enums/Paid'
import { Schedule } from '../types/Schedule'

class SchedulesController {
  addClientToClass = asyncHandler(async (req: Request, res: Response) => {
    const { classId, clientId, sessions, startDate } = req.body

    if (!classId || !clientId || !sessions || !startDate) {
      throw new AppError('Missing essential information, cannot add client to class!', 400)
    }

    const schedule: Schedule = {
      classId, 
      clientId, 
      sessions, 
      startDate
    }

    const newSchedule = await schedulesService.addClientToClass(schedule)
    res.send({ schedule: newSchedule })
  })

  getClientsInClass = asyncHandler(async (req: Request, res: Response) => {
    const { classId, dateInMillis } = req.params

    if (!classId ) {
      throw new AppError(`Missing classId, cannot get clients in class!`, 400)
    }

    if (!dateInMillis) {
      throw new AppError('Missing date, cannot get clients in class!', 400)
    }

    const numberOfDays = await classesService.getNumberOfDaysPerWeek(classId)
    const clientIdsInClass = await schedulesService.getClientIdsByClassId(classId, new Date(dateInMillis))
    const clients = await clientsService.getAllClients()

    let clientsInClass: Client[] = []
    if(clientIdsInClass.length && clients.length) {
      clientsInClass = clients.filter((c) => clientIdsInClass.includes(c.id!))
    }
    
    res.send({ clients: clientsInClass })
  })

  getClassesByClientId = asyncHandler(async (req: Request, res: Response) => {
    const { clientId } = req.params

    if (!clientId ) {
      throw new AppError(`Missing clientId, cannot get client's classes!`, 400)
    }

    const clientsClassIds = await schedulesService.getClassIdsByClientId(clientId)
    const classes = await classesService.getAllClasses()

    let clientsClasses: Class[] = []
    if(clientsClassIds.length && classes.length) {
      clientsClasses = classes.filter((c) => clientsClassIds.includes(c.id!))
    }
    
    res.send({ classes: clientsClasses })
  })

  getUnpaidSchedulesByClientId = asyncHandler(async (req: Request, res: Response) => {
    const { clientId } = req.params

    if (!clientId ) {
      throw new AppError(`Missing clientId, cannot get client's unpaid schedules!`, 400)
    }

    const clientSchedules = await schedulesService.getSchedulesByClientId(clientId)

    let filteredSchedules: Schedule[] = [] 
    if (clientSchedules.length) {
      filteredSchedules = clientSchedules.filter((s) => s.paid !== Paid.PAID) 
    }

    res.send({ schedules: filteredSchedules })
  })
}

const schedulesController = new SchedulesController()
export { schedulesController }