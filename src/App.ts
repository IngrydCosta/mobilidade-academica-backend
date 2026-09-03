import express from "express";
import cors from "cors";
import routes from "./routes/index";

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: frontendUrl === "*" ? true : frontendUrl,
    credentials: true,
  })
);

app.use(express.json());

app.use(routes);

export { app };
