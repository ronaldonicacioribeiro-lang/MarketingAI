# MarketingAI

**Plataforma SaaS de automação de marketing digital baseada em Inteligência Artificial.**

Este arquivo é a porta de entrada do projeto. Ele não define produto nem arquitetura — apenas orienta qualquer pessoa (fundador, novo colaborador, desenvolvedor) sobre onde encontrar cada informação e em que ordem lê-la.

---

## O que é o MarketingAI

O MarketingAI ajuda consultores, agências, times de marketing internos e pequenas empresas a planejar, executar, medir e otimizar operações de marketing digital com apoio de Inteligência Artificial — reduzindo o trabalho manual e repetitivo que hoje consome a maior parte do tempo desses profissionais.

## Objetivo do Projeto

Construir, de forma deliberada e bem documentada, uma plataforma que comece como ferramenta validada com early adopters e evolua para um produto SaaS multi-cliente completo — sem nunca perder de vista o problema real que resolve nem a qualidade profissional exigida em cada etapa.

---

## Documento Oficial do Produto

📌 O documento que governa **todas** as decisões deste projeto é:

### [`docs/00_PRODUCT_BLUEPRINT.md`](docs/00_PRODUCT_BLUEPRINT.md)

Esse documento é a **Constituição do MarketingAI**. Ele define missão, visão, propósito, valores, princípios inquebráveis e o critério oficial de como toda decisão de produto deve ser tomada.

**Nenhuma decisão de produto, prioridade, funcionalidade ou mudança de escopo pode contrariar o que está escrito no Product Blueprint.** Em caso de dúvida ou conflito entre qualquer outro documento, código ou conversa sobre o projeto, o Product Blueprint prevalece.

Todo novo colaborador deve ler o Product Blueprint antes de qualquer outra coisa.

---

## Como a Documentação Está Organizada

A documentação vive na pasta `docs/` e segue uma hierarquia numerada, do mais fundamental ao mais operacional. Documentos de número menor têm prioridade sobre os de número maior em caso de conflito.

| Documento | Finalidade | Status |
|---|---|---|
| [`docs/00_PRODUCT_BLUEPRINT.md`](docs/00_PRODUCT_BLUEPRINT.md) | Constituição do produto: missão, visão, valores, princípios inquebráveis e critério de decisão. Documento soberano do projeto. | ✅ Concluído |
| [`docs/01_VISION.md`](docs/01_VISION.md) | Visão detalhada do produto: problema, público-alvo, proposta de valor, diferenciais e objetivos de curto e longo prazo. | ✅ Concluído |
| [`docs/02_PRD.md`](docs/02_PRD.md) | Requisitos de produto (PRD): personas, jornada do usuário, funcionalidades do MVP priorizadas, requisitos funcionais e não funcionais, riscos e métricas. | ✅ Concluído |
| [`docs/03_ARCHITECTURE.md`](docs/03_ARCHITECTURE.md) | Arquitetura funcional da plataforma: módulos, fluxos e responsabilidades. | ✅ Concluído |
| [`docs/04_AI_ORCHESTRATION.md`](docs/04_AI_ORCHESTRATION.md) | Constituição da IA: StrategyAgent orquestrador, agentes especialistas, fluxos de orquestração e aprovação humana. | ✅ Concluído |
| [`docs/05_DATABASE.md`](docs/05_DATABASE.md) | Modelagem conceitual de dados (MongoDB): entidades de domínio, relacionamentos, timeline, memória da IA e auditoria. | ✅ Concluído |
| [`docs/06_API.md`](docs/06_API.md) | Arquitetura funcional das APIs: domínios, fluxos de negócio, aprovação humana e eventos. | ✅ Concluído |
| [`docs/07_ROADMAP.md`](docs/07_ROADMAP.md) | Evolução estratégica do produto: MVP, versões 1.1, 2.0, 3.0, critérios de evolução e fora de escopo. | ✅ Concluído |
| [`docs/08_RULES.md`](docs/08_RULES.md) | Constituição de desenvolvimento: organização, convenções, qualidade, testes, segurança e uso de IA no desenvolvimento. | ✅ Concluído |
| [`docs/09_TECH_STACK.md`](docs/09_TECH_STACK.md) | Stack técnica oficial: React/Vite/TS/Tailwind (frontend), NestJS/TS/Mongoose (backend), MongoDB Atlas (banco de dados), Git. | ✅ Concluído |

**Ordem de leitura recomendada para novos colaboradores:** `00` → `01` → `02` → `03` → `04` → `05` → `06` → `07` → `08` → `09`.

---

## Estrutura Geral das Pastas

```
MarketingAI/
├── docs/        → Documentação oficial do projeto (ver tabela acima)
├── agents/      → Reservado para os agentes de IA do sistema (definição em 04_AI_ORCHESTRATION.md)
├── services/    → Reservado para os serviços internos da plataforma
├── config/      → Configurações do projeto
├── prompts/     → Prompts utilizados pela camada de Inteligência Artificial
├── data/        → Dados do projeto
├── storage/     → Armazenamento persistente da aplicação
├── reports/     → Relatórios gerados pela plataforma
├── tests/       → Testes automatizados
├── utils/       → Utilitários compartilhados
└── logs/        → Logs de execução
```

Esta é uma visão geral de navegação, não uma definição de arquitetura. O detalhamento técnico de cada pasta será formalizado em `docs/03_ARCHITECTURE.md`.

---

## Para Novos Colaboradores

1. Leia `docs/00_PRODUCT_BLUEPRINT.md` — entenda por que o MarketingAI existe antes de entender o que ele faz.
2. Leia `docs/01_VISION.md` e `docs/02_PRD.md` — entenda o problema, o público e o escopo do MVP.
3. Consulte a tabela de documentação acima para qualquer dúvida específica de arquitetura, dados, API, roadmap ou regras de desenvolvimento.
4. Em caso de qualquer dúvida sobre uma decisão de produto, a resposta está no Product Blueprint. Se não estiver, a decisão deve ser levantada para revisão consciente antes de prosseguir.

---

## Regra Fundamental

Toda decisão tomada neste projeto — de produto, de prioridade ou de escopo — deve estar alinhada ao `docs/00_PRODUCT_BLUEPRINT.md`. Este arquivo (`PROJECT.md`) é apenas o mapa; o Product Blueprint é a bússola.
