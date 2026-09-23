import { prisma } from "../database/prisma";
import { Response } from "express";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateRandomPassword } from "../utils/generatePassword";
import { emailService } from "./emailService";

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
      throw new Error("JWT_SECRET não configurado nas variáveis de ambiente");
    }

    const token = jwt.sign(
      {
        perfil: user.perfil,
        universityId: user.universityId || null,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );
    const { password: userPassword, ...userNotPassword } = user;
    return {
      user: userNotPassword,
      token,
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
      message: "Se esse e-mail estiver em nosso sistema, você receberá um link para criar uma nova senha.",
    };
    }

    const tempPassword = generateRandomPassword(8);
    const passwordHash = await hash(tempPassword, 8);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    });

    await emailService.sendPasswordResetEmail(user.email, user.nome, tempPassword);

    return {
      message: "Se esse e-mail estiver em nosso sistema, você receberá um link para criar uma nova senha.",
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordMatch = await compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error("A senha atual informada está incorreta.");
    }

    if (!newPassword || newPassword.trim().length < 6) {
      throw new Error("A nova senha deve possuir no mínimo 6 caracteres.");
    }

    const newPasswordHash = await hash(newPassword, 8);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return {
      message: "Senha alterada com sucesso!",
    };
  }
}
