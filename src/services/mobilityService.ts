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
  private async recalculateMobilityCounts(mobilityId: string) {
    const students = await prisma.mobilityStudent.findMany({
      where: { mobilityId },
    });

    const enviados = students.filter((s) => s.tipoMobilidade === "ENVIADO").length;
    const recebidos = students.filter((s) => s.tipoMobilidade === "RECEBIDO").length;

    await prisma.mobility.update({
      where: { id: mobilityId },
      data: {
        enviados,
        recebidos,
      },
    });
  }

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

    const numAno = Number(ano);
    const numSemestre = Number(semestre) || 1;

    const existingMobility = await prisma.mobility.findFirst({
      where: {
        universityId,
        ano: numAno,
        semestre: numSemestre,
      },
    });

    if (existingMobility) {
      if (estudantes.length > 0) {
        await prisma.mobilityStudent.createMany({
          data: estudantes.map((st) => ({
            ...st,
            mobilityId: existingMobility.id,
          })),
        });
      }

      await this.recalculateMobilityCounts(existingMobility.id);

      return this.getMobilityId(existingMobility.id);
    }

    const calculatedEnviados = estudantes.length > 0
      ? estudantes.filter((s) => s.tipoMobilidade === "ENVIADO").length
      : Number(enviados || 0);

    const calculatedRecebidos = estudantes.length > 0
      ? estudantes.filter((s) => s.tipoMobilidade === "RECEBIDO").length
      : Number(recebidos || 0);

    return prisma.mobility.create({
      data: {
        ano: numAno,
        semestre: numSemestre,
        enviados: calculatedEnviados,
        recebidos: calculatedRecebidos,
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
      orderBy: [
        { ano: 'desc' },
        { semestre: 'desc' }
      ]
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

    const updated = await prisma.mobility.update({
      where: {
        id,
      },
      data: {
        ano: Number(ano),
        semestre: semestre ? Number(semestre) : undefined,
        universityId,
      },
      include: {
        university: true,
        students: true,
      },
    });

    await this.recalculateMobilityCounts(id);

    return this.getMobilityId(id);
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

    await prisma.mobilityStudent.deleteMany({
      where: { mobilityId: id },
    });

    await prisma.mobility.delete({
      where: {
        id,
      },
    });

    return { message: "Mobilidade deletada com sucesso!" };
  }

  async deleteStudent(studentId: string) {
    const student = await prisma.mobilityStudent.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error("Estudante de mobilidade não encontrado.");
    }

    const mobilityId = student.mobilityId;

    await prisma.mobilityStudent.delete({
      where: { id: studentId },
    });

    await this.recalculateMobilityCounts(mobilityId);

    return { message: "Estudante removido com sucesso!" };
  }

  async updateStudent(studentId: string, data: Partial<StudentData>) {
    const student = await prisma.mobilityStudent.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error("Estudante de mobilidade não encontrado.");
    }

    const updated = await prisma.mobilityStudent.update({
      where: { id: studentId },
      data,
    });

    await this.recalculateMobilityCounts(student.mobilityId);

    return updated;
  }

  async addStudentToMobility(mobilityId: string, studentData: StudentData) {
    const mobility = await prisma.mobility.findUnique({
      where: { id: mobilityId },
    });

    if (!mobility) {
      throw new Error("Mobilidade não encontrada.");
    }

    const student = await prisma.mobilityStudent.create({
      data: {
        ...studentData,
        mobilityId,
      },
    });

    await this.recalculateMobilityCounts(mobilityId);

    return student;
  }

  async findStudentById(studentId: string) {
    return prisma.mobilityStudent.findUnique({
      where: { id: studentId },
      include: { mobility: true },
    });
  }
}