import { clientCollection, ClientCollection } from '../models/client/client.class'
import { Client } from '../types/Client'
import { Class } from '../types/Class'
import AppError from '../types/AppError'
import { ClientDocument } from '../models/client/client.schema'

class ClientsService {
	clientCollection: ClientCollection

	constructor(clientCollection: ClientCollection) {
		this.clientCollection = clientCollection
	}

	async getAllClients(): Promise<Client[]> {
		try {
			const clients = await this.clientCollection.getAllClients()

			const clientDocs: Client[] = clients.map((doc) => ({
				id: doc._id,
				firstName: doc.firstName,
				lastName: doc.lastName,
				phoneNumber: doc.phoneNumber,
				email: doc.email
			}))

			return clientDocs
		} catch (error) {
			throw new  AppError('Failed to retrieve clients!', 500)
		}
	}

  async addNewClient(clientDoc: Client): Promise<Client> {
    try {
      return await this.clientCollection.insertOne(clientDoc)
    } catch (error) {
      throw new AppError('Could not create new client!', 500)
    }
  }
  
  async updateClientDetails(clientId: string, phoneNumber?: string, email?: string) {
    let update: any = {}
    if (phoneNumber) {
      update['phoneNumber'] = phoneNumber
    }

    if (email) {
      update['email'] = email
    }

    try {
      return await this.clientCollection.updateOne({ _id: clientId }, update)
    } catch (error) {
      throw new AppError('Failed to update client details!', 500)
    }
  }
}

const clientsService = new ClientsService(clientCollection)
export { clientsService, ClientsService }
