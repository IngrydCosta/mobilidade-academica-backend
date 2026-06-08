import { Request, Response } from "express";
import { DashboardsService } from "../services/dashboardsService";

const service = new DashboardsService();

export class DashboardsController {
  async getPublicDashboard(req: Request, res: Response) {
    try {
      const data = await service.dashPublicService();

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar dashboard público",
      });
    }
  }

  async getPrivateDashboard(req: Request, res: Response) {
    try {
      const data = await service.dashPrivateService(req.query);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar dashboard privado",
      });
    }
  }
}