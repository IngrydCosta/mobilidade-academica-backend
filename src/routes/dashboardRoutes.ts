import { Router } from "express";
import { DashboardsController } from "../controllers/dashboardsController";
import { isAuthenticated } from "../middleware/permissionMiddleware";

const router = Router();

const controller = new DashboardsController();

router.get("/dashboard/public", controller.getPublicDashboard);

router.get(
  "/dashboard/private",
  isAuthenticated,
  controller.getPrivateDashboard
);

export default router;