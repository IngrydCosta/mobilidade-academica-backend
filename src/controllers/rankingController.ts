import { Request, Response } from "express";
import { RankingService } from "../services/rankingService";

const service = new RankingService();

export class RankingController {
  async getRanking(req: Request, res: Response) {
console.log( req.query)
    try {
      const year = Number(req.query.year);
  
      const data = await service.getRanking(year);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar ranking. Verifique se o ano foi informado",
      });
    }
  }
}