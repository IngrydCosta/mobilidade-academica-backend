import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AuthRequest } from "../types/auth";

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

  async forgotPassword(request: Request, response: Response) {
    try {
      const { email } = request.body || {};

      if (!email) {
        return response.status(400).json({
          message: "Informe o e-mail cadastrado.",
        });
      }

      const result = await authService.forgotPassword(email);
      return response.status(200).json(result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao recuperar senha.";
      const status = msg.includes("não encontrado") ? 404 : 400;
      return response.status(status).json({ message: msg });
    }
  }

  async changePassword(request: AuthRequest, response: Response) {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return response.status(401).json({ message: "Usuário não autenticado." });
      }

      const { oldPassword, newPassword } = request.body || {};
      if (!oldPassword || !newPassword) {
        return response.status(400).json({
          message: "Preencha a senha atual e a nova senha.",
        });
      }

      const result = await authService.changePassword(userId, oldPassword, newPassword);
      return response.status(200).json(result);
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao alterar a senha.",
      });
    }
  }
}
