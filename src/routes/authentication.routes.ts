import express from "express";
import { authenticationController } from "../controllers/AuthenticationController";

const router = express.Router()

router.post('/', authenticationController.authenticate)

export default router