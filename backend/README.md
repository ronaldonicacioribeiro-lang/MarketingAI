# MarketingAI — Backend

API do MarketingAI. Ver documentação completa do produto em [`../docs`](../docs), especialmente [`../docs/03_ARCHITECTURE.md`](../docs/03_ARCHITECTURE.md) (módulos), [`../docs/06_API.md`](../docs/06_API.md) (domínios de API) e [`../docs/09_TECH_STACK.md`](../docs/09_TECH_STACK.md) (stack).

## Stack

NestJS + TypeScript + Mongoose (MongoDB Atlas).

## Scripts

| Script | Descrição |
|---|---|
| `npm run start:dev` | Inicia em modo desenvolvimento, com watch. |
| `npm run start` | Inicia sem watch. |
| `npm run build` | Compila para `dist/`. |
| `npm run start:prod` | Roda o build compilado (`node dist/main`). |
| `npm run lint` | Roda o ESLint com `--fix`. |
| `npm run format` | Formata `src/` e `test/` com Prettier. |
| `npm test` | Testes unitários (Jest). |
| `npm run test:e2e` | Testes end-to-end. |

## Configuração

Copie `.env.example` para `.env` e preencha `MONGODB_URI` com a connection string do MongoDB Atlas quando disponível.

## Banco de dados (MongoDB)

O `DatabaseModule` (`src/database/database.module.ts`) já está pronto com a conexão Mongoose via `@nestjs/config`, mas **não está importado em `app.module.ts`** nesta Sprint 0 — sem uma `MONGODB_URI` real, tentar conectar quebraria a inicialização limpa da aplicação. Para ativar a partir da Sprint 1: preencha `MONGODB_URI` no `.env` e importe `DatabaseModule` em `app.module.ts`.

## Estrutura

```
src/
├── config/       → configuração de ambiente (ConfigModule)
├── database/     → módulo de conexão Mongoose (pronto, não conectado ainda)
├── modules/      → um diretório por módulo funcional (ver docs/03_ARCHITECTURE.md)
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

Alias de import configurado: `@/*` aponta para `src/*` (funciona tanto em `start:dev` quanto no build compilado, via `tsconfig-paths` registrado em `main.ts`).

Esta Sprint (Sprint 0) preparou apenas a fundação técnica — nenhuma funcionalidade de negócio foi implementada ainda.
