import express from "express"
import { calendarController } from "../controllers/CalendarController"

const router = express.Router()
router.get('/:year/:month', calendarController.getMonthlySchedule)

export default router