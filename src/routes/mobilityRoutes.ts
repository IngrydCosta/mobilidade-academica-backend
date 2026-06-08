import { Router } from "express";
import { MobilityController } from "../controllers/mobilityController";

const mobilityRoutes = Router();

const mobilityController = new MobilityController();

mobilityRoutes.post("/", mobilityController.create);
mobilityRoutes.get("/", mobilityController.getMobility);
mobilityRoutes.get("/:id", mobilityController.getMobilityById);
mobilityRoutes.put("/:id", mobilityController.updateMobility);
mobilityRoutes.delete("/:id", mobilityController.deleteMobility);

export default mobilityRoutes;