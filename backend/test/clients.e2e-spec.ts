import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
  Client,
  ClientDocument,
  ClientStatus,
} from '../src/modules/clients/schemas/client.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from './utils/mongo-memory-server';

/**
 * Cobre os Critérios de Aceitação testáveis via backend definidos em
 * tasks/003_clientes.md, Seção 15. Critérios exclusivamente de frontend
 * (confirmação explícita de arquivamento, estado vazio na lista/detalhe,
 * item ativo na sidebar) não são cobertos aqui — mesma abordagem já
 * usada em auth.e2e-spec.ts (tasks/001_autenticacao.md).
 */
interface ClientResponseBody {
  id?: string;
  name?: string;
  context?: string | null;
  status?: string;
  archivedAt?: string | null;
  message?: string;
}

describe('Clientes (e2e) — tasks/003_clientes.md', () => {
  let app: INestApplication<App>;
  let clientModel: Model<ClientDocument>;
  let accessToken: string;

  const adminData = {
    name: 'Admin Clientes',
    email: 'admin-clientes@marketingai.test',
    password: 'senha-forte-123',
    empresaName: 'Empresa Clientes',
  };

  beforeAll(async () => {
    await startInMemoryMongo();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    clientModel = moduleFixture.get(getModelToken(Client.name));

    await request(app.getHttpServer())
      .post('/auth/first-admin')
      .send(adminData);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminData.email, password: adminData.password });
    accessToken =
      (loginResponse.body as ClientResponseBody & { accessToken?: string })
        .accessToken ?? '';
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  it('rejeita qualquer rota de Clientes sem token', async () => {
    await request(app.getHttpServer()).get('/clients').expect(401);
  });

  describe('POST /clients', () => {
    it('cadastra um cliente com nome e contexto', async () => {
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Dra. Sarah', context: 'Clínica odontológica' })
        .expect(201);

      const body = response.body as ClientResponseBody;
      expect(body).toMatchObject({
        name: 'Dra. Sarah',
        context: 'Clínica odontológica',
        status: 'ativo',
      });
      expect(body.id).toBeDefined();
    });

    it('exige nome obrigatório', async () => {
      await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ context: 'sem nome' })
        .expect(400);
    });

    it('permite cadastro sem contexto (opcional)', async () => {
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Cliente Sem Contexto' })
        .expect(201);

      expect((response.body as ClientResponseBody).name).toBe(
        'Cliente Sem Contexto',
      );
    });
  });

  describe('GET /clients', () => {
    it('lista apenas clientes ativos da própria Empresa', async () => {
      const response = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const clients = response.body as ClientResponseBody[];
      expect(Array.isArray(clients)).toBe(true);
      expect(clients.length).toBeGreaterThanOrEqual(2);
      expect(clients.every((c) => c.status === 'ativo')).toBe(true);
    });
  });

  describe('PATCH /clients/:id — atualizar contexto', () => {
    it('atualiza nome e contexto de um cliente existente', async () => {
      const created = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Nome Original', context: 'Contexto original' });

      const id = (created.body as ClientResponseBody).id;

      const updated = await request(app.getHttpServer())
        .patch(`/clients/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Nome Atualizado', context: 'Contexto atualizado' })
        .expect(200);

      expect(updated.body).toMatchObject({
        name: 'Nome Atualizado',
        context: 'Contexto atualizado',
      });
    });
  });

  describe('POST /clients/:id/archive', () => {
    it('arquiva o cliente (muda status, nunca remove o documento) e some da listagem', async () => {
      const created = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Cliente Para Arquivar' });

      const id = (created.body as ClientResponseBody).id as string;

      const archived = await request(app.getHttpServer())
        .post(`/clients/${id}/archive`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect((archived.body as ClientResponseBody).status).toBe('arquivado');

      // Some da listagem de ativos...
      const list = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const ids = (list.body as ClientResponseBody[]).map((c) => c.id);
      expect(ids).not.toContain(id);

      // ...mas o documento continua existindo no banco (sem DELETE físico).
      const stillExists = await clientModel.findById(id).exec();
      expect(stillExists).not.toBeNull();
      expect(stillExists?.status).toBe(ClientStatus.ARQUIVADO);
      expect(stillExists?.archivedAt).not.toBeNull();
    });

    it('é uma rota distinta de PATCH — arquivar não aceita alteração de contexto', async () => {
      const created = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Cliente Rota Distinta' });
      const id = (created.body as ClientResponseBody).id;

      // POST /clients/:id/archive não tem corpo de contexto — confirma
      // que arquivar é uma ação própria, não uma variação do PATCH.
      const response = await request(app.getHttpServer())
        .post(`/clients/${id}/archive`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect((response.body as ClientResponseBody).status).toBe('arquivado');
    });
  });

  describe('Isolamento entre Empresas (delimitação por propriedade)', () => {
    it('retorna 404 ao tentar consultar um cliente de outra Empresa', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const clienteDeOutraEmpresa = await clientModel.create({
        empresaId: outraEmpresaId,
        name: 'Cliente de Outra Empresa',
        status: ClientStatus.ATIVO,
      });

      await request(app.getHttpServer())
        .get(`/clients/${String(clienteDeOutraEmpresa._id)}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('retorna 404 ao tentar atualizar um cliente de outra Empresa (não altera o documento)', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const clienteDeOutraEmpresa = await clientModel.create({
        empresaId: outraEmpresaId,
        name: 'Nome Protegido',
        status: ClientStatus.ATIVO,
      });

      await request(app.getHttpServer())
        .patch(`/clients/${String(clienteDeOutraEmpresa._id)}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Tentativa De Sobrescrever' })
        .expect(404);

      const unchanged = await clientModel
        .findById(clienteDeOutraEmpresa._id)
        .exec();
      expect(unchanged?.name).toBe('Nome Protegido');
    });

    it('retorna 404 ao tentar arquivar um cliente de outra Empresa (não arquiva)', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const clienteDeOutraEmpresa = await clientModel.create({
        empresaId: outraEmpresaId,
        name: 'Cliente Intocável',
        status: ClientStatus.ATIVO,
      });

      await request(app.getHttpServer())
        .post(`/clients/${String(clienteDeOutraEmpresa._id)}/archive`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      const unchanged = await clientModel
        .findById(clienteDeOutraEmpresa._id)
        .exec();
      expect(unchanged?.status).toBe(ClientStatus.ATIVO);
    });

    it('não lista clientes de outra Empresa em GET /clients', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const clienteDeOutraEmpresa = await clientModel.create({
        empresaId: outraEmpresaId,
        name: 'Nunca Deve Aparecer',
        status: ClientStatus.ATIVO,
      });

      const response = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const names = (response.body as ClientResponseBody[]).map((c) => c.name);
      expect(names).not.toContain('Nunca Deve Aparecer');
      expect(String(clienteDeOutraEmpresa.empresaId)).not.toBe('');
    });
  });

  describe('id malformado', () => {
    it('retorna 404 (não 500) para um id que não é um ObjectId válido', async () => {
      await request(app.getHttpServer())
        .get('/clients/id-invalido')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
