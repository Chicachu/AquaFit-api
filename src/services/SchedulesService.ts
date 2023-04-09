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

  /**
   * Finds all schedules for this class, and returns all client IDs who have current schedules for this class.
   * @param classId 
   * @param date 
   * @returns Client ids that have current schedules in this class.
   */
  async getClientIdsByClassId(classId: string, date: Date): Promise<string[]> {
    try {
      const schedules = await this.scheduleCollection.getSchedulesByClassId(classId)
      const currentSchedules = await this._filterCurrentSchedules(schedules, date)
      return await this._getClientIdsFromSchedules(currentSchedules)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async getAllClientIdsByClassId(classId: string): Promise<string[]> {
    try {
      const schedules = await this.scheduleCollection.getSchedulesByClassId(classId)
      return await this._getClientIdsFromSchedules(schedules)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async getLastDayClientIdsByClassId(classId: string, date: Date): Promise<Map<number, string[]>> {
    try {
      const schedules = await this.scheduleCollection.getSchedulesByClassId(classId)
      const lastDayClientIds = await this._getLastDayClientIds(schedules, date)

      return lastDayClientIds
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  async giveClientExtraClass(clientId: string, classId: string): Promise<Schedule> {
    try {
      return await this.scheduleCollection.giveClientExtraClass(clientId, classId)
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

  async checkInClient(clientId: string, classId: string, date: Date, checkIn: boolean): Promise<Schedule> {
    try {
      if (checkIn) {
        return await this.scheduleCollection.checkInClient(clientId, classId, date)
      } else {
        return await this.scheduleCollection.undoCheckIn(clientId, classId, date)
      }
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }

  private async _getLastDayClientIds(schedules: Schedule[], date: Date): Promise<Map<number, string[]>> {
    const lastDayClientIds=  new Map<number, string[]>()
    schedules.forEach((s) => {
      const lastDate = this._calculateLastDate(s)

      if (lastDate.getMonth() == date.getMonth()) {
        let clientIds = lastDayClientIds.get(this._getDateWithoutTime(lastDate).getTime())
        if (!clientIds) {
          clientIds = []
        }
        clientIds.push(s.clientId)
        lastDayClientIds.set(this._getDateWithoutTime(lastDate).getTime(), clientIds)
      }
    })

    return lastDayClientIds
  }

  private async _filterCurrentSchedules(schedules: Schedule[], date: Date): Promise<Schedule[]> {
    const currentSchedules = schedules.filter((s) => {
      const lastDate = this._calculateLastDate(s)

      return s.startDate <= date && date <= lastDate
    })

    return currentSchedules
  }

  private _calculateLastDate(schedule: Schedule): Date {
    let offset = this._getOffset(schedule.sessions, schedule.startDate.getDay())
      
    const lastDate = new Date(schedule.startDate.getTime())
    lastDate.setDate(lastDate.getDate() + 21 + offset)

    const daysPerWeek = schedule.sessions / 4
    if (schedule.extraSessions) {
      const numWeeksExtra = Math.floor((schedule.extraSessions / daysPerWeek)) * 7
      lastDate.setDate(lastDate.getDate() + numWeeksExtra)

      const numSessionsLeftover = schedule.extraSessions % daysPerWeek
      for (let i = 0; i < numSessionsLeftover; i++) {
        const extraOffset = this._getOffset(schedule.sessions, lastDate.getDay(), true)
        lastDate.setDate(lastDate.getDate() + extraOffset)
      }
    }

    return lastDate
  }

  private _getOffset(numSessions: number, day: number, extra?: boolean): number {
    let offset = 0
    if (numSessions === 8) {
      switch (day) {
        case 2: offset = 2
        break;
        case 4: offset = 5
        break;
      }
    } else if (numSessions === 12) {
      switch(day) {
        case 1: extra ? offset = 2 : offset = 4
        break;
        case 3: extra ? offset = 2 : offset = 5
        break;
        case 5: offset = 3
        break;
      }
    }

    return offset;
  }

  private async _getClientIdsFromSchedules(schedules: Schedule[]): Promise<string[]> {
    return schedules.map((s) => s.clientId)
  }

  private async _getClassIdsFromSchedules(schedules: Schedule[]): Promise<String[]> {
    return schedules.map((s) => s.classId)
  }

  private _getDateWithoutTime(date: Date): Date {
    const dateWithoutTime = new Date(date)
    dateWithoutTime.setHours(0, 0, 0, 0)
    return dateWithoutTime
  }
}

const schedulesService = new SchedulesService(scheduleCollection)
export { schedulesService, SchedulesService }