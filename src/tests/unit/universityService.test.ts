import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UniversityService } from '../../services/universityService';
import { prisma } from '../../database/prisma';

vi.mock('../../database/prisma', () => ({
  prisma: {
    university: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('UniversityService Unit Tests', () => {
  let service: UniversityService;

  beforeEach(() => {
    service = new UniversityService();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma nova universidade com sucesso', async () => {
      const mockUniversity = {
        id: 'uni-1',
        nome: 'Universidade de Lisboa',
        pais: 'Portugal',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.university.create).mockResolvedValue(mockUniversity as any);

      const result = await service.create('Universidade de Lisboa', 'Portugal');

      expect(prisma.university.create).toHaveBeenCalledWith({
        data: {
          nome: 'Universidade de Lisboa',
          pais: 'Portugal',
        },
      });
      expect(result).toEqual(mockUniversity);
    });

    it('deve lançar erro se o nome ou o país não forem fornecidos', async () => {
      await expect(service.create('', 'Portugal')).rejects.toThrow('Nome e país são obrigatórios.');
      await expect(service.create('Universidade de Porto', '')).rejects.toThrow('Nome e país são obrigatórios.');
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as universidades cadastradas', async () => {
      const mockList = [
        { id: 'uni-1', nome: 'U. Lisboa', pais: 'Portugal' },
        { id: 'uni-2', nome: 'U. Porto', pais: 'Portugal' },
      ];

      vi.mocked(prisma.university.findMany).mockResolvedValue(mockList as any);

      const result = await service.findAll();

      expect(prisma.university.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });
  });

  describe('findById', () => {
    it('deve retornar uma universidade pelo ID', async () => {
      const mockUni = { id: 'uni-1', nome: 'U. Lisboa', pais: 'Portugal' };
      vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUni as any);

      const result = await service.findById('uni-1');

      expect(prisma.university.findUnique).toHaveBeenCalledWith({
        where: { id: 'uni-1' },
      });
      expect(result).toEqual(mockUni);
    });

    it('deve lançar erro se a universidade não for encontrada', async () => {
      vi.mocked(prisma.university.findUnique).mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow('Universidade não encontrada');
    });
  });

  describe('updateUniversity', () => {
    it('deve atualizar os dados de uma universidade existente', async () => {
      const mockUni = { id: 'uni-1', nome: 'U. Lisboa', pais: 'Portugal' };
      const updatedUni = { id: 'uni-1', nome: 'Universidade Nova de Lisboa', pais: 'Portugal' };

      vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUni as any);
      vi.mocked(prisma.university.update).mockResolvedValue(updatedUni as any);

      const result = await service.updateUniversity('uni-1', 'Universidade Nova de Lisboa', 'Portugal');

      expect(prisma.university.update).toHaveBeenCalledWith({
        where: { id: 'uni-1' },
        data: {
          nome: 'Universidade Nova de Lisboa',
          pais: 'Portugal',
        },
      });
      expect(result).toEqual(updatedUni);
    });

    it('deve lançar erro ao tentar atualizar universidade inexistente', async () => {
      vi.mocked(prisma.university.findUnique).mockResolvedValue(null);

      await expect(service.updateUniversity('non-existent', 'Novo Nome', 'Portugal')).rejects.toThrow('Universidade não encontrada');
    });
  });

  describe('deleteUniversity', () => {
    it('deve bloquear a exclusão de universidade para preservar o histórico', async () => {
      await expect(service.deleteUniversity('uni-1')).rejects.toThrow(
        'A exclusão de universidades não é permitida para preservar o histórico de dados do sistema.'
      );
    });
  });
});
