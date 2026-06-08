import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {

  async login(request: Request, response: Response) {

    const { email, password } = request.body;

    const result = await authService.login(
      email,
      password
    );

    return response.status(200).json(result);
  }

}