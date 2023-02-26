import { InferSchemaType, model, Model, Schema } from "mongoose";
import { Currency } from "../../types/enums/Currency";
import { Discount } from "../../types/enums/Discount";
import { Paid } from "../../types/enums/Paid";
const SchedulePaymentSchema = new Schema(
  {
    paymentId: {
      type: String, 
      required: true
    },
    amount: {
      type: Number, 
      required: true
    }
  }
)

const ScheduleSchema = new Schema(
  {
    _id: String,
    classId: {
      type: String, 
      required: true
    }, 
    clientId: {
      type: String, 
      required: true
    },
    sessions: {
      type: Number, 
      required: true
    },
    startDate: {
      type: Date, 
      required: true
    },
    datesCheckedIn: [Date],
    datesCancelled: [Date],
    discount: {
      type: new Schema(
        {
          amount: {
            type: Number, 
            required: true
          },
          currency: {
            type: Number, 
            enum: Object.values(Currency),
            required: true
          },
          offerType: {
            type: String,
            enum: Object.values(Discount),
            required: true
          }
        }
      )
    },
    paid: {
      type: String,
      enum: Object.values(Paid),
      default: Paid.UNPAID
    },
    payments: [ SchedulePaymentSchema ],
    autoEnroll: {
      type: Boolean, 
      default: true
    }
  }
)

ScheduleSchema.index({ classId: 1, clientId: 1 })

type ScheduleDocument = InferSchemaType<typeof ScheduleSchema>

interface IScheduleDocument extends ScheduleDocument, Document { }
interface IScheduleModel extends Model<IScheduleDocument> { }

const ScheduleModel = model<IScheduleModel>('Schedule', ScheduleSchema)

export { ScheduleSchema, ScheduleDocument, IScheduleDocument, IScheduleModel, ScheduleModel }
