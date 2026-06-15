import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/permissionMiddleware";


const userRoutes = Router();

const userController = new UserController();

userRoutes.post("/",  authMiddleware, isAdmin,  userController.create);
userRoutes.get("/", authMiddleware, isAdmin, userController.getUser);
userRoutes.get("/:id", authMiddleware, isAdmin, userController.getUserById);
userRoutes.put("/:id", authMiddleware, isAdmin, userController.updateUser);
userRoutes.delete("/:id", authMiddleware, isAdmin, userController.deleteUser);

export default userRoutes;