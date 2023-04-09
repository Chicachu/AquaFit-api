import express from "express";
import { schedulesController } from "../controllers/SchedulesController";

const router = express.Router()

router.post('/', schedulesController.addClientToClass)
router.get('/classes/:classId/clients', schedulesController.getClientsInClass)
router.get('/clients/:clientId/classes', schedulesController.getClassesByClientId)
router.patch('/classes/:classId/clients/:clientId/checkin/:dateInMillis', schedulesController.checkInClient)

export default router