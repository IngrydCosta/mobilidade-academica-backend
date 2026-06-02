import { Router } from "express";
import {UniversityController} from "../controllers/universityController"

const universityRoutes = Router();

const universityController = new UniversityController();

universityRoutes.post("/", universityController.create);

export default universityRoutes;