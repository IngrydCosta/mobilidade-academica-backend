import { Router } from "express";
import { RankingController } from "../controllers/rankingController";
import { authMiddleware } from "../middleware/authMiddleware";
import { isAuthenticated } from "../middleware/permissionMiddleware";

const rankingRoutes = Router();

const controller = new RankingController();

rankingRoutes.get("/",  controller.getRanking);

export default rankingRoutes;