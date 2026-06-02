import { Request, Response } from "express";
import { UniversityService } from "../services/universityService"

const universityService = new UniversityService();

export class UniversityController{

    async create(request:Request, response:Response){

        const { nome, pais } = request.body;

        const university = await universityService.create(
            nome,
            pais
        );

        return response.status(201).json(university);
    }
}