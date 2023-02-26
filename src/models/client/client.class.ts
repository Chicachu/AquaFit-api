import { Model } from "mongoose";
import Collection from "../_common/collection.class";
import { ClientDocument, ClientModel, IClientModel } from "./client.schema";

class ClientCollection extends Collection<IClientModel> {
  constructor(model: Model<IClientModel>) {
    super(model)
  }

  async getAllClients(): Promise<ClientDocument[]> {
    return await this.find()
  }

  async updateClientDetails(clientId: string, update: object = {}): Promise<ClientDocument> {
    return await this.updateOne({ _id: clientId }, update)
  }

  async getClientByEmail(email: string): Promise<ClientDocument> {
    return await this.find({ email })
  }
}

const clientCollection = new ClientCollection(ClientModel)
export { clientCollection, ClientCollection }