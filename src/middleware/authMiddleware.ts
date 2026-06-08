import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  perfil: string;
  iat: number;
  exp: number;
  sub: string;
}

export async function authMiddleware(
  request: Request,
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

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    request.user = {
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