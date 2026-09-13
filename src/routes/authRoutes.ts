import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/", authController.login);
authRoutes.post("/login", authController.login);
authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/change-password", authMiddleware, authController.changePassword);

export default authRoutes;