import { Request, Response } from "express"
import { MobilityService } from "../services/mobilityService"

const mobilityService = new MobilityService();

export class MobilityController {

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
}