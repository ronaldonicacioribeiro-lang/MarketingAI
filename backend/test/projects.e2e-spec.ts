import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
  Project,
  ProjectDocument,
  ProjectStatus,
} from '../src/modules/projects/schemas/project.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from './utils/mongo-memory-server';

/**
 * Cobre os Critérios de Aceitação testáveis via backend definidos em
 * tasks/004_projetos.md, Seção 15. Mesma abordagem já usada em
 * auth.e2e-spec.ts e clients.e2e-spec.ts.
 */
interface ProjectResponseBody {
  id?: string;
  clientId?: string;
  name?: string;
  objective?: string;
  status?: string;
  message?: string;
}

interface HistoryEventBody {
  type?: string;
  fromStatus?: string | null;
  toStatus?: string;
  occurredAt?: string;
}

interface ClientResponseBody {
  id?: string;
}

describe('Projetos (e2e) — tasks/004_projetos.md', () => {
  let app: INestApplication<App>;
  let projectModel: Model<ProjectDocument>;
  let accessToken: string;
  let clientId: string;

  const adminData = {
    name: 'Admin Projetos',
    email: 'admin-projetos@marketingai.test',
    password: 'senha-forte-123',
    empresaName: 'Empresa Projetos',
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

    projectModel = moduleFixture.get(getModelToken(Project.name));

    await request(app.getHttpServer())
      .post('/auth/first-admin')
      .send(adminData);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminData.email, password: adminData.password });
    accessToken =
      (loginResponse.body as { accessToken?: string }).accessToken ?? '';

    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Dra. Sarah', context: 'Clínica odontológica' });
    clientId = (clientResponse.body as ClientResponseBody).id ?? '';
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  it('rejeita qualquer rota de Projetos sem token', async () => {
    await request(app.getHttpServer())
      .get(`/clients/${clientId}/projects`)
      .expect(401);
  });

  describe('POST /clients/:clientId/projects', () => {
    it('cadastra um projeto com nome e objetivo, iniciando em "planejamento"', async () => {
      const response = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Lançamento Q1',
          objective: 'Gerar 50 leads qualificados',
        })
        .expect(201);

      const body = response.body as ProjectResponseBody;
      expect(body).toMatchObject({
        name: 'Lançamento Q1',
        objective: 'Gerar 50 leads qualificados',
        status: 'planejamento',
        clientId,
      });
    });

    it('rejeita cadastro sem objetivo', async () => {
      await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Sem Objetivo' })
        .expect(400);
    });

    it('rejeita cadastro sob um Cliente inexistente', async () => {
      const fakeClientId = new Types.ObjectId().toString();
      await request(app.getHttpServer())
        .post(`/clients/${fakeClientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Órfão', objective: 'Objetivo qualquer' })
        .expect(404);
    });

    it('registra o evento de criação no Histórico', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Com Historico', objective: 'Objetivo X' });
      const id = (created.body as ProjectResponseBody).id;

      const history = await request(app.getHttpServer())
        .get(`/projects/${id}/history`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const events = history.body as HistoryEventBody[];
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'criado',
        fromStatus: null,
        toStatus: 'planejamento',
      });
    });
  });

  describe('GET /clients/:clientId/projects', () => {
    it('lista todos os projetos do cliente, em qualquer Estado', async () => {
      const response = await request(app.getHttpServer())
        .get(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const projects = response.body as ProjectResponseBody[];
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('PATCH /projects/:id — transições de Estado não terminais', () => {
    it('permite transição livre entre planejamento/em_execucao/aguardando_aprovacao/pausado, sem ordem obrigatória', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Transições', objective: 'Objetivo Y' });
      const id = (created.body as ProjectResponseBody).id;

      // planejamento -> pausado (pula "em_execucao" de propósito: sem máquina de estados)
      await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'pausado' })
        .expect(200);

      // pausado -> aguardando_aprovacao
      const second = await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'aguardando_aprovacao' })
        .expect(200);
      expect((second.body as ProjectResponseBody).status).toBe(
        'aguardando_aprovacao',
      );

      // aguardando_aprovacao -> em_execucao (volta "para trás" livremente)
      await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'em_execucao' })
        .expect(200);

      const history = await request(app.getHttpServer())
        .get(`/projects/${id}/history`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const events = history.body as HistoryEventBody[];
      // criado + 3 mudanças de estado
      expect(events).toHaveLength(4);
      expect(events.map((e) => e.type)).toEqual([
        'criado',
        'estado_alterado',
        'estado_alterado',
        'estado_alterado',
      ]);
    });

    it('atualiza nome e objetivo', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Nome Original', objective: 'Objetivo Original' });
      const id = (created.body as ProjectResponseBody).id;

      const updated = await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Nome Atualizado', objective: 'Objetivo Atualizado' })
        .expect(200);

      expect(updated.body).toMatchObject({
        name: 'Nome Atualizado',
        objective: 'Objetivo Atualizado',
      });
    });

    it('REJEITA status "concluido" via PATCH', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Anti-Atalho', objective: 'Objetivo Z' });
      const id = (created.body as ProjectResponseBody).id;

      await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'concluido' })
        .expect(400);

      const stillOpen = await projectModel.findById(id).exec();
      expect(stillOpen?.status).not.toBe(ProjectStatus.CONCLUIDO);
    });
  });

  describe('POST /projects/:id/close — encerramento', () => {
    it('encerra o projeto (status -> concluido) e registra o evento no Histórico', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Para Encerrar', objective: 'Objetivo Final' });
      const id = (created.body as ProjectResponseBody).id as string;

      const closed = await request(app.getHttpServer())
        .post(`/projects/${id}/close`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect((closed.body as ProjectResponseBody).status).toBe('concluido');

      const historyResponse = await request(app.getHttpServer())
        .get(`/projects/${id}/history`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const events = historyResponse.body as HistoryEventBody[];
      const lastEvent = events[events.length - 1];
      expect(lastEvent).toMatchObject({
        type: 'estado_alterado',
        toStatus: 'concluido',
      });
    });

    it('rejeita um segundo encerramento do mesmo projeto', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Encerrado Duas Vezes', objective: 'Objetivo' });
      const id = (created.body as ProjectResponseBody).id as string;

      await request(app.getHttpServer())
        .post(`/projects/${id}/close`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .post(`/projects/${id}/close`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(409);
    });

    it('rejeita qualquer PATCH após o encerramento', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Somente Leitura', objective: 'Objetivo' });
      const id = (created.body as ProjectResponseBody).id as string;

      await request(app.getHttpServer())
        .post(`/projects/${id}/close`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Tentativa De Editar' })
        .expect(409);

      const unchanged = await projectModel.findById(id).exec();
      expect(unchanged?.name).toBe('Projeto Somente Leitura');
    });

    it('não faz DELETE físico — o documento continua existindo após encerrar', async () => {
      const created = await request(app.getHttpServer())
        .post(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Projeto Rastreavel', objective: 'Objetivo' });
      const id = (created.body as ProjectResponseBody).id as string;

      await request(app.getHttpServer())
        .post(`/projects/${id}/close`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const stillExists = await projectModel.findById(id).exec();
      expect(stillExists).not.toBeNull();
      expect(stillExists?.status).toBe(ProjectStatus.CONCLUIDO);
    });
  });

  describe('Isolamento entre Empresas', () => {
    it('retorna 404 ao consultar, atualizar ou encerrar um projeto de outra Empresa', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const outroClienteId = new Types.ObjectId();
      const projetoDeOutraEmpresa = await projectModel.create({
        empresaId: outraEmpresaId,
        clientId: outroClienteId,
        name: 'Projeto De Outra Empresa',
        objective: 'Objetivo Alheio',
        status: ProjectStatus.PLANEJAMENTO,
      });
      const foreignId = String(projetoDeOutraEmpresa._id);

      await request(app.getHttpServer())
        .get(`/projects/${foreignId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      await request(app.getHttpServer())
        .patch(`/projects/${foreignId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Tentativa De Sobrescrever' })
        .expect(404);

      await request(app.getHttpServer())
        .post(`/projects/${foreignId}/close`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      const unchanged = await projectModel.findById(foreignId).exec();
      expect(unchanged?.name).toBe('Projeto De Outra Empresa');
      expect(unchanged?.status).toBe(ProjectStatus.PLANEJAMENTO);
    });

    it('não lista projetos de outra Empresa em GET /clients/:clientId/projects, mesmo usando o mesmo clientId', async () => {
      const outraEmpresaId = new Types.ObjectId();
      await projectModel.create({
        empresaId: outraEmpresaId,
        clientId: new Types.ObjectId(clientId),
        name: 'Nunca Deve Aparecer',
        objective: 'Objetivo',
        status: ProjectStatus.PLANEJAMENTO,
      });

      const response = await request(app.getHttpServer())
        .get(`/clients/${clientId}/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const names = (response.body as ProjectResponseBody[]).map((p) => p.name);
      expect(names).not.toContain('Nunca Deve Aparecer');
    });
  });

  describe('id malformado', () => {
    it('retorna 404 (não 500) para um id de projeto que não é um ObjectId válido', async () => {
      await request(app.getHttpServer())
        .get('/projects/id-invalido')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('retorna 404 (não 500) para um clientId que não é um ObjectId válido', async () => {
      await request(app.getHttpServer())
        .get('/clients/id-invalido/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
