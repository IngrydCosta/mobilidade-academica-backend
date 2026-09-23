import { Router } from "express";
import {UniversityController} from "../controllers/universityController"
import { authMiddleware } from "../middleware/authMiddleware";
import { canManageMobility, isAdmin, isAuthenticated, sameUniversityOrAdmin } from "../middleware/permissionMiddleware";

const universityRoutes = Router();

const universityController = new UniversityController();

universityRoutes.post("/",authMiddleware, isAdmin, universityController.create);
universityRoutes.get("/", authMiddleware, isAuthenticated, universityController.getUniversity);
universityRoutes.get("/:id", authMiddleware, sameUniversityOrAdmin, universityController.getUniversityById);
universityRoutes.put("/:id", authMiddleware, isAdmin, universityController.updateUniversity);
universityRoutes.delete("/:id", authMiddleware, isAdmin, universityController.deleteUniversity);

export default universityRoutes;