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
			const classes = await this.classCollection.getAllClasses()

			const classesInfo: Class[] = classes.map((doc: ClassDocument) => ({
				id: doc._id,
        days: doc.days,
        startTime: doc.startTime,
        prices: doc.prices,
        maxAttendees: doc.maxAttendees,
        attendeeIds: doc.attendeeIds
			}))

			return classesInfo
		} catch (error) {
			throw new AppError('Failed to retrieve classes!', 500)
		}
	}

  async addNewClass(classDoc: Class): Promise<Class> {
    try {
      return await this.classCollection.insertOne(classDoc)
    } catch (error) {
      throw new AppError('Failed to add new class!', 500)
    }
  }

  async addClientToClass(classId: string, clientId: string): Promise<Class> {
    try {
      const classToUpdate = await this.classCollection.getClassById(classId) 

      if (classToUpdate.attendeeIds.length >= classToUpdate.maxAttendees) {
        throw new AppError(`Class is full, cannot add a new client!`, 400)
      }

      return await this.classCollection.addClientToClass(classId, clientId)
    } catch (error) {
      throw new AppError('Failed to add client to class!', 500)
    }
  }

  async removeClientFromClass(classId: string, clientId: string): Promise<Class> {
    try {
      const hasClient = await this.classCollection.hasClient(classId, clientId)
      if (!hasClient) {
        throw new AppError('Cannot remove client from class because they are not in it', 400)
      }

      return await this.classCollection.removeClientFromClass(classId, clientId)
    } catch (error) {
      throw new AppError('Failed to remove client from class!', 500)
    }
  }
}

const classesService = new ClassesService(classCollection)
export { classesService, ClassesService }