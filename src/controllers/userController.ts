import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async getUser(request: Request, response: Response) {
    try {
      const users = await userService.findAll();
      return response.status(200).json(users);
    } catch (error) {
      return response.status(500).json({
        message: error instanceof Error ? error.message : "Erro ao buscar usuários",
      });
    }
  }

  async getUserById(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const user = await userService.getUserId(id as string);
      return response.status(200).json(user);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao buscar usuário";
      const status = msg.includes("não encontrado") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { nome, email, password, perfil, universityId } = request.body || {};

      if (!nome || !email || !perfil) {
        return response.status(400).json({
          message: "Preencha todos os campos obrigatórios (nome, email, perfil).",
        });
      }

      const user = await userService.create(
        nome,
        email,
        password,
        perfil,
        universityId
      );

      return response.status(201).json(user);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao criar usuário";
      const status = msg.includes("já cadastrado") || msg.includes("obrigatória") ? 400 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async updateUser(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const { nome, email, perfil, universityId } = request.body || {};

      if (!nome || !email || !perfil) {
        return response.status(400).json({
          message: "Preencha todos os campos obrigatórios (nome, email, perfil).",
        });
      }

      const updatedUser = await userService.updateUser(
        id,
        nome,
        email,
        perfil,
        universityId
      );

      return response.status(200).json(updatedUser);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar usuário";
      const status = msg.includes("não encontrado") ? 404 : msg.includes("já cadastrado") || msg.includes("obrigatór") || msg.includes("inválid") ? 400 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async deleteUser(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const deletedUser = await userService.deleteUser(id);
      return response.status(200).json(deletedUser);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao deletar usuário";
      const status = msg.includes("não encontrado") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }
}
