import { off } from "process";
import { scheduleCollection, ScheduleCollection } from "../models/schedule/schedule.class";
import AppError from "../types/AppError";
import { Client } from "../types/Client";
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

  private async _filterCurrentSchedules(schedules: Schedule[], date: Date): Promise<Schedule[]> {
    const currentSchedules = schedules.filter((s) => {
      let offset = this._getOffset(s.sessions, s.startDate.getDay())
      
      const lastDate = new Date(s.startDate.getTime())
      lastDate.setDate(lastDate.getDate() + 21 + offset)

      const daysPerWeek = s.sessions / 4
      if (s.extraSessions) {
        const numWeeksExtra = Math.floor((s.extraSessions / daysPerWeek)) * 7
        lastDate.setDate(lastDate.getDate() + numWeeksExtra)

        const numSessionsLeftover = s.extraSessions % daysPerWeek
        for (let i = 0; i < numSessionsLeftover; i++) {
          const extraOffset = this._getOffset(s.sessions, lastDate.getDay(), true)
          lastDate.setDate(lastDate.getDate() + extraOffset)
        }
      }

      return s.startDate <= date && date <= lastDate
    })

    return currentSchedules
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
}

const schedulesService = new SchedulesService(scheduleCollection)
export { schedulesService, SchedulesService }