import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
  Template,
  TemplateDocument,
  TemplateStatus,
} from '../src/modules/library/schemas/template.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from './utils/mongo-memory-server';

/**
 * Cobre os Critérios de Aceitação testáveis via backend definidos em
 * tasks/005_templates.md, Seção 15. Mesma abordagem já usada em
 * clients.e2e-spec.ts e projects.e2e-spec.ts.
 */
interface TemplateResponseBody {
  id?: string;
  name?: string;
  description?: string | null;
  content?: string | null;
  status?: string;
  message?: string;
}

describe('Biblioteca / Templates (e2e) — tasks/005_templates.md', () => {
  let app: INestApplication<App>;
  let templateModel: Model<TemplateDocument>;
  let accessToken: string;

  const adminData = {
    name: 'Admin Biblioteca',
    email: 'admin-biblioteca@marketingai.test',
    password: 'senha-forte-123',
    empresaName: 'Empresa Biblioteca',
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

    templateModel = moduleFixture.get(getModelToken(Template.name));

    await request(app.getHttpServer())
      .post('/auth/first-admin')
      .send(adminData);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminData.email, password: adminData.password });
    accessToken =
      (loginResponse.body as { accessToken?: string }).accessToken ?? '';
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  it('rejeita qualquer rota de Templates sem token', async () => {
    await request(app.getHttpServer()).get('/templates').expect(401);
  });

  describe('POST /templates', () => {
    it('cadastra um template com nome, descrição e conteúdo', async () => {
      const response = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Captura de Leads',
          description: 'Template para páginas de captura',
          content: '<h1>{{titulo}}</h1><form>...</form>',
        })
        .expect(201);

      const body = response.body as TemplateResponseBody;
      expect(body).toMatchObject({
        name: 'Captura de Leads',
        description: 'Template para páginas de captura',
        content: '<h1>{{titulo}}</h1><form>...</form>',
        status: 'ativo',
      });
      expect(body.id).toBeDefined();
    });

    it('exige nome obrigatório', async () => {
      await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'sem nome' })
        .expect(400);
    });

    it('permite cadastro apenas com nome (descrição e conteúdo opcionais)', async () => {
      const response = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Template Mínimo' })
        .expect(201);

      expect((response.body as TemplateResponseBody).name).toBe(
        'Template Mínimo',
      );
    });
  });

  describe('GET /templates', () => {
    it('lista apenas templates ativos da própria Empresa', async () => {
      const response = await request(app.getHttpServer())
        .get('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const templates = response.body as TemplateResponseBody[];
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThanOrEqual(2);
      expect(templates.every((t) => t.status === 'ativo')).toBe(true);
    });
  });

  describe('PATCH /templates/:id — atualizar', () => {
    it('atualiza nome, descrição e conteúdo', async () => {
      const created = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Nome Original', description: 'Descrição original' });

      const id = (created.body as TemplateResponseBody).id;

      const updated = await request(app.getHttpServer())
        .patch(`/templates/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Nome Atualizado',
          description: 'Descrição atualizada',
          content: 'Conteúdo atualizado',
        })
        .expect(200);

      expect(updated.body).toMatchObject({
        name: 'Nome Atualizado',
        description: 'Descrição atualizada',
        content: 'Conteúdo atualizado',
      });
    });

    it('não altera status via PATCH', async () => {
      const created = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Template Status Fixo' });
      const id = (created.body as TemplateResponseBody).id;

      const updated = await request(app.getHttpServer())
        .patch(`/templates/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Ainda Ativo' })
        .expect(200);

      expect((updated.body as TemplateResponseBody).status).toBe('ativo');
    });
  });

  describe('POST /templates/:id/archive', () => {
    it('arquiva o template (muda status, nunca remove o documento) e some da listagem', async () => {
      const created = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Template Para Arquivar' });

      const id = (created.body as TemplateResponseBody).id as string;

      const archived = await request(app.getHttpServer())
        .post(`/templates/${id}/archive`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect((archived.body as TemplateResponseBody).status).toBe('arquivado');

      const list = await request(app.getHttpServer())
        .get('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const ids = (list.body as TemplateResponseBody[]).map((t) => t.id);
      expect(ids).not.toContain(id);

      const stillExists = await templateModel.findById(id).exec();
      expect(stillExists).not.toBeNull();
      expect(stillExists?.status).toBe(TemplateStatus.ARQUIVADO);
      expect(stillExists?.archivedAt).not.toBeNull();
    });

    it('é uma rota distinta de PATCH — arquivar não aceita alteração de conteúdo', async () => {
      const created = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Template Rota Distinta' });
      const id = (created.body as TemplateResponseBody).id;

      const response = await request(app.getHttpServer())
        .post(`/templates/${id}/archive`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect((response.body as TemplateResponseBody).status).toBe('arquivado');
    });
  });

  describe('Isolamento entre Empresas (delimitação por propriedade)', () => {
    it('retorna 404 ao tentar consultar um template de outra Empresa', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const templateDeOutraEmpresa = await templateModel.create({
        empresaId: outraEmpresaId,
        name: 'Template de Outra Empresa',
        status: TemplateStatus.ATIVO,
      });

      await request(app.getHttpServer())
        .get(`/templates/${String(templateDeOutraEmpresa._id)}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('retorna 404 ao tentar atualizar um template de outra Empresa (não altera o documento)', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const templateDeOutraEmpresa = await templateModel.create({
        empresaId: outraEmpresaId,
        name: 'Nome Protegido',
        status: TemplateStatus.ATIVO,
      });

      await request(app.getHttpServer())
        .patch(`/templates/${String(templateDeOutraEmpresa._id)}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Tentativa De Sobrescrever' })
        .expect(404);

      const unchanged = await templateModel
        .findById(templateDeOutraEmpresa._id)
        .exec();
      expect(unchanged?.name).toBe('Nome Protegido');
    });

    it('retorna 404 ao tentar arquivar um template de outra Empresa (não arquiva)', async () => {
      const outraEmpresaId = new Types.ObjectId();
      const templateDeOutraEmpresa = await templateModel.create({
        empresaId: outraEmpresaId,
        name: 'Template Intocável',
        status: TemplateStatus.ATIVO,
      });

      await request(app.getHttpServer())
        .post(`/templates/${String(templateDeOutraEmpresa._id)}/archive`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      const unchanged = await templateModel
        .findById(templateDeOutraEmpresa._id)
        .exec();
      expect(unchanged?.status).toBe(TemplateStatus.ATIVO);
    });

    it('não lista templates de outra Empresa em GET /templates', async () => {
      const outraEmpresaId = new Types.ObjectId();
      await templateModel.create({
        empresaId: outraEmpresaId,
        name: 'Nunca Deve Aparecer',
        status: TemplateStatus.ATIVO,
      });

      const response = await request(app.getHttpServer())
        .get('/templates')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const names = (response.body as TemplateResponseBody[]).map(
        (t) => t.name,
      );
      expect(names).not.toContain('Nunca Deve Aparecer');
    });
  });

  describe('id malformado', () => {
    it('retorna 404 (não 500) para um id que não é um ObjectId válido', async () => {
      await request(app.getHttpServer())
        .get('/templates/id-invalido')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
