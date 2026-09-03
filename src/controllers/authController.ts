import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {
  async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body || {};

      if (!email || !password) {
        return response.status(400).json({
          message: "Objeto inválido. Use email e password"
        });
      }

      const result = await authService.login(email, password, response);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(401).json({
        message: error instanceof Error ? error.message : "Erro de autenticação",
      });
    }
  }
}
