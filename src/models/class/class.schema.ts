import { InferSchemaType, model, Model, Schema } from "mongoose"
import { Currency } from "../../types/enums/Currency"
import { Location } from "../../types/enums/Location"
import { Meridiem } from "../../types/enums/Meridiem"
import { Weekday } from "../../types/enums/Weekday"

const ClassSchema = new Schema(
  {
    _id: String,
    classLocation: {
      type: String,
      enum: Object.values(Location),
      required: true
    },
    days: [{
      type: String,
      enum: Object.values(Weekday),
      required: true
    }], 
    startDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: new Schema(
        {
          time: {
            type: Number, 
            required: true
          }, 
          meridiem: {
            type: String, 
            enum: Object.values(Meridiem),
            required: true
          }
        }
      ),
      required: true
    },
    prices: [{
      currency: {
        type: String,
        enum: Object.values(Currency),
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    }],
    maxAttendees: {
      type: Number,
      required: true
    },
    datesCancelled: [Date],
    datesCheckedIn: [Date]
  },
  { timestamps: true }
)

ClassSchema.index({ days: 1, startTime: 1 })

type ClassDocument = InferSchemaType<typeof ClassSchema>

interface IClassDocument extends ClassDocument, Document { }
interface IClassModel extends Model<IClassDocument> { }

const ClassModel = model<IClassModel>('Class', ClassSchema)

export { ClassSchema, ClassDocument, IClassModel, ClassModel }