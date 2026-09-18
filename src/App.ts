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

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Erro capturado pelo middleware global:", err);

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      message: "JSON malformatado no corpo da requisição.",
    });
  }

  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err.message || "Erro interno do servidor.";

  return res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { app };
