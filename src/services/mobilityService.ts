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


export function validateStudent(st: any, identifier: string | number): StudentData {
  const prefix = typeof identifier === "number" ? `Estudante na linha/posição ${identifier + 1}` : `Estudante`;

  if (!st || typeof st !== "object") {
    throw new Error(`${prefix}: dados inválidos.`);
  }

  const matricula = String(st.matricula || "").trim();
  const nome = String(st.nome || "").trim();
  const email = String(st.email || "").trim();
  const paisOrigem = String(st.paisOrigem || "").trim();
  const paisDestino = String(st.paisDestino || "").trim();
  const rawTipo = String(st.tipoMobilidade || "").trim().toUpperCase();
  const cursoOrigem = String(st.cursoOrigem || "").trim();
  const cursoDestino = String(st.cursoDestino || "").trim();
  const universidadeOrigem = String(st.universidadeOrigem || "").trim();
  const universidadeDestino = String(st.universidadeDestino || "").trim();

  if (!matricula) throw new Error(`${prefix}: o campo "matricula" é obrigatório.`);
  if (!nome) throw new Error(`${prefix}: o campo "nome" é obrigatório.`);
  if (!email) throw new Error(`${prefix}: o campo "email" é obrigatório.`);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`${prefix}: o e-mail "${email}" possui formato inválido.`);
  }

  if (!paisOrigem) throw new Error(`${prefix}: o campo "paisOrigem" é obrigatório.`);
  if (!paisDestino) throw new Error(`${prefix}: o campo "paisDestino" é obrigatório.`);

  if (rawTipo !== "ENVIADO" && rawTipo !== "RECEBIDO") {
    throw new Error(`${prefix}: o campo "tipoMobilidade" deve ser "ENVIADO" ou "RECEBIDO".`);
  }

  if (!cursoOrigem) throw new Error(`${prefix}: o campo "cursoOrigem" é obrigatório.`);
  if (!cursoDestino) throw new Error(`${prefix}: o campo "cursoDestino" é obrigatório.`);
  if (!universidadeDestino) throw new Error(`${prefix}: o campo "universidadeDestino" é obrigatório.`);

  return {
    matricula,
    nome,
    email,
    paisOrigem,
    paisDestino,
    tipoMobilidade: rawTipo,
    cursoOrigem,
    cursoDestino,
    universidadeOrigem,
    universidadeDestino,
  };
}

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
    if (!universityId || String(universityId).trim() === "") {
      throw new Error("Universidade é obrigatória.");
    }

    const numAno = Number(ano);
    if (!ano || isNaN(numAno) || !Number.isInteger(numAno) || numAno < 1900 || numAno > 2100) {
      throw new Error("Ano inválido. Informe um ano válido entre 1900 e 2100.");
    }

    const numSemestre = Number(semestre);
    if (isNaN(numSemestre) || (numSemestre !== 1 && numSemestre !== 2)) {
      throw new Error("Semestre inválido. Deve ser 1 ou 2.");
    }

    const university = await prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!university) {
      throw new Error("Universidade não encontrada");
    }

    if (!Array.isArray(estudantes) || estudantes.length === 0) {
      throw new Error("É obrigatório informar ao menos um estudante para cadastrar a mobilidade.");
    }

    const validatedStudents: StudentData[] = estudantes.map((st, idx) => validateStudent(st, idx));

    const numEnviados = Number(enviados ?? 0);
    const numRecebidos = Number(recebidos ?? 0);
    if (isNaN(numEnviados) || numEnviados < 0 || isNaN(numRecebidos) || numRecebidos < 0) {
      throw new Error("Os campos de estudantes enviados e recebidos devem ser números positivos.");
    }

    const existingMobility = await prisma.mobility.findFirst({
      where: {
        universityId,
        ano: numAno,
        semestre: numSemestre,
      },
    });

    if (existingMobility) {
      if (validatedStudents.length > 0) {
        await prisma.mobilityStudent.createMany({
          data: validatedStudents.map((st) => ({
            ...st,
            mobilityId: existingMobility.id,
          })),
        });
      }

      await this.recalculateMobilityCounts(existingMobility.id);

      return this.getMobilityId(existingMobility.id);
    }

    const calculatedEnviados = validatedStudents.length > 0
      ? validatedStudents.filter((s) => s.tipoMobilidade === "ENVIADO").length
      : numEnviados;

    const calculatedRecebidos = validatedStudents.length > 0
      ? validatedStudents.filter((s) => s.tipoMobilidade === "RECEBIDO").length
      : numRecebidos;

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
          create: validatedStudents,
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

    const { id, mobilityId, createdAt, updatedAt, ...cleanData } = data as any;

    const updated = await prisma.mobilityStudent.update({
      where: { id: studentId },
      data: cleanData,
    });

    await this.recalculateMobilityCounts(student.mobilityId);

    return updated;
  }

  async addStudentToMobility(mobilityId: string, studentData: StudentData) {
    if (!mobilityId || mobilityId.trim() === "") {
      throw new Error("ID da mobilidade é obrigatório.");
    }

    const mobility = await prisma.mobility.findUnique({
      where: { id: mobilityId },
    });

    if (!mobility) {
      throw new Error("Mobilidade não encontrada.");
    }

    const validatedStudent = validateStudent(studentData, "adicionado");

    const existingStudent = await prisma.mobilityStudent.findFirst({
      where: {
        mobilityId,
        matricula: validatedStudent.matricula,
      },
    });

    if (existingStudent) {
      throw new Error(`Estudante com matrícula "${validatedStudent.matricula}" já cadastrado nesta mobilidade.`);
    }

    const student = await prisma.mobilityStudent.create({
      data: {
        ...validatedStudent,
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