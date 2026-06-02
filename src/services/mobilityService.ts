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
}