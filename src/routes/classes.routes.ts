import express from 'express'
import { classesController } from '../controllers/ClassesController'

const router = express.Router()

router.get('/', classesController.getClasses)
router.get('/:classId/:dateInMillis', classesController.getClassInfo)
router.post('/', classesController.addNewClass)
router.patch('/:classId/:dateInMillis', classesController.cancelClass)

export default router