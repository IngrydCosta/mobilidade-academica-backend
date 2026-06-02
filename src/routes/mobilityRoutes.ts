import { Router } from "express";
import { MobilityController } from "../controllers/mobilityController";

const mobilityRoutes = Router();

const mobilityController = new MobilityController();

mobilityRoutes.post("/", mobilityController.create);

export default mobilityRoutes;