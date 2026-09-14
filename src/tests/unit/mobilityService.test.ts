import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MobilityService } from '../../services/mobilityService';
import { prisma } from '../../database/prisma';

vi.mock('../../database/prisma', () => ({
  prisma: {
    university: {
      findUnique: vi.fn(),
    },
    mobility: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    mobilityStudent: {
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      createMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('MobilityService Unit Tests', () => {
  let service: MobilityService;

  beforeEach(() => {
    service = new MobilityService();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('deve cadastrar um lote de mobilidade com estudantes', async () => {
      const mockUniv = { id: 'uni-1', nome: 'U. Porto', pais: 'Portugal' };
      const mockCreatedMobility = {
        id: 'mob-1',
        ano: 2026,
        semestre: 1,
        enviados: 5,
        recebidos: 3,
        universityId: 'uni-1',
        students: [
          { matricula: '1001', nome: 'Estudante 1', email: 'e1@uporto.pt' },
        ],
      };

      vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniv as any);
      vi.mocked(prisma.mobility.create).mockResolvedValue(mockCreatedMobility as any);

      const result = await service.create({
        ano: 2026,
        semestre: 1,
        enviados: 5,
        recebidos: 3,
        universityId: 'uni-1',
        estudantes: [
          {
            matricula: '1001',
            nome: 'Estudante 1',
            email: 'e1@uporto.pt',
            paisOrigem: 'Brasil',
            paisDestino: 'Portugal',
            tipoMobilidade: 'ENVIADO',
            cursoOrigem: 'Engenharia',
            cursoDestino: 'Informatica',
            universidadeOrigem: 'USP',
            universidadeDestino: 'U. Porto',
          },
        ],
      });

      expect(prisma.university.findUnique).toHaveBeenCalledWith({ where: { id: 'uni-1' } });
      expect(prisma.mobility.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedMobility);
    });

    it('deve lançar erro se a universidade informada não existir', async () => {
      vi.mocked(prisma.university.findUnique).mockResolvedValue(null);

      await expect(
        service.create({
          ano: 2026,
          enviados: 1,
          recebidos: 1,
          universityId: 'invalid-uni',
          estudantes: [],
        })
      ).rejects.toThrow('Universidade não encontrada');
    });
  });

  describe('findAll', () => {
    it('deve buscar todas as mobilidades sem filtro', async () => {
      const mockList = [{ id: 'm1', ano: 2026, enviados: 2, recebidos: 1 }];
      vi.mocked(prisma.mobility.findMany).mockResolvedValue(mockList as any);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.mobility.findMany).toHaveBeenCalledWith({
        where: {},
        include: { university: true, students: true },
        orderBy: [{ ano: 'desc' }, { semestre: 'desc' }],
      });
    });

    it('deve filtrar mobilidades por universidadeId quando fornecido', async () => {
      const mockList = [{ id: 'm1', universityId: 'uni-porto' }];
      vi.mocked(prisma.mobility.findMany).mockResolvedValue(mockList as any);

      const result = await service.findAll('uni-porto');
      expect(result).toEqual(mockList);
      expect(prisma.mobility.findMany).toHaveBeenCalledWith({
        where: { universityId: 'uni-porto' },
        include: { university: true, students: true },
        orderBy: [{ ano: 'desc' }, { semestre: 'desc' }],
      });
    });
  });

  describe('deleteStudent', () => {
    it('deve remover um estudante individual de um lote de mobilidade', async () => {
      vi.mocked(prisma.mobilityStudent.findUnique).mockResolvedValue({ id: 'st-1' } as any);
      vi.mocked(prisma.mobilityStudent.delete).mockResolvedValue({ id: 'st-1' } as any);

      const result = await service.deleteStudent('st-1');
      expect(result).toEqual({ message: 'Estudante removido com sucesso!' });
      expect(prisma.mobilityStudent.delete).toHaveBeenCalledWith({ where: { id: 'st-1' } });
    });
  });
});
