import { prisma } from "../database/prisma";

type StudentData = {
  matricula: string;
  nome: string;
  email: string;
  paisOrigem: string;
  paisDestino: string;
  cursoOrigem: string;
  cursoDestino: string;
};

type CreateMobilityData = {
  ano: number;
  enviados: number;
  recebidos: number;
  universityId: string;
  estudantes?: StudentData[];
};


export class MobilityService {
  async create({
    ano,
    enviados,
    recebidos,
    universityId,
    estudantes = [],
  }: CreateMobilityData) {
    const university = await prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!university) {
      throw new Error("Universidade não encontrada");
    }

    return prisma.mobility.create({
      data: {
        ano,
        enviados,
        recebidos,
        university: {
          connect: {
            id: universityId,
          },
        },
        students: {
          create: estudantes,
        },
      },
      include: {
        university: true,
        students: true,
      },
    });
  }

  async findAll() {
    return prisma.mobility.findMany({
      include: {
        university: true,
        students: true,
      },
    });
  }

  async getMobilityId(id: string) {
    return prisma.mobility.findUnique({
      where: {
        id,
      },
      include: {
        university: true,
        students: true,
      },
    });
  }

  async updateMobility(
    id: string,
    ano: number,
    enviados: number,
    recebidos: number,
    universityId: string,
  ) {
    const mobility = await prisma.mobility.findUnique({
      where: {
        id,
      },
    });

    if (!mobility) {
      return "Mobilidade não encontrada";
    }

    return prisma.mobility.update({
      where: {
        id,
      },
      data: {
        ano,
        enviados,
        recebidos,
        universityId,
      },
    });
  }

  async deleteMobility(id: string) {
    const mobility = await prisma.mobility.findUnique({
      where: {
        id,
      },
    });

    if (!mobility) {
      return "Mobilidade não encontrada";
    }

    await prisma.mobility.delete({
      where: {
        id,
      },
    });

    return "Mobilidade deletada com sucesso!";
  }
}