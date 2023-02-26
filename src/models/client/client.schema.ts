import { InferSchemaType, model, Model, Schema } from "mongoose"

const ClientSchema = new Schema(
  {
    _id: String,
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

ClientSchema.index({ firstName: 1, lastName: 1 })

type ClientDocument = InferSchemaType<typeof ClientSchema>

interface IClientDocument extends ClientDocument, Document { }
interface IClientModel extends Model<IClientDocument> { }

const ClientModel = model<IClientModel>('Client', ClientSchema)
export { ClientSchema, ClientDocument, IClientDocument, IClientModel, ClientModel }