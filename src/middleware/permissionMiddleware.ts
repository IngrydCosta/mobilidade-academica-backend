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

  if (req.user.perfil === UserRole.GESTOR_MOBILIDADE) {
    const universityId =
      req.params?.universityId || req.params?.id || req.body?.universityId;

    if (!req.user.universityId) {
      return res.status(403).json({ message: "Gestor sem universidade vinculada" });
    }

    if (universityId && req.user.universityId !== universityId) {
      return res.status(403).json({ message: "Acesso restrito à sua universidade" });
    }

    return next();
  }

  return res.status(403).json({ message: "Acesso não permitido para este perfil" });
}