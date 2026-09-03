import { Router } from "express";
import { MobilityController } from "../controllers/mobilityController";
import { authMiddleware } from "../middleware/authMiddleware";
import { canManageMobility, isAdmin } from "../middleware/permissionMiddleware";

const mobilityRoutes = Router();

const mobilityController = new MobilityController();

mobilityRoutes.post("/", authMiddleware, canManageMobility, mobilityController.create);
mobilityRoutes.get("/", authMiddleware, canManageMobility, mobilityController.getMobility);
mobilityRoutes.get("/:id", authMiddleware, canManageMobility, mobilityController.getMobilityById);
mobilityRoutes.put("/:id", authMiddleware, canManageMobility, mobilityController.updateMobility);
mobilityRoutes.delete("/:id", authMiddleware, canManageMobility, mobilityController.deleteMobility);

export default mobilityRoutes;