import express from 'express'
import { classesController } from '../controllers/ClassesController'

const router = express.Router()

router.get('/', classesController.getClasses)
router.post('/', classesController.addNewClass)

export default router