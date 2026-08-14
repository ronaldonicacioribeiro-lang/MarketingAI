import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Helper de teste — sobe um MongoDB em memória e aponta MONGODB_URI para
 * ele, para que os testes nunca dependam do MongoDB Atlas real
 * (tasks/001_autenticacao.md, Definition of Done, item 3). Não faz parte
 * da estrutura de módulos da aplicação (Seção 14 da task), apenas da
 * infraestrutura de testes.
 */
let mongod: MongoMemoryServer | undefined;

export async function startInMemoryMongo(): Promise<void> {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.JWT_SECRET ??= 'test-secret-nao-usado-em-producao';
  process.env.JWT_EXPIRES_IN ??= '1d';
  process.env.CORS_ORIGIN ??= 'http://localhost:5173';
}

export async function stopInMemoryMongo(): Promise<void> {
  await mongod?.stop();
  mongod = undefined;
}
