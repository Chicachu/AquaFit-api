import { clientCollection, ClientCollection } from '../models/client/client.class'
import { Client } from '../types/Client'
import AppError from '../types/AppError'

class ClientsService {
	clientCollection: ClientCollection

	constructor(clientCollection: ClientCollection) {
		this.clientCollection = clientCollection
	}

	async getAllClients(): Promise<Client[]> {
		try {
			return await this.clientCollection.find()
		} catch (error: any) {
			throw new  AppError(error.message, 500)
		}
	}

  async getClientsFromIds(clientIds: string[]): Promise<Client[]> {
    try {
      return await this.clientCollection.getClientsByIds(clientIds)
    } catch (error: any) {
			throw new  AppError(error.message, 500)
		}
  }

  async getClientByEmail(email: string): Promise<Client> {
    try {
      return await this.clientCollection.getClientByEmail(email)
    } catch (error: any) {
			throw new  AppError(error.message, 500)
		}
  }

  async addNewClient(clientDoc: Client): Promise<Client> {
    try {
      return await this.clientCollection.insertOne(clientDoc)
    } catch (error: any) {
      throw new AppError(error.message, 500)
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
    } catch (error: any) {
      throw new AppError(error.message, 500)
    }
  }
}

const clientsService = new ClientsService(clientCollection)
export { clientsService, ClientsService }
