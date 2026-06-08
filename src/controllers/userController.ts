import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async getUser(request: Request, response: Response) {
    const user = await userService.findAll();
    return response.status(200).json(user);
  }

  async getUserById(request: Request, response: Response) {
    const { id } = request.params;

    const user = await userService.getUserId(id as string);

    return response.status(200).json(user);
  }

  async create(request: Request, response: Response) {
    const { nome, email, password, perfil, universityId } = request.body;

    const user = await userService.create(
      nome,
      email,
      password,
      perfil,
      universityId,
    );

    return response.status(201).json(user);
  }

  async updateUser(request: Request, response: Response) {
    const id = request.params.id as string;
    const { nome, email, password, perfil, universityId } = request.body;

    const updatedUser = await userService.updateUser(
      id,
      nome,
      email,
      password,
      perfil,
      universityId,
    );

    return response.status(201).json(updatedUser);
  }

  async deleteUser(request: Request, response: Response) {
    const id = request.params.id as string;

    const deletedUser = await userService.deleteUser(id);
    return response.status(201).json(deletedUser);
  }
}
