import { Router } from "express";
import universityRoutes from "./universityRoutes";
import mobilityRoutes from "./mobilityRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const routes = Router();

routes.use("/university", universityRoutes);
routes.use("/mobility", mobilityRoutes);
routes.use("/user", userRoutes);
routes.use("/login", authRoutes)

export default routes;