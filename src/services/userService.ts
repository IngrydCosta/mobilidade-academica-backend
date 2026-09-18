import { UserRole } from "@prisma/client";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";


import { generateRandomPassword } from "../utils/generatePassword";
import { emailService } from "./emailService";

export class UserService {
  async create(
    nome: string,
    email: string,
    password?: string,
    perfil?: UserRole,
    universityId?: string
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email já cadastrado.");
    }

    if (!perfil) {
      throw new Error("O perfil do usuário é obrigatório.");
    }

    const effectiveUniversityId = perfil === UserRole.ADMINISTRADOR ? undefined : universityId;

    if (
      perfil === UserRole.GESTOR_MOBILIDADE &&
      (!effectiveUniversityId || effectiveUniversityId.trim() === "")
    ) {
      throw new Error(
        "Para o perfil de Gestor de Mobilidade, a universidade é obrigatória."
      );
    }

    const rawPassword = (password && password.trim() !== "") ? password : generateRandomPassword(8);
    const passwordHash = await hash(rawPassword, 8);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        password: passwordHash,
        perfil: perfil,
        ...(effectiveUniversityId && {
          university: {
            connect: {
              id: effectiveUniversityId,
            },
          },
        }),
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        universityId: true,
        university: {
          select: {
            id: true,
            nome: true,
            pais: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    emailService.sendWelcomeEmail(user.email, user.nome, rawPassword).catch((err) => {
      console.error("Erro ao enviar e-mail no cadastro:", err);
    });

    return {
      ...user,
      generatedPassword: rawPassword,
    };
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        universityId: true,
        university: {
          select: {
            id: true,
            nome: true,
            pais: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserId(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        universityId: true,
        university: {
          select: {
            id: true,
            nome: true,
            pais: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    return user;
  }

  async updateUser(
    id: string,
    nome: string,
    email: string,
    perfil: UserRole,
    universityId?: string
  ) {
    if (!id || id.trim() === "") {
      throw new Error("ID do usuário é obrigatório.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado!");
    }

    const cleanNome = (nome || "").trim();
    if (!cleanNome) {
      throw new Error("O nome do usuário é obrigatório.");
    }

    const cleanEmail = (email || "").trim();
    if (!cleanEmail) {
      throw new Error("O e-mail do usuário é obrigatório.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Formato de e-mail inválido.");
    }

    const validRoles = [UserRole.ADMINISTRADOR, UserRole.GESTOR_MOBILIDADE, UserRole.ESTUDANTE];
    if (!perfil || !validRoles.includes(perfil)) {
      throw new Error("Perfil de usuário inválido.");
    }

    if (cleanEmail !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (emailInUse) {
        throw new Error("Email já cadastrado em outra conta.");
      }
    }

    const effectiveUniversityId = perfil === UserRole.ADMINISTRADOR
      ? null
      : (universityId !== undefined ? (universityId || null) : undefined);

    if (
      perfil === UserRole.GESTOR_MOBILIDADE &&
      (!effectiveUniversityId || effectiveUniversityId.trim() === "")
    ) {
      throw new Error(
        "Para o perfil de Gestor de Mobilidade, a universidade é obrigatória."
      );
    }

    const dataToUpdate: any = {
      nome: cleanNome,
      email: cleanEmail,
      perfil,
      universityId: effectiveUniversityId,
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        universityId: true,
        university: {
          select: {
            id: true,
            nome: true,
            pais: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const getUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!getUser) {
      throw new Error("Usuário não encontrado!");
    }

    await prisma.user.delete({
      where: { id },
    });

    return { message: "Usuário deletado com sucesso!" };
  }
}
