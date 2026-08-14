import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from './utils/mongo-memory-server';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // AppModule agora importa DatabaseModule (Sprint 001) — precisa de
    // MONGODB_URI para subir, mesmo para testar a rota raiz. Ver
    // tasks/001_autenticacao.md, Definition of Done, item 3: testes não
    // devem depender do MongoDB Atlas real.
    await startInMemoryMongo();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await stopInMemoryMongo();
  });
});
