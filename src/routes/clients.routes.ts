import express from 'express'
import { clientsController } from '../controllers/ClientsController'

const router = express.Router()

router.get('/', clientsController.getClients)
router.post('/', clientsController.addClient)
router.put('/:clientId', clientsController.updateClient)

export default router