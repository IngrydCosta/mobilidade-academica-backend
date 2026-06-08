import { prisma } from "../database/prisma";

export class DashboardsService {
  async dashPublicService() {
    const mobility = await prisma.mobility.findMany({
      include: {
        university: true,
      },
    });

    const totalEnviados = mobility.reduce(
      (acc, item) => acc + item.enviados,
      0
    );

    const totalRecebidos = mobility.reduce(
      (acc, item) => acc + item.recebidos,
      0
    );

    const total = totalEnviados + totalRecebidos;

    const universities = await prisma.university.count();

    const yearMap = new Map<number, number>();

    mobility.forEach((m) => {
      const current = yearMap.get(m.ano) || 0;
      yearMap.set(m.ano, current + (m.enviados + m.recebidos));
    });

    let bestYear = 0;
    let max = 0;

    yearMap.forEach((value, key) => {
      if (value > max) {
        max = value;
        bestYear = key;
      }
    });

    return {
      cards: {
        total,
        enviados: totalEnviados,
        recebidos: totalRecebidos,
        anoTop: bestYear,
      },

      indicators: {
        universidades: universities,
        totalRegistros: mobility.length,
      },
    };
  }

  async dashPrivateService(filters: {
    university?: string;
    country?: string;
    year?: number;
  }) {
    const mobilities = await prisma.mobility.findMany({
      include: {
        university: true,
      },
    });

    let data = mobilities.map((m) => ({
      universidade: m.university.nome,
      pais: m.university.pais,
      ano: m.ano,
      enviados: m.enviados,
      recebidos: m.recebidos,
      total: m.enviados + m.recebidos,
    }));

    if (filters.university) {
      data = data.filter((d) =>
        d.universidade
          .toLowerCase()
          .includes(filters.university!.toLowerCase())
      );
    }

    if (filters.country) {
      data = data.filter((d) => d.pais === filters.country);
    }

    if (filters.year) {
      data = data.filter((d) => d.ano === filters.year);
    }

    const totalEnviados = data.reduce((acc, d) => acc + d.enviados, 0);
    const totalRecebidos = data.reduce((acc, d) => acc + d.recebidos, 0);

    const yearMap = new Map<number, number>();

    data.forEach((d) => {
      const current = yearMap.get(d.ano) || 0;
      yearMap.set(d.ano, current + d.total);
    });

    const charts = Object.fromEntries(yearMap);

    let bestYear = 0;
    let max = 0;

    for (const [year, value] of Object.entries(charts)) {
      if (Number(value) > max) {
        max = Number(value);
        bestYear = Number(year);
      }
    }

    return {
      cards: {
        total: totalEnviados + totalRecebidos,
        enviados: totalEnviados,
        recebidos: totalRecebidos,
        anoTop: bestYear,
      },

      table: data,

      charts,
    };
  }
}