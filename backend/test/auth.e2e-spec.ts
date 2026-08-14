import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { User, UserDocument } from '../src/modules/users/schemas/user.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from './utils/mongo-memory-server';

/** Forma mínima das respostas JSON usadas nas asserções abaixo. */
interface AuthResponseBody {
  accessToken?: string;
  message?: string;
  passwordHash?: string;
}

interface DecodedJwt {
  exp?: number;
  iat?: number;
}

/**
 * Cobre os Critérios de Aceitação testáveis via backend definidos em
 * tasks/001_autenticacao.md, Seção 15. Critérios de comportamento
 * exclusivamente de frontend (ProtectedRoute, persistência de sessão,
 * logout) não são cobertos aqui — não há infraestrutura de teste de
 * frontend nesta sprint, e criá-la não está no escopo desta task.
 */
describe('Autenticação (e2e) — tasks/001_autenticacao.md', () => {
  let app: INestApplication<App>;
  let userModel: Model<UserDocument>;

  const empresaName = 'Empresa de Teste';
  const adminData = {
    name: 'Admin Um',
    email: 'admin@marketingai.test',
    password: 'senha-forte-123',
    empresaName,
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

    userModel = moduleFixture.get(getModelToken(User.name));
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  describe('POST /auth/first-admin', () => {
    it('cria o primeiro administrador quando nenhum existe (Empresa + Usuário)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/first-admin')
        .send(adminData)
        .expect(201);

      expect(response.body).toMatchObject({
        name: adminData.name,
        email: adminData.email,
      });
      expect((response.body as AuthResponseBody).passwordHash).toBeUndefined();
    });

    it('nunca armazena a senha em texto puro — apenas o hash bcrypt', async () => {
      const user = await userModel
        .findOne({ email: adminData.email })
        .select('+passwordHash')
        .exec();

      expect(user).not.toBeNull();
      expect(user?.passwordHash).not.toBe(adminData.password);
      expect(user?.passwordHash.startsWith('$2')).toBe(true);
    });

    it('rejeita uma segunda tentativa de criar o primeiro administrador', async () => {
      await request(app.getHttpServer())
        .post('/auth/first-admin')
        .send({
          name: 'Outro Admin',
          email: 'outro@marketingai.test',
          password: 'outra-senha-123',
          empresaName: 'Outra Empresa',
        })
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    it('retorna um JWT para credenciais válidas', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminData.email, password: adminData.password })
        .expect(200);

      expect(typeof (response.body as AuthResponseBody).accessToken).toBe(
        'string',
      );
    });

    it('rejeita e-mail inexistente e senha incorreta com a MESMA mensagem', async () => {
      const wrongPassword = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminData.email, password: 'senha-errada' })
        .expect(401);

      const nonExistentEmail = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'ninguem@marketingai.test',
          password: 'qualquer-senha',
        })
        .expect(401);

      expect((wrongPassword.body as AuthResponseBody).message).toBe(
        (nonExistentEmail.body as AuthResponseBody).message,
      );
    });
  });

  describe('GET /users/me e proteção de rotas', () => {
    let accessToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminData.email, password: adminData.password });
      accessToken = (response.body as AuthResponseBody).accessToken ?? '';
    });

    it('rejeita requisição sem token', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('rejeita requisição com token inválido', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });

    it('rejeita requisição com token expirado', async () => {
      const jwtService = app.get(JwtService);
      const expiredToken = await jwtService.signAsync(
        { sub: 'algum-id', empresaId: 'alguma-empresa' },
        { expiresIn: '-1s' },
      );

      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('retorna nome, e-mail e Empresa do usuário autenticado — nunca passwordHash', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        name: adminData.name,
        email: adminData.email,
        empresa: { name: empresaName },
      });
      expect((response.body as AuthResponseBody).passwordHash).toBeUndefined();
    });

    it('o JWT emitido possui expiração configurável (claim exp presente)', () => {
      const rawDecoded: unknown = app.get(JwtService).decode(accessToken);
      const decoded = rawDecoded as DecodedJwt;
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp as number).toBeGreaterThan(decoded.iat as number);
    });
  });

  describe('Conexão com banco de dados', () => {
    it('a aplicação usa exclusivamente MONGODB_URI (sem string hardcoded)', () => {
      const configService = app.get(ConfigService);
      expect(configService.get<string>('mongodb.uri')).toBe(
        process.env.MONGODB_URI,
      );
    });
  });
});
