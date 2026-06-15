import { Router } from "express";
import {UniversityController} from "../controllers/universityController"
import { authMiddleware } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/permissionMiddleware";

const universityRoutes = Router();

const universityController = new UniversityController();

universityRoutes.post("/",authMiddleware, isAdmin, universityController.create);
universityRoutes.get("/", authMiddleware, isAdmin, universityController.getUniversity);
universityRoutes.get("/:id", authMiddleware, isAdmin, universityController.getUniversityById);
universityRoutes.put("/:id", authMiddleware, isAdmin, universityController.updateUniversity);
universityRoutes.delete("/:id", authMiddleware, isAdmin, universityController.deleteUniversity);

export default universityRoutes;