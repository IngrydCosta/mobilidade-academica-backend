import { prisma } from "../database/prisma";

type StudentData = {
  matricula: string;
  nome: string;
  email: string;
  paisOrigem: string;
  paisDestino: string;
  tipoMobilidade: string;
  cursoOrigem: string;
  cursoDestino: string;
  universidadeOrigem: string;
  universidadeDestino: string;
};

type CreateMobilityData = {
  ano: number;
  semestre?: number;
  enviados: number;
  recebidos: number;
  universityId: string;
  estudantes: StudentData[];
};


export class MobilityService {
  async create({
    ano,
    semestre = 1,
    enviados,
    recebidos,
    universityId,
    estudantes = [],
  }: CreateMobilityData) {
    if (!universityId) {
      throw new Error("Universidade é obrigatória.");
    }

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
        ano: Number(ano),
        semestre: Number(semestre) || 1,
        enviados: Number(enviados),
        recebidos: Number(recebidos),
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

  async findAll(universityId?: string) {
    const whereClause = universityId ? { universityId } : {};

    return prisma.mobility.findMany({
      where: whereClause,
      include: {
        university: true,
        students: true,
      },
    });
  }

  async getMobilityId(id: string) {
    const mobility = await prisma.mobility.findUnique({
      where: {
        id,
      },
      include: {
        university: true,
        students: true,
      },
    });

    if (!mobility) {
      throw new Error("Mobilidade não encontrada");
    }

    return mobility;
  }

  async updateMobility(
    id: string,
    ano: number,
    enviados: number,
    recebidos: number,
    universityId: string,
    semestre?: number
  ) {
    const mobility = await prisma.mobility.findUnique({
      where: {
        id,
      },
    });

    if (!mobility) {
      throw new Error("Mobilidade não encontrada");
    }

    if (universityId) {
      const university = await prisma.university.findUnique({
        where: { id: universityId },
      });
      if (!university) {
        throw new Error("Universidade não encontrada");
      }
    }

    return prisma.mobility.update({
      where: {
        id,
      },
      data: {
        ano: Number(ano),
        semestre: semestre ? Number(semestre) : undefined,
        enviados: Number(enviados),
        recebidos: Number(recebidos),
        universityId,
      },
      include: {
        university: true,
        students: true,
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
      throw new Error("Mobilidade não encontrada");
    }

    await prisma.mobility.delete({
      where: {
        id,
      },
    });

    return { message: "Mobilidade deletada com sucesso!" };
  }
}