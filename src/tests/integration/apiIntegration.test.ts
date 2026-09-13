import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../App';
import { prisma } from '../../database/prisma';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

vi.mock('../../database/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    university: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    mobility: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    mobilityStudent: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Backend HTTP API Integration Tests (Controllers & Middlewares)', () => {
  const secret = process.env.JWT_SECRET || 'mobilidade-secret-key';
  const adminToken = jwt.sign(
    { id: 'admin-1', email: 'admin@system.eu', perfil: UserRole.ADMINISTRADOR },
    secret,
    { expiresIn: '1h' }
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /university', () => {
    it('deve listar universidades públicas/autenticadas', async () => {
      const mockUniversities = [
        { id: 'uni-1', nome: 'Universidade de Lisboa', pais: 'Portugal' },
        { id: 'uni-2', nome: 'Universidade do Porto', pais: 'Portugal' },
      ];
      vi.mocked(prisma.university.findMany).mockResolvedValue(mockUniversities as any);

      const response = await request(app)
        .get('/university')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUniversities);
    });
  });

  describe('POST /university', () => {
    it('deve cadastrar uma universidade quando autenticado como ADMIN', async () => {
      const newUni = { id: 'uni-3', nome: 'Universidade de Coimbra', pais: 'Portugal' };
      vi.mocked(prisma.university.create).mockResolvedValue(newUni as any);

      const response = await request(app)
        .post('/university')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: 'Universidade de Coimbra', pais: 'Portugal' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUni);
    });

    it('deve retornar erro 400 se faltar o nome ou país', async () => {
      const response = await request(app)
        .post('/university')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /university/:id', () => {
    it('deve proibir a exclusão de universidade retornando erro', async () => {
      const response = await request(app)
        .delete('/university/uni-1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('não é permitida');
    });
  });

  describe('GET /user', () => {
    it('deve listar usuários do sistema para ADMINISTRADOR', async () => {
      const mockUsers = [
        { id: 'u-1', nome: 'Maria', email: 'maria@uporto.pt', perfil: UserRole.GESTOR_MOBILIDADE },
      ];
      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);

      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('Autenticação e Rota Protegida sem Token', () => {
    it('deve retornar 401 Unauthorized ao acessar rota protegida sem header Authorization', async () => {
      const response = await request(app).get('/user');
      expect(response.status).toBe(401);
    });
  });
});
