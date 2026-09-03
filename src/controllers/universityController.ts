import { Request, Response } from "express";
import { UniversityService } from "../services/universityService"

const universityService = new UniversityService();

export class UniversityController {
  async getUniversity(request: Request, response: Response) {
    try {
      const universities = await universityService.findAll();
      return response.status(200).json(universities);
    } catch (error) {
      return response.status(500).json({
        message: error instanceof Error ? error.message : "Erro ao buscar universidades",
      });
    }
  }

  async getUniversityById(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const university = await universityService.findById(id as string);
      return response.status(200).json(university);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao buscar universidade";
      const status = msg.includes("não encontrada") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { nome, pais } = request.body || {};
      const university = await universityService.create(nome, pais);
      return response.status(201).json(university);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao criar universidade";
      return response.status(400).json({ message: msg });
    }
  }

  async updateUniversity(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const { nome, pais } = request.body || {};
      const updatedUniversity = await universityService.updateUniversity(
        id,
        nome,
        pais
      );
      return response.status(200).json(updatedUniversity);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar universidade";
      const status = msg.includes("não encontrada") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async deleteUniversity(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const deletedUniversity = await universityService.deleteUniversity(id);
      return response.status(200).json(deletedUniversity);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao deletar universidade";
      const status = msg.includes("não encontrada") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }
}
