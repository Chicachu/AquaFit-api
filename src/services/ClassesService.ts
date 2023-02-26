import { classCollection, ClassCollection } from "../models/class/class.class";
import { ClassDocument } from "../models/class/class.schema";
import AppError from "../types/AppError";
import { Class } from "../types/Class";

class ClassesService {
	classCollection: ClassCollection

  constructor(classCollection: ClassCollection) {
    this.classCollection = classCollection
  }

  async getAllClasses(): Promise<Class[]> {
		try {
			return await this.classCollection.find()
		} catch (error: any) {
			throw new AppError(error.message, 500)
		}
	}

  async addNewClass(classDoc: Class): Promise<Class> {
    try {
      return await this.classCollection.insertOne(classDoc)
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }
}

const classesService = new ClassesService(classCollection)
export { classesService, ClassesService }