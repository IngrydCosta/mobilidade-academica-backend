import express from "express";

import universityRoutes from "./routes/universityRoutes";
import userRoutes from "./routes/userRoutes";
import mobilityRoutes from "./routes/mobilityRoutes";

const app = express();

app.use(express.json());

app.use("/universities", universityRoutes);
app.use("/users", userRoutes);
app.use("/mobilities", mobilityRoutes);

export { app };