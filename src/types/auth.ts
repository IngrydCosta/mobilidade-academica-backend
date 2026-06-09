import { Request as ExpressRequest } from "express";

export interface AuthRequest extends ExpressRequest {
  user?: {
    id: string;
    perfil: string;
    universityId?: string | null;
  };
}