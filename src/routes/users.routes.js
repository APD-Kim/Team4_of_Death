import express from "express";
import { UserController } from "../controllers/users.controller.js";
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/users.repository.js";

const router = express.Router();

export default router;