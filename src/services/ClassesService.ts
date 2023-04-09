import { classCollection, ClassCollection } from "../models/class/class.class";
import { ClassDocument } from "../models/class/class.schema";
import AppError from "../types/AppError";
import { Class } from "../types/Class";
import { Meridiem } from "../types/enums/Meridiem";
import { Weekday } from "../types/enums/Weekday";
import { MonthClassSchedule } from "../types/MonthClassSchedule";

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

  async cancelClass(classId: string, date: Date): Promise<Class> {
    try {
      return await this.classCollection.cancelClass(classId, date)
    } catch (error: any) {
			throw new AppError(error.message, 500)
		}
  }

  async getClassById(classId: string): Promise<Class> {
    try {
      return await this.classCollection.getClassById(classId)
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

  async getClassesForMonthOf(month: number, year: number): Promise<MonthClassSchedule[]> {
    const classDocs = await this.classCollection.find()
    const monthClassSchedules: MonthClassSchedule[] = []

    classDocs.forEach((classDoc: ClassDocument) => {
      let classes = []
      const refDate = new Date(year, month, 1)
      while (refDate.getMonth() === month) {
        if (Object.values(classDoc.days).includes(Object.values(Weekday)[refDate.getDay()])) {
          const hour = classDoc.startTime.time + (classDoc.startTime.meridiem === Meridiem.AM ? 0 : 12)
          const classDate = new Date(refDate)
          classDate.setHours(hour)
          classes.push({
            date: classDate,
            cancelled: classDoc.datesCancelled?.includes(this._getDateWithoutTime(refDate)),
            checkedIn: classDoc.datesCheckedIn?.includes(this._getDateWithoutTime(refDate)), 
          })
        }
        refDate.setDate(refDate.getDate() + 1)
      }

      monthClassSchedules.push({
        classId: classDoc._id!,
        location: classDoc.classLocation,
        classes: classes
      })
    })

    return monthClassSchedules
  }

  private _getDateWithoutTime(date: Date): Date {
    const dateWithoutTime = new Date(date)
    dateWithoutTime.setHours(0, 0, 0, 0)
    return dateWithoutTime
  }
}

const classesService = new ClassesService(classCollection)
export { classesService, ClassesService }