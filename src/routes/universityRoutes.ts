import { Router } from "express";
import {UniversityController} from "../controllers/universityController"

const universityRoutes = Router();

const universityController = new UniversityController();

universityRoutes.post("/", universityController.create);
universityRoutes.get("/", universityController.getUniversity);
universityRoutes.get("/:id", universityController.getUniversityById);
universityRoutes.put("/:id", universityController.updateUniversity);
universityRoutes.delete("/:id", universityController.deleteUniversity);

export default universityRoutes;