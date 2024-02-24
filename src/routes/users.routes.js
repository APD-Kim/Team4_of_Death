import express from "express";
import { UserController } from "../controllers/users.controller.js";
import { UserService } from "../services/users.service.js";
import { UserRepository } from "../repositories/users.repository.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

const userRepository = new UserRepository(prisma)
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.post('/sign-up', userController.signUp)
router.post('/login', userController.signUp)


export default router;