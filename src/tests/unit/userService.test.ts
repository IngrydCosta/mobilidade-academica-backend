import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../services/userService';
import { prisma } from '../../database/prisma';
import { UserRole } from '@prisma/client';
import { emailService } from '../../services/emailService';

vi.mock('../../database/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('../../services/emailService', () => ({
  emailService: {
    sendWelcomeEmail: vi.fn().mockResolvedValue(true),
  },
}));

describe('UserService Unit Tests', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo usuário e gerar senha aleatória caso não seja fornecida', async () => {
      const mockCreatedUser = {
        id: 'user-1',
        nome: 'Maria Santos',
        email: 'maria@uporto.pt',
        perfil: UserRole.GESTOR_MOBILIDADE,
        universityId: 'uni-porto',
        university: { id: 'uni-porto', nome: 'U. Porto', pais: 'Portugal' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser as any);

      const result = await service.create(
        'Maria Santos',
        'maria@uporto.pt',
        undefined,
        UserRole.GESTOR_MOBILIDADE,
        'uni-porto'
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'maria@uporto.pt' } });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.nome).toBe('Maria Santos');
      expect(result.generatedPassword).toBeDefined();
      expect(result.generatedPassword.length).toBeGreaterThanOrEqual(8);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
    });

    it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'ex' } as any);

      await expect(
        service.create('Ana', 'existente@test.com', '123456', UserRole.ESTUDANTE)
      ).rejects.toThrow('Email já cadastrado.');
    });

    it('deve exigir universidade para perfil de GESTOR_MOBILIDADE', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        service.create('João', 'joao@test.com', '123456', UserRole.GESTOR_MOBILIDADE, '')
      ).rejects.toThrow('Para o perfil de Gestor de Mobilidade, a universidade é obrigatória.');
    });
  });

  describe('findAll', () => {
    it('deve listar todos os usuários', async () => {
      const mockUsers = [
        { id: '1', nome: 'User 1', email: 'u1@test.com', perfil: UserRole.ADMINISTRADOR },
      ];
      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserId', () => {
    it('deve buscar usuário por id', async () => {
      const mockUser = { id: 'u-1', nome: 'Ana', email: 'ana@test.com', perfil: UserRole.ESTUDANTE };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await service.getUserId('u-1');
      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro se o usuário não for encontrado', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      await expect(service.getUserId('u-invalid')).rejects.toThrow('Usuário não encontrado!');
    });
  });

  describe('updateUser', () => {
    it('deve atualizar o usuário com sucesso', async () => {
      const existingUser = { id: 'u-1', email: 'old@test.com' };
      const updatedUser = { id: 'u-1', nome: 'Ana Silva', email: 'new@test.com', perfil: UserRole.ADMINISTRADOR };

      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(existingUser as any)
        .mockResolvedValueOnce(null);

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any);

      const result = await service.updateUser('u-1', 'Ana Silva', 'new@test.com', '', UserRole.ADMINISTRADOR);

      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('deve excluir usuário existente', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u-1' } as any);
      vi.mocked(prisma.user.delete).mockResolvedValue({ id: 'u-1' } as any);

      const result = await service.deleteUser('u-1');
      expect(result).toEqual({ message: 'Usuário deletado com sucesso!' });
    });
  });
});
