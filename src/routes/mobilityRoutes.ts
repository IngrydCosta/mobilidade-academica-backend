import { Router } from "express";
import { MobilityController } from "../controllers/mobilityController";
import { authMiddleware } from "../middleware/authMiddleware";
import { canManageMobility, isAdmin } from "../middleware/permissionMiddleware";

const mobilityRoutes = Router();

const mobilityController = new MobilityController();

mobilityRoutes.post("/",authMiddleware, isAdmin, canManageMobility, mobilityController.create);
mobilityRoutes.get("/", authMiddleware, isAdmin, canManageMobility, mobilityController.getMobility);
mobilityRoutes.get("/:id", authMiddleware, isAdmin, canManageMobility, mobilityController.getMobilityById);
mobilityRoutes.put("/:id", authMiddleware, isAdmin, canManageMobility, mobilityController.updateMobility);
mobilityRoutes.delete("/:id", authMiddleware, isAdmin, canManageMobility, mobilityController.deleteMobility);

export default mobilityRoutes;