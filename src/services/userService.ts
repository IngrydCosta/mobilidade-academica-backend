import { UserRole } from "@prisma/client";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";


export class UserService {
  async create(
    nome: string,
    email: string,
    password: string,
    perfil: UserRole,
    universityId?: string,
  ) {

    const passwordHash = await hash(password, 8);
    
    return prisma.user.create({
      data: {
        nome,
        email,
        password: passwordHash,
        perfil,
        ...(universityId && {
        university: {
          connect: {
            id: universityId,
          },
        },
      })
      },
    });
  }
  async findAll() {
    return prisma.user.findMany();

  }

  async getUserId(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser(
    id: string,
    nome: string,
    email: string,
    password: string,
    perfil: UserRole,
    universityId: string,
  ) {

    const passwordHash = await hash(password, 8);

    const getUserId = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!getUserId) {
      return "Usuário não encontrado!";
    }
    const updatedUser = prisma.user.update({
      where: {
        id,
      },
      data: {
        nome,
        email,
        password: passwordHash,
        perfil,
        ...(universityId && {
          university: {
            connect: {
              id: universityId,
            },
          },
        }),
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const getUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!getUser) {
      return "Usuário não encontrado!";
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
    return "Usuário deletado com sucesso!";
  }


}
