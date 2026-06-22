import { Router } from "express";
import { DashboardsController } from "../controllers/dashboardsController";
import { isAuthenticated } from "../middleware/permissionMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const dashboardRoutes = Router();

const controller = new DashboardsController();

dashboardRoutes.get("/public", controller.getPublicDashboard);

dashboardRoutes.get("/private", authMiddleware, isAuthenticated, controller.getPrivateDashboard);

export default dashboardRoutes;