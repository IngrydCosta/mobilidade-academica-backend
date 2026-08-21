import { prisma } from "../database/prisma";
import { Request, Response } from "express";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  async login(email: string, password: string, response: Response) {

    const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      

      if (!user) {
        throw new Error("Email ou senha inválidos");
      }

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Email ou senha inválidos");
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT-SECRET não encontrado no .env");
      }

      const token = jwt.sign(
        {
          perfil: user.perfil,
        },
        process.env.JWT_SECRET as string,
        
        {
          subject: user.id,
          expiresIn: "1d",
        },
      );
      const { password: userPassword, ...userNotPassword } = user;
      return {
        user: userNotPassword,
        token,
      };

  }
}
