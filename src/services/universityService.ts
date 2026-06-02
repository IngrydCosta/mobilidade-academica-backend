import { prisma } from "../database/prisma";

export class UniversityService{

    async create (nome: string, pais: string){

        return prisma.university.create({
            data: {
                nome,
                pais,
            }
        });
    }
        async findAll(){
            return prisma.university.findMany();
        }

    }
