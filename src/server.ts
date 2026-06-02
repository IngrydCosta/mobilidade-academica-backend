import express from "express";
import universityRoutes from "./routes/universityRoutes";

const app = express();

app.use(express.json());
app.use("/universities", universityRoutes);

app.listen(3333, () => {
  console.log("Servidor iniciado");
});