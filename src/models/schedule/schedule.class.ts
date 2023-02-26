import { Model } from "mongoose"
import Collection from "../_common/collection.class"
import { IScheduleModel, ScheduleDocument, ScheduleModel } from "./schedule.schema"

class ScheduleCollection extends Collection<IScheduleModel> {
  constructor(model: Model<IScheduleModel>) {
    super(model)
  }

  async getSchedulesByClientId(clientId: string): Promise<ScheduleDocument[]> {
    return await this.find({ clientId })
  }

  async getSchedulesByClassId(classId: string): Promise<ScheduleDocument[]> {
    return await this.find({ classId })
  }
}

const scheduleCollection = new ScheduleCollection(ScheduleModel)
export { scheduleCollection, ScheduleCollection }