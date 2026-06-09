import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";
import { UserRole } from "@prisma/client";

export function isAuthenticated(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  next();
}


export function isAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (req.user.perfil !== UserRole.ADMINISTRADOR) {
    return res.status(403).json({ message: "Apenas administrador" });
  }

  next();
}

export function canManageMobility(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (
    req.user.perfil === UserRole.ADMINISTRADOR ||
    req.user.perfil === UserRole.GESTOR_MOBILIDADE
  ) {
    return next();
  }

  return res.status(403).json({ message: "Sem permissão para mobilidade" });
}


export function canView(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  next();
}

export function sameUniversityOrAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (req.user.perfil === UserRole.ADMINISTRADOR) {
    return next();
  }

  const universityId =
    req.params.universityId || req.body.universityId;

  if (!universityId) {
    return res.status(400).json({ message: "UniversityId obrigatório" });
  }

  if (req.user.universityId !== universityId) {
    return res.status(403).json({
      message: "Acesso restrito à sua universidade",
    });
  }

  next();
}