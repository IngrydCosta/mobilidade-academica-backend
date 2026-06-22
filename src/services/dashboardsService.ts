import { prisma } from "../database/prisma";

export class DashboardsService {
  async dashPublicService() {
    const mobilities = await prisma.mobility.findMany({
      include: {
        university: true,
      },
    });

    
    const totalEnviados = mobilities.reduce((acc, item) => acc + item.enviados, 0);
    const totalRecebidos = mobilities.reduce((acc, item) => acc + item.recebidos, 0);
    const total = totalEnviados + totalRecebidos;

    const universities = await prisma.university.count();

    const countries = new Set(mobilities.map(m => m.university.pais));
    const totalPaises = countries.size;

    const yearData = new Map<number, { enviados: number; recebidos: number }>();

    mobilities.forEach((m) => {
      const current = yearData.get(m.ano) || { enviados: 0, recebidos: 0 };
      yearData.set(m.ano, {
        enviados: current.enviados + m.enviados,
        recebidos: current.recebidos + m.recebidos,
      });
    });

    const grafico = Array.from(yearData.entries())
      .sort((a, b) => a[0] - b[0]) 
      .map(([ano, values]) => ({
        ano: ano.toString(),
        enviados: values.enviados,
        recebidos: values.recebidos,
      }));

      const validYears = Array.from(yearData.entries())
    .filter(([_, values]) => (values.enviados + values.recebidos) > 0);

  const mediaPorAno = validYears.length > 0 
    ? Math.round(total / validYears.length) 
    : 0;

  
    let bestYear = 0;
    let max = 0;

    yearData.forEach((value, key) => {
      const totalAno = value.enviados + value.recebidos;
      if (totalAno > max) {
        max = totalAno;
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

      grafico, 

      indicators: {
        mediaPorAno,
        universidades: universities,
        paises: totalPaises,
        totalRegistros: mobilities.length,
      },
    };
  }

  async dashPrivateService(filters: {
    university?: string;
    country?: string;
    year?: number;
  }) {
    let mobilities = await prisma.mobility.findMany({
      include: { university: true },
    });

  
    if (filters.university) {
      
      mobilities = mobilities.filter((m) =>
        m.university.id === filters.university);
      
    }
    if (filters.country) {
      mobilities = mobilities.filter((m) => m.university.pais.toLowerCase() === filters.country!.toLowerCase()
  );
}
    if (filters.year) {
      const yearToFilter = Number(filters.year);
      mobilities = mobilities.filter((m) => m.ano === yearToFilter);
}
    
    
    if (mobilities.length === 0) {
    return {
      cards: { total: 0, enviados: 0, recebidos: 0, anoTop: 0 },
      grafico: [],
      table: [],
    };
  }

  const totalEnviados = mobilities.reduce((acc, m) => acc + m.enviados, 0);
  const totalRecebidos = mobilities.reduce((acc, m) => acc + m.recebidos, 0);

    const table = mobilities.map((m) => ({
      universidade: m.university.nome,
      pais: m.university.pais,
      ano: m.ano,
      enviados: m.enviados,
      recebidos: m.recebidos,
      total: m.enviados + m.recebidos,
    }));

    const yearData = new Map<number, { enviados: number; recebidos: number }>();

    mobilities.forEach((m) => {
      const current = yearData.get(m.ano) || { enviados: 0, recebidos: 0 };
      yearData.set(m.ano, {
        enviados: current.enviados + m.enviados,
        recebidos: current.recebidos + m.recebidos,
      });
    });

    const grafico = Array.from(yearData.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([ano, values]) => ({
        ano: ano.toString(),
        enviados: values.enviados,
        recebidos: values.recebidos,
      }));



    let bestYear = 0;
    let max = 0;
    yearData.forEach((value, key) => {
      const totalYear = value.enviados + value.recebidos;
      if (totalYear > max) {
        max = totalYear;
        bestYear = key;
      }
    });

    return {
      cards: {
        total: totalEnviados + totalRecebidos,
        enviados: totalEnviados,
        recebidos: totalRecebidos,
        anoTop: bestYear,
      },

      grafico,        
      table,
    };
  }
}