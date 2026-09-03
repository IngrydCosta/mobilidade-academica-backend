import { prisma } from "../database/prisma";

export class UniversityService {
  async create(nome: string, pais: string) {
    if (!nome || !pais) {
      throw new Error("Nome e país são obrigatórios.");
    }
    return prisma.university.create({
      data: {
        nome,
        pais,
      },
    });
  }

  async findAll() {
    return prisma.university.findMany();
  }

  async findById(id: string) {
    const university = await prisma.university.findUnique({
      where: { id },
    });
    if (!university) {
      throw new Error("Universidade não encontrada");
    }
    return university;
  }

  async updateUniversity(id: string, nome: string, pais: string) {
    const findUniversity = await prisma.university.findUnique({
      where: { id },
    });

    if (!findUniversity) {
      throw new Error("Universidade não encontrada");
    }

    const updatedUniversity = await prisma.university.update({
      where: { id },
      data: {
        nome,
        pais,
      },
    });

    return updatedUniversity;
  }

  async deleteUniversity(id: string) {
    const findUniversity = await prisma.university.findUnique({
      where: { id },
    });

    if (!findUniversity) {
      throw new Error("Universidade não encontrada");
    }

    await prisma.university.delete({
      where: { id },
    });

    return { message: "Universidade deletada com sucesso!" };
  }
}
