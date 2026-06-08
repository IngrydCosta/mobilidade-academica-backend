import { Request, Response } from "express"
import { MobilityService } from "../services/mobilityService"

const mobilityService = new MobilityService();

export class MobilityController {

    
        async getMobility(request:Request, response:Response){
            const mobility = await mobilityService.findAll();
            return response.status(200).json(mobility)
        }
    
        async getMobilityById(request:Request, response:Response){
    
            const {id} = request.params;
    
            const mobility = await mobilityService.getMobilityId(id as string);
            
            return response.status(200).json(mobility)
        }
    

    async create(request: Request, response: Response) {

        const { ano, enviados, recebidos, universityId } = request.body;

        const mobility = await mobilityService.create(
            ano,
            enviados,
            recebidos,
            universityId
        );

        return response.status(201).json(mobility);

    }

    async updateMobility(request:Request, response: Response){
            
            const id = request.params.id as string;
            const {ano, enviados, recebidos, universityId} = request.body;
    
    
            const updatedMobility = await mobilityService.updateMobility(
                id,
                ano,
                enviados,
                recebidos,
                universityId            );
            return response.status(201).json(updatedMobility)
        }
        
        async deleteMobility(request:Request, response: Response){
            
            const id = request.params.id as string;
    
    
            const deletedMobility = await mobilityService.deleteMobility(
                id,
            );
            return response.status(201).json(deletedMobility)
        }
    

}