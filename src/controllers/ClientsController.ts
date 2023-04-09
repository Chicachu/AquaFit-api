import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { clientsService } from '../services/ClientsService'
import AppError from '../types/AppError'
import { Client } from '../types/Client'

class ClientsController {
	getClients = asyncHandler(async (req: Request, res: Response) => {
		const clients = await clientsService.getAllClients()

		res.send(clients)
	})

	addClient = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, phoneNumber, email } = req.body
    if (!firstName || !lastName || !phoneNumber) {
      throw new AppError('Missing client information, cannot add client!', 400)
    }

    const clientInfo: Client = {
      firstName, 
      lastName, 
      phoneNumber, 
      email
    }

		const client = await clientsService.addNewClient(clientInfo)
		res.send(client)
	})
	 
	updateClient = asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, email } = req.body
    const { clientId } = req.params
    
    if (!clientId) {
      throw new AppError(`Missing clientId, cannot update client!`, 400)
    }

    if (!phoneNumber && !email) {
      throw new AppError(`Missing client details, cannot update client!`, 400)
    }

    const client = await clientsService.updateClientDetails(clientId, phoneNumber, email)
		res.send(client)
	})
}

const clientsController = new ClientsController()
export { clientsController }