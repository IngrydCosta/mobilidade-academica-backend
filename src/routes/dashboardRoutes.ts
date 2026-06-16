import { Router } from "express";
import { DashboardsController } from "../controllers/dashboardsController";
import { isAuthenticated } from "../middleware/permissionMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const controller = new DashboardsController();

router.get("/dashboard/public", controller.getPublicDashboard);

router.get(
  "/dashboard/private", isAuthenticated, authMiddleware, controller.getPrivateDashboard);

export default router;