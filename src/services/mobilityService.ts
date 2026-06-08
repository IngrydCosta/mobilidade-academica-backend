import { prisma } from "../database/prisma";

export class MobilityService{

    async create (ano: number, enviados: number, recebidos: number, universityId: string){

        return prisma.mobility.create({
            data: {
                ano,
                enviados,
                recebidos,
                university:{
                    connect: {id: universityId}
                }
            }
        });
    }
    async findAll(){
        return prisma.mobility.findMany();
        include: { university: true}
    }

    async getMobilityId(id: string) {
    return prisma.mobility.findUnique({
      where: {
        id,
      },
    });
  }

  async updateMobility(id: string, ano: number, enviados: number, recebidos: number, universityId: string) {
    const getMobilityId = prisma.mobility.findUnique({
      where: {
        id,
      },
    });

    if (!getMobilityId) {
      return "Universidade não encontrada";
    }
    const updateMobility = prisma.mobility.update({

        where:{
            id,
        },
        data: {
            ano,
            enviados,
            recebidos,
            universityId,
        }
    })
    return updateMobility;
  }
    async deleteMobility(id: string) {
    const getMobility = await prisma.mobility.findUnique({
      where: {
        id,
      },
    });

    if (!getMobility) {
      return "Mobilidade não encontrada";
    }
    
    await prisma.mobility.delete({

        where:{
            id,
        },
    })
    return "Mobilidade deletada com sucesso!";


  }

}