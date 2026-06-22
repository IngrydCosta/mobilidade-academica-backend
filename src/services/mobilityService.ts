import { prisma } from "../database/prisma";

export class MobilityService{

    async create (ano: number, enviados: number, recebidos: number, universityIdentifier: string){

      let university = await prisma.university.findUnique({
    where: { id: universityIdentifier }
  });

  if (!university) {
    university = await prisma.university.findFirst({
      where: { nome: universityIdentifier }
    });
  }

  if (!university) {
    throw new Error("Universidade não encontrada");
  }
        
      
      return prisma.mobility.create({
            data: {
                ano,
                enviados,
                recebidos,
                university:{
                    connect: {id: universityIdentifier}
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