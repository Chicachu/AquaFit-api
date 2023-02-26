import { Model } from "mongoose";
import Collection from "../_common/collection.class";
import { ClassDocument, IClassModel, ClassModel } from "./class.schema";

class ClassCollection extends Collection<IClassModel> {
  constructor(model: Model<IClassModel>) {
    super(model)
  }

  async getAllClasses(): Promise<ClassDocument[]> {
    return await this.find()
  }

  async getClassById(classId: string): Promise<ClassDocument> {
    return await this.findOne({ _id: classId })
  }

  async addClientToClass(classId: string, clientId: string): Promise<ClassDocument> {
    return await this.updateOne({ _id: classId }, { $push: { attendeeIds: clientId }})
  }

  async removeClientFromClass(classId: string, clientId: string): Promise<ClassDocument> {
    const classToUpdate = await this.findOne({ _id: classId }) as ClassDocument
    const remainingAttendees = classToUpdate.attendeeIds.filter((id) => id !== clientId)

    return await this.updateOne({ _id: classId }, { attendeeIds: remainingAttendees})
  }

  async hasClient(classId: string, clientId: string): Promise<boolean> {
    const classToUpdate = await this.findOne({ _id: classId }) as ClassDocument
    return classToUpdate.attendeeIds.includes(clientId)
  }
}

const classCollection = new ClassCollection(ClassModel)
export { classCollection, ClassCollection }