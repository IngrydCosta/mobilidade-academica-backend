import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";
import jwt from "jsonwebtoken";

interface TokenPayload {
  perfil: string;
  iat: number;
  exp: number;
  sub: string;
}

export async function authMiddleware(
  request: AuthRequest,
  response: Response,
  next: NextFunction
) {
  
  console.log("AUTH MIDDLEWARE EXECUTOU");
  
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    (request as any).user = {
      id: decoded.sub,
      perfil: decoded.perfil,
    };

    return next();

  } catch {
    return response.status(401).json({
      message: "Token inválido",
    });
  }
}