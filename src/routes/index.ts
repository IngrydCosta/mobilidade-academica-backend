import { Router } from "express";
import universityRoutes from "./universityRoutes";
import mobilityRoutes from "./mobilityRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import rankingRoutes from "./rankingRoutes";
import dashboardRoutes from "./dashboardRoutes";

const routes = Router();

routes.use("/university", universityRoutes);
routes.use("/mobility", mobilityRoutes);
routes.use("/user", userRoutes);
routes.use("/login", authRoutes);
routes.use("/ranking", rankingRoutes);
routes.use("/dashboard", dashboardRoutes)


export default routes;