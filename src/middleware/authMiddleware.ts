import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";
import jwt from "jsonwebtoken";

interface TokenPayload {
  perfil: string;
  universityId?: string | null;
  iat: number;
  exp: number;
  sub: string;
}

export async function authMiddleware(
  request: AuthRequest,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!process.env.JWT_SECRET) {
    return response.status(500).json({
      message: "Erro de configuração no servidor (JWT_SECRET ausente)",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    request.user = {
      id: decoded.sub,
      perfil: decoded.perfil,
      universityId: decoded.universityId || null,
    };

    return next();
  } catch {
    return response.status(401).json({
      message: "Token inválido",
    });
  }
}