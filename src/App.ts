import express from "express";
import routes from "./routes/index"
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use(routes);

app.use("/users", userRoutes);

export { app };