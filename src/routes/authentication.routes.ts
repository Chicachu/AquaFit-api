import express from "express";
import { authenticationController } from "../controllers/AuthenticationController";

const router = express.Router()

router.post('/auth', authenticationController.authenticate)
router.post('/register', authenticationController.registerNewUser)

export default router