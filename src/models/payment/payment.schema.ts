import { InferSchemaType, model, Model, Schema } from "mongoose";
import { Currency } from "../../types/enums/Currency";

const PaymentSchema = new Schema(
  {
    _id: String,
    clientId: {
      type: String, 
      required: true
    }, 
    amount: {
      currency: {
        type: String, 
        enum: Object.values(Currency), 
        required: true
      },
      value: {
        type: Number, 
        required: true
      }
    }
  }, 
  { timestamps: true }
)

type PaymentDocument = InferSchemaType<typeof PaymentSchema>

interface IPaymentDocument extends PaymentDocument, Document { }
interface IPaymentModel extends Model<IPaymentDocument> { }

const PaymentModel = model<IPaymentModel>('Payment', PaymentSchema)
export { PaymentSchema, PaymentDocument, IPaymentDocument, IPaymentModel, PaymentModel }