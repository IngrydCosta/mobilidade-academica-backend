import { Router } from "express";
import { RankingController } from "../controllers/rankingController";
import { authMiddleware } from "../middleware/authMiddleware";
import { isAuthenticated } from "../middleware/permissionMiddleware";

const router = Router();

const controller = new RankingController();

router.get("/",  controller.getRanking);

export default router;