import { Response } from "express";
import { AuthRequest } from "../types/auth";
import { MobilityService } from "../services/mobilityService";
import { UserRole } from "@prisma/client";

const mobilityService = new MobilityService();

export class MobilityController {
  async getMobility(request: AuthRequest, response: Response) {
    try {
      const user = request.user;
      let universityFilter: string | undefined = undefined;

      if (user && user.perfil === UserRole.GESTOR_MOBILIDADE) {
        if (!user.universityId) {
          return response.status(403).json({
            message: "Gestor sem universidade vinculada",
          });
        }
        universityFilter = user.universityId;
      }

      const mobility = await mobilityService.findAll(universityFilter);
      return response.status(200).json(mobility);
    } catch (error) {
      return response.status(500).json({
        message: error instanceof Error ? error.message : "Erro ao buscar mobilidades",
      });
    }
  }

  async getMobilityById(request: AuthRequest, response: Response) {
    try {
      const { id } = request.params;
      const user = request.user;

      const mobility = await mobilityService.getMobilityId(id as string);

      if (user && user.perfil === UserRole.GESTOR_MOBILIDADE) {
        if (mobility.universityId !== user.universityId) {
          return response.status(403).json({
            message: "Acesso restrito à sua universidade",
          });
        }
      }

      return response.status(200).json(mobility);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao buscar mobilidade";
      const status = msg.includes("não encontrada") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async create(request: AuthRequest, response: Response) {
    try {
      const { ano, semestre, enviados, recebidos, universityId, estudantes } = request.body || {};
      const user = request.user;

      let targetUniversityId = universityId;

      if (user && user.perfil === UserRole.GESTOR_MOBILIDADE) {
        if (!user.universityId) {
          return response.status(403).json({
            message: "Gestor de mobilidade sem universidade vinculada.",
          });
        }
        targetUniversityId = user.universityId;
      }

      if (!targetUniversityId) {
        return response.status(400).json({
          message: "A universidade é obrigatória para o cadastro de mobilidade.",
        });
      }

      const mobility = await mobilityService.create({
        ano,
        semestre,
        enviados,
        recebidos,
        universityId: targetUniversityId,
        estudantes,
      });

      return response.status(201).json(mobility);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao criar mobilidade";
      const status = msg.includes("não encontrada") ? 404 : 400;
      return response.status(status).json({ message: msg });
    }
  }

  async updateMobility(request: AuthRequest, response: Response) {
    try {
      const id = request.params.id as string;
      const { ano, semestre, enviados, recebidos, universityId } = request.body || {};
      const user = request.user;

      const existingMobility = await mobilityService.getMobilityId(id);

      if (user && user.perfil === UserRole.GESTOR_MOBILIDADE) {
        if (existingMobility.universityId !== user.universityId) {
          return response.status(403).json({
            message: "Acesso restrito à sua universidade",
          });
        }
      }

      let targetUniversityId = universityId || existingMobility.universityId;
      if (user && user.perfil === UserRole.GESTOR_MOBILIDADE) {
        targetUniversityId = user.universityId!;
      }

      const updatedMobility = await mobilityService.updateMobility(
        id,
        ano,
        enviados,
        recebidos,
        targetUniversityId,
        semestre
      );

      return response.status(200).json(updatedMobility);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar mobilidade";
      const status = msg.includes("não encontrada") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async deleteMobility(request: AuthRequest, response: Response) {
    try {
      const id = request.params.id as string;
      const user = request.user;

      const existingMobility = await mobilityService.getMobilityId(id);

      if (user && user.perfil === UserRole.GESTOR_MOBILIDADE) {
        if (existingMobility.universityId !== user.universityId) {
          return response.status(403).json({
            message: "Acesso restrito à sua universidade",
          });
        }
      }

      const deletedMobility = await mobilityService.deleteMobility(id);
      return response.status(200).json(deletedMobility);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao deletar mobilidade";
      const status = msg.includes("não encontrada") ? 404 : 500;
      return response.status(status).json({ message: msg });
    }
  }

  async deleteStudent(request: AuthRequest, response: Response) {
    try {
      const { studentId } = request.params;
      const result = await mobilityService.deleteStudent(studentId as string);
      return response.status(200).json(result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao deletar estudante";
      return response.status(400).json({ message: msg });
    }
  }

  async updateStudent(request: AuthRequest, response: Response) {
    try {
      const { studentId } = request.params;
      const data = request.body || {};
      const updated = await mobilityService.updateStudent(studentId as string, data);
      return response.status(200).json(updated);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao atualizar estudante";
      return response.status(400).json({ message: msg });
    }
  }
}