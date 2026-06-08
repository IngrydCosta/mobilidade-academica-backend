import { Router } from "express";
import { RankingController } from "../controllers/rankingController";
import { isAuthenticated } from "../middleware/permissionMiddleware";

const router = Router();

const controller = new RankingController();

router.get("/ranking", isAuthenticated, controller.getRanking);

export default router;