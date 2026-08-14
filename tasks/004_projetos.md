# Sprint 004 — Projetos

**Produto:** MarketingAI
**Documento:** Especificação Técnica de Sprint
**Sprint:** 004 — Projetos
**Depende de:** Sprint 001 — Autenticação, Sprint 002 — Dashboard e Sprint 003 — Clientes (concluídas e validadas)
**Base documental:** `PROJECT.md`, `README.md`, `docs/00_PRODUCT_BLUEPRINT.md`, `docs/01_VISION.md`, `docs/02_PRD.md`, `docs/03_ARCHITECTURE.md`, `docs/04_AI_ORCHESTRATION.md`, `docs/05_DATABASE.md`, `docs/06_API.md`, `docs/07_ROADMAP.md`, `docs/08_RULES.md`, `docs/09_TECH_STACK.md`
**Status:** Especificação — aguardando implementação (nenhum código desta sprint foi escrito)

> Este documento é uma especificação técnica. Ele não contém código, não altera backend, frontend ou banco de dados, e não deve ser interpretado como autorização para início de implementação até revisão e aprovação explícita. Ele deve ser lido em sequência com `tasks/001_autenticacao.md`, `tasks/002_dashboard.md` e `tasks/003_clientes.md` — os quatro documentos formam uma progressão única, sem lacunas.

---

## 1. Objetivo

Especificar o módulo **Projetos** do MarketingAI: cadastro, consulta, atualização e encerramento das iniciativas de marketing conduzidas para um Cliente. Segundo `docs/03_ARCHITECTURE.md` (Seção 4), o módulo Projetos "organiza o trabalho de marketing em iniciativas concretas associadas a um cliente. Um projeto agrupa objetivos, prazos e os artefatos gerados nos demais módulos (landing pages, campanhas, relatórios) relacionados a essa iniciativa".

Esta sprint entrega o segundo elo da cadeia estrutural de dados definida em `docs/05_DATABASE.md` — **Empresa → Cliente → Projeto → Objetivo** —, tornando possível, pela primeira vez no sistema, declarar um objetivo de negócio real e rastreável, pré-requisito de tudo que a camada de Inteligência Artificial fará em sprints futuras (`docs/04_AI_ORCHESTRATION.md`: "nenhuma ação deve ser tomada sem relação clara com um Objetivo").

---

## 2. Contexto

`docs/07_ROADMAP.md` posiciona Projetos logo após Clientes na ordem de evolução do MVP: "Login → Dashboard → Clientes → **Projetos** → Templates → Landing Pages → (...)", descrevendo-o como o módulo "onde o objetivo de negócio é declarado e onde todo trabalho da IA passa a ser rastreável (...) Sem projetos, não existe unidade de trabalho coerente para organizar landing pages, campanhas e relatórios".

`docs/03_ARCHITECTURE.md` (Seção 5, Fluxo de Navegação) descreve o caminho exato que esta sprint implementa: "Dentro de um cliente, o usuário acessa ou cria um **Projeto**, definindo objetivo e escopo do trabalho. A partir do projeto, o usuário aciona os módulos de execução necessários: **Landing Pages** e/ou **Google Ads**." O mesmo documento (Seção 6, Fluxo de Trabalho do Sistema) resume o ciclo central do produto como: "Cliente → Projeto → Objetivo → Geração assistida por IA → Revisão humana → Aprovação → Execução/Publicação → Coleta de dados → Interpretação → Relatório". Esta sprint entrega exatamente os três primeiros elos desse ciclo — os demais (Landing Pages, Google Ads, Relatórios) pertencem a sprints futuras.

A Sprint 003 já entregou a entidade Cliente, seu CRUD completo, a delimitação por Empresa e o componente `ConfirmDialog` compartilhado para ações irreversíveis. Esta sprint reaproveita integralmente esse padrão para o encerramento de Projeto, e reaproveita o próprio Cliente como pré-requisito de contexto — nenhum Projeto existe fora de um Cliente já cadastrado.

---

## 3. Escopo

Fazem parte desta sprint, correspondendo às operações do domínio Projetos definidas em `docs/06_API.md` ("Criar projeto; definir ou atualizar objetivo; consultar projeto; consultar timeline do projeto; encerrar projeto"):

- **Cadastrar projeto** — sempre a partir de um Cliente já existente, com nome e Objetivo (obrigatório).
- **Consultar projetos de um Cliente** — lista de projetos do Cliente, exibida na própria tela de detalhe do Cliente (Sprint 003), substituindo o estado vazio estático por dado real.
- **Consultar projeto (detalhe)** — nome, Objetivo, Estado do Projeto, histórico mínimo, e áreas em estado vazio para o que ainda não existe (Landing Pages, Campanhas, Relatórios, Insights).
- **Atualizar projeto** — nome, Objetivo e Estado do Projeto (limitado aos estados não terminais — ver Seção 12).
- **Encerrar projeto** — ação de negócio distinta e irreversível, com confirmação explícita (reaproveitando `ConfirmDialog`), movendo o Estado do Projeto para "concluído".
- **Consultar timeline do projeto** — versão mínima do Histórico do Projeto (Seção 4), com o evento de criação e cada mudança de Estado.
- Entidades **Projeto** e **Histórico do Projeto** (Mongoose), delimitadas por propriedade de Empresa e de Cliente.

---

## 4. Fora do escopo

- **Landing Pages, Campanhas Google Ads, Analytics, Relatórios, Insights ou Biblioteca associados ao Projeto.** Nenhum desses módulos existe ainda (`docs/07_ROADMAP.md`); a tela de detalhe do projeto exibe apenas estados vazios explícitos para eles, nunca contagens ou dados fabricados.
- **Templates Inteligentes.** Pertencem à Sprint 005 (`docs/07_ROADMAP.md`); esta sprint não antecipa nenhuma tela ou schema relacionado.
- **Reconexão do cartão "Projetos em andamento" do Dashboard** (`tasks/002_dashboard.md`, Seção 7.3). Decisão consciente, pelo mesmo raciocínio já registrado em `tasks/003_clientes.md` (Seção 4): `docs/07_ROADMAP.md` descreve o objetivo desta sprint como entregar o módulo Projetos em si, não revisitar o Dashboard; fazer as duas coisas na mesma entrega contrariaria `docs/08_RULES.md` (Definition of Done, item 6 — "menor escopo necessário"). Fica registrado, assim como o cartão "Clientes ativos" já ficou na Sprint 003, como próximo passo pequeno e consciente, não incluído aqui.
- **Decisão sobre onde vivem Objetivo, Estado do Projeto e Histórico do Projeto** — registrada conscientemente, pois `docs/05_DATABASE.md` as descreve como entidades formalmente distintas de Projeto:
  - **Objetivo** entra nesta sprint como um **campo obrigatório do próprio Projeto** (`objective`), não como uma coleção própria. `docs/05_DATABASE.md` descreve a relação como "Projeto (...) possui um Objetivo" e `docs/06_API.md` reforça: "todo projeto (...) possui exatamente um objetivo ativo por vez" — uma relação 1:1 sempre presente, sem indicação documentada de versionamento ou histórico de objetivos anteriores. Modelar como coleção separada, sem necessidade comprovada, contrariaria a simplicidade deliberada de `docs/00_PRODUCT_BLUEPRINT.md`.
  - **Estado do Projeto** entra nesta sprint como um **campo do próprio Projeto** (`status`), pela mesma razão — é descrito em `docs/05_DATABASE.md` como algo que "pertence a um Projeto", sem ciclo de vida próprio independente.
  - **Histórico do Projeto** entra nesta sprint em **versão mínima**, como uma coleção própria (não embutida) — ver Nota de arquitetura na Seção 8 — registrando apenas dois tipos de evento: criação do projeto e mudança de Estado. `docs/05_DATABASE.md` descreve o Histórico como capaz de registrar também "aprovações, entregas, decisões", mas esses eventos são gerados por módulos que ainda não existem (Landing Pages, Campanhas, Relatórios); antecipá-los agora seria estado vazio permanente sem propósito, o mesmo raciocínio já usado em `tasks/002_dashboard.md` (Seção 7.3) para não criar o cartão de Insights.
- **Mudança de Objetivo ou nome não gera evento de Histórico** nesta versão mínima — apenas mudanças de Estado são registradas. Registrar toda alteração de campo exigiria um mecanismo de auditoria mais amplo, não solicitado nem documentado para esta sprint.
- **Reabertura de um projeto encerrado.** Assim como um Cliente arquivado não é reativado na Sprint 003, um Projeto que atinge o estado "concluído" não possui, nesta sprint, nenhuma operação para retornar a um estado anterior.
- **Mover um Projeto para outro Cliente.** Não há operação para isso; o vínculo com o Cliente é definido na criação e não é alterado depois.
- **Exclusão física (hard delete) de um Projeto.** Mesma decisão já tomada para Cliente (`tasks/003_clientes.md`, Seção 4) — preserva rastreabilidade (`docs/00_PRODUCT_BLUEPRINT.md`).
- **Máquina de estados formal para o Estado do Projeto** (regras de transição obrigatórias entre estados intermediários). `docs/05_DATABASE.md` lista os cinco estados possíveis apenas como exemplo ("planejamento, em execução, aguardando aprovação, concluído, pausado"), sem definir uma ordem ou grafo de transições obrigatório. Esta sprint permite transição livre entre os quatro estados não terminais, reservando apenas "concluído" como estado terminal alcançável por uma ação própria (Seção 12) — inventar regras de transição adicionais não documentadas seria decisão de produto não autorizada por esta especificação.
- **Qualquer módulo além de Clientes/Projetos** — Landing Pages, Google Ads, Analytics, Relatórios, Insights, Biblioteca, IA, Configurações.

---

## 5. Funcionalidades

1. **Cadastro de projeto** — nome e Objetivo (obrigatório), sempre associado a um Cliente já existente da própria Empresa.
2. **Listagem de projetos de um Cliente**, exibida na tela de detalhe do Cliente (Sprint 003), com estado vazio explícito quando não houver nenhum.
3. **Detalhe do projeto** — nome, Objetivo, Estado, histórico mínimo, e áreas em estado vazio para Landing Pages/Campanhas/Relatórios/Insights.
4. **Atualização do projeto** (nome, Objetivo e/ou Estado não terminal).
5. **Encerramento do projeto**, como ação de negócio distinta e irreversível, com confirmação explícita (reaproveitando `ConfirmDialog`), movendo o Estado para "concluído".
6. **Consulta à timeline do projeto** — evento de criação e cada mudança de Estado, em ordem cronológica.
7. **Delimitação por propriedade** — um projeto só é visível/editável por usuários da mesma Empresa do Cliente ao qual pertence.

---

## 6. Fluxo do usuário

1. Usuário autenticado acessa o detalhe de um Cliente (`/clients/:clientId`, Sprint 003).
2. Na seção "Projetos" dessa tela, vê a lista real de projetos daquele Cliente — ou, se vazia, o estado vazio explícito com uma ação para cadastrar o primeiro.
3. Usuário aciona "Novo projeto" → formulário (nome, Objetivo) → ao salvar, o projeto é criado com Estado inicial "planejamento" e o usuário é levado ao detalhe do novo projeto.
4. Usuário navega para `/projects/:id` (a partir da lista ou de um link direto) → vê nome, Objetivo, Estado atual, histórico e as seções em estado vazio dos módulos futuros.
5. Usuário pode:
   - Editar nome/Objetivo/Estado (dentre os não terminais) — ação "atualizar";
   - Acionar "Encerrar projeto" → confirmação explícita (`ConfirmDialog`) → projeto passa a "concluído", evento registrado no histórico, projeto passa a somente leitura para os campos editáveis.
6. Se a busca de dados falhar (lista ou detalhe): estado de erro explícito, com opção de tentar novamente — mesmo padrão de `EmptyState`/`LoadingState`/`ErrorState` já usado em Clientes e Dashboard.

---

## 7. Layout e estrutura da interface

Todas as telas usam a `AppShell` já existente. Nenhuma tela nova de "lista de projetos" isolada é criada — a lista vive dentro do detalhe do Cliente (Sprint 003), conforme `docs/03_ARCHITECTURE.md` (Seção 5): projetos só existem "dentro de um cliente".

### 7.1 Seção "Projetos" no detalhe do Cliente (`/clients/:clientId`, atualização da Sprint 003)

```
┌─────────────────────────────────────────────────────────────┐
│  Projetos                                    [ + Novo projeto]│
│  ┌───────────────────────────────────────────────────────┐   │
│  │ Nome do projeto              [Estado: em execução]  >  │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Nome do projeto              [Estado: planejamento]  > │   │
│  └───────────────────────────────────────────────────────┘   │
│  (estado vazio: "Nenhum projeto ainda." + [+ Novo projeto])  │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Cadastro / edição de projeto (`/clients/:clientId/projects/new`, `/projects/:id/edit`)

```
┌───────────────────────────────────────┐
│         Novo projeto / Editar          │
│                                         │
│   Nome:      [____________________]    │
│   Objetivo:  [____________________]    │
│              [____________________]    │
│   Estado:    [ planejamento      ▾]    │
│              (não exibe "concluído")   │
│         [ Salvar ]   [ Cancelar ]      │
└───────────────────────────────────────┘
```

### 7.3 Detalhe do projeto (`/projects/:id`)

```
┌─────────────────────────────────────────────────────────────┐
│  Nome do projeto                    [Editar] [Encerrar]       │
│  Objetivo: ..................................................│
│  Estado: em execução                                          │
│                                                                 │
│  Histórico                                                     │
│  • Projeto criado — 12/08/2026                                 │
│  • Estado alterado: planejamento → em execução — 13/08/2026    │
│                                                                 │
│  Landing Pages   — "Nenhuma landing page ainda" (estado vazio) │
│  Campanhas Google Ads — "Nenhuma campanha ainda" (estado vazio)│
│  Relatórios      — "Nenhum relatório ainda" (estado vazio)     │
│  Insights        — "Nenhum insight ainda" (estado vazio)       │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Confirmação de encerramento

Reaproveita `ConfirmDialog` (`tasks/003_clientes.md`, Seção 8) — descreve a irreversibilidade e exige confirmação explícita antes de encerrar, nenhuma ação de um único clique.

---

## 8. Estrutura de dados / entidades envolvidas

### Projeto

`docs/05_DATABASE.md`:
> "Finalidade: Representar uma iniciativa concreta de marketing com objetivo definido. Responsabilidade: Agrupar tudo o que é produzido em nome de um Objetivo específico de um Cliente (...) Relação com outras entidades: Pertence a um Cliente; possui um Objetivo; possui Estado do Projeto (...)."

Campos conceituais necessários nesta sprint:
- `_id`
- `empresaId` — referência à Empresa, denormalizada diretamente no Projeto (mesmo padrão de defesa em profundidade já usado em Cliente, `tasks/003_clientes.md`, Seção 9/13) — nunca aceito do corpo da requisição, sempre resolvido a partir do usuário autenticado.
- `clientId` — referência ao Cliente (nome do campo segue o nome real da classe `Client` no código, `tasks/003_clientes.md`, Seção 14 — mesmo raciocínio já aplicado a `empresaId`/`Empresa`).
- `name` — nome do projeto, obrigatório.
- `objective` — o Objetivo do projeto (texto livre), obrigatório — ver Nota de arquitetura abaixo.
- `status` — um dos cinco valores descritos em `docs/05_DATABASE.md` ("planejamento, em execução, aguardando aprovação, concluído, pausado"); inicia sempre em `planejamento`.
- `createdAt`, `updatedAt`.

> **Nota de arquitetura — Objetivo e Estado do Projeto como campos, não coleções.** Ver justificativa completa na Seção 4. Resumo: `docs/05_DATABASE.md` descreve as duas entidades como relação 1:1 permanente com o Projeto, sem ciclo de vida próprio documentado — modelar como campos evita uma junção (`join`) desnecessária para uma relação que nunca muda de cardinalidade, mantendo a simplicidade deliberada de `docs/00_PRODUCT_BLUEPRINT.md`. Se, em sprint futura, o produto precisar de histórico de versões do Objetivo ou de um fluxo de aprovação específico por Estado, essa mudança deve ser refletida conscientemente em `docs/05_DATABASE.md` primeiro, conforme `docs/08_RULES.md`.

### Histórico do Projeto (versão mínima)

`docs/05_DATABASE.md`:
> "Finalidade: Representar a linha do tempo de eventos relevantes ocorridos dentro de um Projeto. Responsabilidade: Preservar, em ordem cronológica, tudo que mudou o estado ou o rumo do projeto — mudanças de Estado do Projeto, aprovações, entregas, decisões."

Campos conceituais necessários nesta sprint:
- `_id`
- `projectId` — referência ao Projeto.
- `empresaId` — denormalizado, mesmo padrão de escopo.
- `type` — nesta versão mínima, apenas dois valores possíveis: `criado` ou `estado_alterado` (ver Seção 4 — nenhum outro tipo de evento é gerado ainda, pois depende de módulos que não existem).
- `fromStatus` — estado anterior (nulo no evento `criado`).
- `toStatus` — estado resultante.
- `occurredAt`.

> **Nota de arquitetura — Histórico do Projeto como coleção própria (não embutida no Projeto).** `docs/09_TECH_STACK.md` já antecipa essa decisão explicitamente: "Log IA e Histórico do Projeto, por natureza de append-only e alto volume, são bons candidatos a coleções otimizadas para escrita sequencial". Por isso, mesmo em sua versão mínima, o Histórico do Projeto vive em coleção própria (`project_history`), não como um array embutido no documento do Projeto — evitando uma migração futura quando o volume de eventos crescer com Landing Pages, Campanhas e Relatórios.
>
> **Nota de arquitetura — onde vivem os schemas.** Nem "Projeto" nem "Histórico do Projeto" ganham módulos backend próprios além de `projects/` — ambos os schemas vivem em `backend/src/modules/projects/schemas/`, já que Histórico do Projeto não é um módulo funcional listado em `docs/03_ARCHITECTURE.md` (Seção 3), assim como Empresa vive dentro de `modules/users/` (`tasks/001_autenticacao.md`, Seção 9).

---

## 9. Regras de API / endpoints do domínio Projetos

Conforme `docs/06_API.md` (domínio Projetos: "Criar projeto; definir ou atualizar objetivo; consultar projeto; consultar timeline do projeto; encerrar projeto"):

| Operação | Domínio (`docs/06_API.md`) | Rota | Regra |
|---|---|---|---|
| Cadastrar projeto | Projetos | `POST /clients/:clientId/projects` | Cliente precisa existir e pertencer à Empresa autenticada (reaproveita `ClientsService`, Seção 10); Objetivo obrigatório; `status` inicial sempre `planejamento` |
| Consultar projetos do Cliente | Projetos | `GET /clients/:clientId/projects` | Lista projetos do Cliente informado, escopados à Empresa |
| Consultar projeto (detalhe) | Projetos | `GET /projects/:id` | 404 se não pertencer à Empresa autenticada |
| Atualizar objetivo/nome/estado | Projetos | `PATCH /projects/:id` | Aceita `name`, `objective`, `status`; `status` só aceita os quatro valores não terminais — `concluido` é rejeitado aqui (ver linha abaixo); rejeitado se o projeto já estiver `concluido` |
| Consultar timeline do projeto | Projetos | `GET /projects/:id/history` | Retorna os eventos do Histórico do Projeto em ordem cronológica |
| Encerrar projeto | Projetos | `POST /projects/:id/close` | Ação distinta, separada do `PATCH` (`docs/06_API.md`, Aprovação Humana: "sempre distinta e posterior à operação que produziu o artefato"); muda `status` para `concluido`, registra evento no Histórico, rejeitado se já estiver `concluido` |

Todas as rotas exigem JWT válido (guard da Sprint 001) — nenhuma rota de Projetos é pública.

---

## 10. Consulta/integração necessária com Cliente já existente

- Toda criação de Projeto depende de um `clientId` válido, resolvido a partir da própria URL (`/clients/:clientId/projects`) — nunca de um Cliente inexistente ou de outra Empresa.
- O backend reaproveita `ClientsService.findOneScoped(clientId, empresaId)` (já existente, `tasks/003_clientes.md`, Seção 8) para validar essa condição antes de criar o Projeto — nenhuma lógica de verificação de Cliente é duplicada.
- No frontend, a tela de cadastro de projeto é sempre alcançada a partir da tela de detalhe de um Cliente já carregado — o `clientId` nunca é digitado manualmente pelo usuário.
- O `empresaId` do Projeto é copiado do `empresaId` do Cliente (nunca do usuário diretamente, embora sejam sempre o mesmo neste MVP single-tenant) — reforçando a garantia de que um Projeto nunca aponta para uma combinação inconsistente de Cliente/Empresa.

---

## 11. Segurança e autenticação

- Todas as rotas de `/clients/:clientId/projects` e `/projects/:id` exigem JWT válido, reaproveitando o guard já implementado na Sprint 001 — nenhum novo mecanismo de autenticação é criado.
- **Autorização delimitada por propriedade** (`docs/06_API.md`, Segurança), herdada em duas camadas: o Cliente precisa pertencer à Empresa autenticada (verificado na criação) e o próprio Projeto guarda seu `empresaId` (verificado em toda consulta/atualização/encerramento) — a mesma defesa em profundidade já validada em Clientes.
- Nenhuma informação de projeto de outra Empresa é revelada, mesmo indiretamente (`GET /projects/:id` de um projeto de outra Empresa retorna 404, nunca 403 com detalhes).
- Encerramento exige o mesmo nível de proteção de qualquer outra operação (JWT + propriedade) mais a confirmação explícita de interface (Seção 7.4) — nenhum atalho técnico contorna essa exigência.

---

## 12. Regras de negócio

- **Objetivo é obrigatório na criação do projeto** — `docs/05_DATABASE.md`/`docs/04_AI_ORCHESTRATION.md`: "nenhuma ação deve ser tomada sem relação clara com um Objetivo". Não é possível criar um projeto sem Objetivo preenchido.
- **Todo projeto pertence a um Cliente**, que pertence a uma Empresa — nunca criado "solto".
- **Estado inicial é sempre `planejamento`** — não é possível criar um projeto já `concluido` ou em qualquer outro estado.
- **Transição livre entre os quatro estados não terminais** (`planejamento`, `em_execucao`, `aguardando_aprovacao`, `pausado`) via `PATCH /projects/:id` — nenhuma ordem obrigatória entre eles é imposta (Seção 4).
- **`concluido` só é alcançado via `POST /projects/:id/close`**, nunca via `PATCH` genérico — reflete a exigência de `docs/06_API.md` de que uma ação irreversível seja "sempre distinta e posterior à operação que produziu o artefato".
- **Um projeto `concluido` não aceita mais `PATCH` nem um novo `close`** — passa a ser somente leitura para esses campos (Seção 4: sem operação de reabertura nesta sprint).
- **Toda mudança de Estado gera um evento no Histórico do Projeto**, incluindo a criação do projeto (evento inicial) e o encerramento.
- **Nenhuma exclusão física de Projeto** — encerrar é mudança de estado, nunca remoção do documento.

---

## 13. Regras de negócio (continuação — Histórico do Projeto)

- O Histórico do Projeto é **somente leitura** pela interface — nenhuma operação de API cria, edita ou apaga um evento diretamente; eventos só existem como efeito colateral de "criar projeto" e "atualizar estado"/"encerrar".
- A ordem de exibição é sempre cronológica (mais antigo primeiro), conforme `docs/05_DATABASE.md`: "preservar, em ordem cronológica".
- Nenhum evento de Histórico referencia Landing Pages, Campanhas ou Relatórios nesta sprint — esses tipos de evento só passam a existir quando os módulos correspondentes forem implementados (Seção 4).

---

## 14. Estrutura de arquivos esperada

```
backend/src/modules/projects/
├── projects.module.ts
├── projects.controller.ts
├── projects.service.ts
├── schemas/
│   ├── project.schema.ts
│   └── project-history.schema.ts   # ver Nota de arquitetura, Seção 8
└── dto/
    ├── create-project.dto.ts
    └── update-project.dto.ts
```

```
frontend/src/features/projects/
├── pages/
│   ├── ProjectFormPage.tsx      # cadastro e edição, mesmo componente
│   └── ProjectDetailPage.tsx
├── components/
│   └── ClientProjectsSection.tsx  # seção "Projetos" embutida no detalhe do Cliente
└── api/
    └── projectsApi.ts
```

Arquivos existentes que esta sprint precisa alterar (nenhum reescrito do zero): `backend/src/app.module.ts` (importar `ProjectsModule`); `frontend/src/App.tsx` (rotas `/clients/:clientId/projects/new`, `/projects/:id`, `/projects/:id/edit`); `frontend/src/features/clients/pages/ClientDetailPage.tsx` (a seção "Projetos", hoje um `EmptyState` estático da Sprint 003, passa a renderizar `<ClientProjectsSection clientId={...} />`).

---

## 15. Critérios de aceitação

- [ ] Um projeto só pode ser criado a partir de um Cliente já existente e pertencente à Empresa do usuário autenticado.
- [ ] Um projeto não pode ser criado sem Objetivo preenchido.
- [ ] Um projeto criado inicia sempre com Estado `planejamento`.
- [ ] A seção "Projetos" do detalhe do Cliente exibe os projetos reais daquele Cliente, ou estado vazio explícito quando não houver nenhum.
- [ ] O detalhe do projeto exibe nome, Objetivo e Estado reais — nunca fabricados.
- [ ] O detalhe do projeto exibe estados vazios explícitos para Landing Pages, Campanhas, Relatórios e Insights — nunca contagens fabricadas.
- [ ] Nome, Objetivo e Estado (entre os não terminais) de um projeto existente podem ser atualizados via `PATCH`.
- [ ] `PATCH /projects/:id` rejeita uma tentativa de definir `status` como `concluido` diretamente.
- [ ] Encerrar um projeto exige confirmação explícita antes de ser executado — nenhuma ação de um único clique encerra um projeto.
- [ ] Um projeto encerrado (`concluido`) não aceita mais atualização de nome/Objetivo/Estado nem um novo encerramento.
- [ ] A timeline do projeto (`GET /projects/:id/history`) retorna, em ordem cronológica, ao menos o evento de criação e cada mudança de Estado realizada.
- [ ] Um usuário não consegue consultar, editar ou encerrar um projeto que pertença a outra Empresa (mesmo que outro registro de Empresa exista no banco).
- [ ] Todas as rotas de Projetos exigem JWT válido — sem exceção.
- [ ] Nenhum dado de Landing Page, Campanha, Relatório ou Insight é mockado, hardcoded ou simulado em qualquer camada (frontend ou backend).

---

## 16. Definition of Done

Conforme `docs/08_RULES.md` (Definition of Done), esta sprint só é considerada concluída quando, simultaneamente:

1. Funciona conforme o objetivo descrito em `docs/03_ARCHITECTURE.md` (módulo Projetos) e `docs/07_ROADMAP.md` (item "Projetos" do MVP).
2. Respeita a arquitetura vigente sem exceções não documentadas — inclusive as decisões registradas nas Seções 4 e 8 sobre Objetivo/Estado como campos e Histórico do Projeto como coleção própria dentro de `modules/projects/`.
3. Foi validada por revisão de código e pelos testes aplicáveis (criação com Objetivo obrigatório, transições de estado, encerramento como ação distinta e irreversível, isolamento entre Empresas, timeline em ordem cronológica).
4. Não introduz regressão em nada que as Sprints 001, 002 e 003 já entregavam (login, sessão, Dashboard, CRUD de Clientes, `ConfirmDialog`).
5. Está documentada — este próprio documento é a referência; qualquer desvio de implementação em relação a ele deve ser refletido aqui como atualização consciente.
6. Foi entregue com o menor escopo necessário — sem Templates, sem reconexão do Dashboard, sem máquina de estados formal, sem reabertura de projeto.

---

## 17. Dependências

- Sprint 001 — Autenticação, concluída e validada (JWT, `ProtectedRoute`, guard de rotas, usuário autenticado disponível nos controllers).
- Sprint 002 — Dashboard, concluída e validada (`AppShell`, `EmptyState`, `LoadingState`, `ErrorState`).
- Sprint 003 — Clientes, concluída e validada (entidade Cliente, `ClientsService.findOneScoped`, `ConfirmDialog`, `ClientDetailPage` como ponto de integração).
- **Sem dependência** de Templates, Landing Pages, Google Ads, Analytics, Relatórios, Insights, Biblioteca ou IA — todos tratados como não implementados, com estado vazio correspondente.

---

## 18. Resultado esperado

Ao final da Sprint 004, todo Cliente pode ter Projetos reais: uma seção de listagem embutida em seu detalhe, um formulário de cadastro/edição com Objetivo obrigatório, uma tela de detalhe com Estado, histórico mínimo e honesto, e um fluxo de encerramento seguro, com confirmação explícita e sem exclusão física de dado.

Esse resultado desbloqueia diretamente a Sprint 005 — Templates, que segundo `docs/07_ROADMAP.md` depende de Projetos já existirem para que landing pages geradas a partir de templates tenham a que se associar. Fica registrado, como próximo passo consciente e de escopo pequeno — não incluído nesta sprint (Seção 4) —, conectar o cartão "Projetos em andamento" do Dashboard (`tasks/002_dashboard.md`) à operação de consulta que esta sprint já disponibiliza, completando a evolução aditiva que aquele documento já previa.
