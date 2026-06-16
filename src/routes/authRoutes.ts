import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/", authController.login);

export default authRoutes;