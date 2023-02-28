import express from "express";
import { usersController } from "../controllers/UsersController";

const router = express.Router()

router.get('/', usersController.getAllUsers)

export default router