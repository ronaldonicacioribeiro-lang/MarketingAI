# MarketingAI — Frontend

Aplicação frontend do MarketingAI. Ver documentação completa do produto em [`../docs`](../docs), especialmente [`../docs/03_ARCHITECTURE.md`](../docs/03_ARCHITECTURE.md) (módulos) e [`../docs/09_TECH_STACK.md`](../docs/09_TECH_STACK.md) (stack).

## Stack

React + Vite + TypeScript + Tailwind CSS.

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Type-check (`tsc -b`) e build de produção. |
| `npm run preview` | Serve o build de produção localmente. |
| `npm run lint` | Roda o ESLint. |
| `npm run format` | Formata o código com Prettier. |

## Configuração

Copie `.env.example` para `.env` e ajuste os valores conforme necessário.

## Estrutura

```
src/
├── features/     → um diretório por módulo funcional (ver docs/03_ARCHITECTURE.md)
├── components/   → componentes de UI compartilhados
├── hooks/        → hooks compartilhados
├── lib/          → utilitários e cliente HTTP compartilhados
└── types/        → tipos TypeScript compartilhados
```

Alias de import configurado: `@/*` aponta para `src/*`.

Esta Sprint (Sprint 0) preparou apenas a fundação técnica — nenhuma funcionalidade de negócio foi implementada ainda.
