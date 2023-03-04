import { Model } from "mongoose";
import Collection from "../_common/collection.class";
import { ClassDocument, IClassModel, ClassModel } from "./class.schema";

class ClassCollection extends Collection<IClassModel> {
  constructor(model: Model<IClassModel>) {
    super(model)
  }

  async getClassById(classId: string): Promise<ClassDocument> {
    return await this.findOne({ _id: classId })
  }

  async cancelClass(classId: string): Promise<ClassDocument> {
    return this.updateOne({ _id: classId }, { $push: { datesCancelled: new Date() }})
  }

  async checkIntoClass(classId: string): Promise<ClassDocument> {
    return this.updateOne({ _id: classId }, { $push: { datesCheckedIn: new Date() }})
  }
}

const classCollection = new ClassCollection(ClassModel)
export { classCollection, ClassCollection }