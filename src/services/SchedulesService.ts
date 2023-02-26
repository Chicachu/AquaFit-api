import { scheduleCollection, ScheduleCollection } from "../models/schedule/schedule.class";
import AppError from "../types/AppError";
import { Schedule } from "../types/Schedule";

class SchedulesService {
  scheduleCollection: ScheduleCollection

  constructor(scheduleCollection: ScheduleCollection) {
    this.scheduleCollection = scheduleCollection
  }

  async addClientToClass(schedule: Schedule): Promise<Schedule> {
    try {
      return await this.scheduleCollection.insertOne(schedule)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async getSchedulesByClientId(clientId: string): Promise<Schedule[]> {
    try {
      return await this.scheduleCollection.getSchedulesByClientId(clientId)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async getClientIdsByClassId(classId: string): Promise<String[]> {
    try {
      const schedules = await this.scheduleCollection.getSchedulesByClassId(classId)
      return await this._getClientIdsFromSchedules(schedules)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async getClassIdsByClientId(clientId: string): Promise<String[]> {
    try {
      const schedules = await this.scheduleCollection.getSchedulesByClientId(clientId)
      return await this._getClassIdsFromSchedules(schedules)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }
  
  private async _getClientIdsFromSchedules(schedules: Schedule[]): Promise<String[]> {
    return schedules.map((s) => s.clientId)
  }

  private async _getClassIdsFromSchedules(schedules: Schedule[]): Promise<String[]> {
    return schedules.map((s) => s.classId)
  }
}

const schedulesService = new SchedulesService(scheduleCollection)
export { schedulesService, SchedulesService }