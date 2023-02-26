import { InferSchemaType, model, Model, Schema } from "mongoose";
import { Role } from "../../types/enums/Role";

const UserSchema = new Schema(
  {
    _id: String,
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true
    }
  }
)

UserSchema.index({ username: 1 })

type UserDocument = InferSchemaType<typeof UserSchema>

interface IUserDocument extends UserDocument, Document { }
interface IUserModel extends Model<IUserDocument> { } 

const UserModel = model<IUserModel>('User', UserSchema)

export { UserSchema, UserDocument, IUserDocument, IUserModel, UserModel }