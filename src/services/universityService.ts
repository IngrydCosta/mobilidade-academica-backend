import { prisma } from "../database/prisma";

export class UniversityService {
  async create(nome: string, pais: string) {
    return prisma.university.create({
      data: {
        nome,
        pais,
      },
    });
  }
  async findAll() {
    const getAllUniversity = prisma.university.findMany();
    return getAllUniversity;
  }

  async findById(id: string) {
    return prisma.university.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUniversity(id: string, nome: string, pais: string) {
    const findUniversity = prisma.university.findUnique({
      where: {
        id,
      },
    });

    if (!findUniversity) {
      return "Universidade não encontrada";
    }
    const updatedUniversity = prisma.university.update({

        where:{
            id,
        },
        data: {
            nome,
            pais
        }
    })
    return updatedUniversity;
  }

  async deleteUniversity(id: string) {
    const findUniversity = await prisma.university.findUnique({
      where: {
        id,
      },
    });

    if (!findUniversity) {
      return "Universidade não encontrada";
    }
    
    await prisma.university.delete({

        where:{
            id,
        },
    })
    return "Universidade deletada com sucesso!";


  }
}
