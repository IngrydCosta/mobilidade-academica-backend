import { Router } from "express";
import universityRoutes from "./universityRoutes";
import mobilityRoutes from "./mobilityRoutes";
import userRoutes from "./userRoutes";

const routes = Router();

routes.use("/university", universityRoutes);
routes.use("/mobility", mobilityRoutes);
routes.use("/user", userRoutes);

export default routes;