import { prisma } from "../database/prisma";

export class RankingService {
  async getRanking(year: number) {
    const mobilities = await prisma.mobility.findMany({
      where: {
        ano: year,
      },
      include: {
        university: true,
      },
    });

 
    const universityMap = new Map<
      string,
      { universidade: string; pais: string; total: number }
    >();

    mobilities.forEach((item) => {
      const key = item.universityId;

      const total = item.enviados + item.recebidos;

      const existing = universityMap.get(key);

      if (existing) {
        existing.total += total;
      } else {
        universityMap.set(key, {
          universidade: item.university.nome,
          pais: item.university.pais,
          total,
        });
      }
    });

    const universityRanking = Array.from(universityMap.values()).sort(
      (a, b) => b.total - a.total
    );

   
    const countryMap = new Map<string, number>();

    mobilities.forEach((item) => {
      const total = item.enviados + item.recebidos;

      const current = countryMap.get(item.university.pais) || 0;

      countryMap.set(item.university.pais, current + total);
    });

    const countryRanking = Array.from(countryMap.entries())
      .map(([pais, total]) => ({
        pais,
        total,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      universityRanking,
      countryRanking,
    };
  }
}