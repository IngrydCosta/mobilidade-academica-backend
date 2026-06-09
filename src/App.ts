import express from "express";
import routes from "./routes/index"
import userRoutes from "./routes/userRoutes";

const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(routes);

export { app };