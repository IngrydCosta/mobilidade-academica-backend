import { UserRole } from "@prisma/client";
import { prisma } from "../database/prisma";
import universityRoutes from "../routes/universityRoutes";

export class UserService{

async create(nome: string, email: string, password: string, perfil: UserRole, universityId: string){

        return prisma.user.create({
            data:{
                nome,
                email,
                password,
                perfil,
                university:{
                    connect: {id: universityId}
                }
            }
        });
    }
        async findAll(){
            return prisma.user.findMany();
            include: { university: true }
        }
}

