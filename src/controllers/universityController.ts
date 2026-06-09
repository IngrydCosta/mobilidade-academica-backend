import { Request, Response } from "express";
import { UniversityService } from "../services/universityService"

const universityService = new UniversityService();

export class UniversityController{

    async getUniversity(request:Request, response:Response){
        const university = await universityService.findAll();
        return response.status(200).json(university)
    }

    async getUniversityById(request:Request, response:Response){

        const {id} = request.params;

        const university = await universityService.findById(id as string);
        
        return response.status(200).json(university)
    }

    async create(request:Request, response:Response){

        const { nome, pais } = request.body;

        const university = await universityService.create(
            nome,
            pais
        );
        
        return response.status(201).json(university);
    }

    async updateUniversity(request:Request, response: Response){
        
        const id = request.params.id as string;
        const {nome, pais} = request.body;


        const updatedUniversity = await universityService.updateUniversity(
            id,
            nome,
            pais
        );
        return response.status(201).json(updatedUniversity)
    }
    
    async deleteUniversity(request:Request, response: Response){
        
        const id = request.params.id as string;


        const deletedUniversity = await universityService.deleteUniversity(
            id,
        );
        return response.status(201).json(deletedUniversity)
    }

    
}
