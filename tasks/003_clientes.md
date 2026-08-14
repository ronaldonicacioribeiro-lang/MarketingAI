# Sprint 003 — Clientes

**Produto:** MarketingAI
**Documento:** Especificação Técnica de Sprint
**Sprint:** 003 — Clientes
**Depende de:** Sprint 001 — Autenticação (concluída e validada) e Sprint 002 — Dashboard (concluída e validada)
**Base documental:** `PROJECT.md`, `README.md`, `docs/00_PRODUCT_BLUEPRINT.md`, `docs/01_VISION.md`, `docs/02_PRD.md`, `docs/03_ARCHITECTURE.md`, `docs/05_DATABASE.md`, `docs/06_API.md`, `docs/07_ROADMAP.md`, `docs/08_RULES.md`, `docs/09_TECH_STACK.md`
**Status:** Especificação — aguardando implementação (nenhum código desta sprint foi escrito)

> Este documento é uma especificação técnica. Ele não contém código, não altera backend, frontend ou banco de dados, e não deve ser interpretado como autorização para início de implementação até revisão e aprovação explícita. Ele deve ser lido em sequência com `tasks/001_autenticacao.md` e `tasks/002_dashboard.md` — os três documentos formam uma progressão única, sem lacunas.

---

## 1. Objetivo

Especificar o módulo **Clientes** do MarketingAI: cadastro, consulta, atualização de contexto e arquivamento dos clientes atendidos pela Empresa. Segundo `docs/03_ARCHITECTURE.md` (Seção 4), o módulo Clientes é "responsável pelo cadastro e manutenção das informações essenciais de cada cliente atendido pela empresa: dados de contexto, histórico e objetivos de marketing associados. É a base de contexto usada pelos demais módulos".

Esta sprint transforma o item "Clientes" da sidebar — hoje desabilitado, conforme `tasks/002_dashboard.md` (Seção 7.2) — no primeiro módulo de produção efetivamente navegável do MVP, reaproveitando integralmente a `AppShell` e os componentes de estado já entregues na Sprint 002, sem recriá-los.

---

## 2. Contexto

`docs/07_ROADMAP.md` posiciona Clientes logo após Login e Dashboard na ordem de evolução do MVP, descrevendo-o como "a base de contexto de todo o sistema (...) Nenhuma outra funcionalidade — projeto, campanha, relatório — tem sentido sem um cliente ao qual pertença". `docs/05_DATABASE.md` reforça essa centralidade ao descrever a cadeia estrutural do domínio de dados como **Empresa → Cliente → Projeto → Objetivo**, "que fornece o contexto sob o qual toda produção do sistema (...) é gerada".

`docs/03_ARCHITECTURE.md` (Seção 5, Fluxo de Navegação) descreve o caminho do usuário como: "A partir do Dashboard, o usuário navega para **Clientes** para selecionar ou cadastrar um cliente. Dentro de um cliente, o usuário acessa ou cria um **Projeto** (...)". Esta sprint entrega exatamente o primeiro trecho desse fluxo — o segundo (Projetos) é objeto de uma sprint futura (Sprint 004), que depende de já existir pelo menos um Cliente cadastrado.

A Sprint 001 já entregou autenticação, JWT e as entidades `User`/`Empresa`. A Sprint 002 já entregou a `AppShell` (Sidebar + Topbar), a rota protegida `/dashboard` e os componentes reutilizáveis `SummaryCard`, `EmptyState`, `LoadingState` e `ErrorState`. Esta sprint reaproveita essa base integralmente — nenhum desses componentes é recriado, apenas consumidos ou estendidos onde justificado (Seção 8).

---

## 3. Escopo

Fazem parte desta sprint, correspondendo exatamente às operações do domínio Clientes definidas em `docs/06_API.md` ("Cadastrar cliente; atualizar contexto do cliente; consultar cliente; arquivar cliente"):

- **Cadastrar cliente** — formulário de criação de um novo Cliente, associado automaticamente à Empresa do usuário autenticado.
- **Consultar clientes** — lista de clientes ativos da Empresa, com estado vazio explícito quando não houver nenhum.
- **Consultar cliente (detalhe)** — tela de detalhe de um Cliente específico, incluindo áreas em estado vazio para o que ainda não existe (Projetos, Landing Pages, Campanhas, Relatórios, Insights).
- **Atualizar contexto do cliente** — edição do nome e do contexto de um Cliente já cadastrado.
- **Arquivar cliente** — ação de negócio distinta e irreversível, com confirmação explícita do usuário.
- **Ativação do item "Clientes" na sidebar** (`tasks/002_dashboard.md`, Seção 7.2), passando de desabilitado para navegável, sem alterar a posição, o rótulo ou qualquer outro item da lista.
- Entidade **Cliente** (Mongoose), delimitada por propriedade de Empresa.

---

## 4. Fora do escopo

- **CRUD de Projetos, Landing Pages, Campanhas Google Ads, Relatórios ou Insights associados ao Cliente.** Nenhum desses módulos existe ainda (`docs/07_ROADMAP.md`); a tela de detalhe do Cliente exibe apenas estados vazios explícitos para eles (Seção 7.3), nunca contagens ou dados fabricados.
- **Atualização do cartão "Clientes ativos" no Dashboard para consumir dado real.** Decisão consciente, não omissão: `docs/07_ROADMAP.md` descreve o objetivo desta sprint estritamente como entregar a "base de contexto do sistema" — não há, em nenhum documento, uma exigência de que a sprint que implementa um módulo também deva voltar a alterar a tela de outro módulo já entregue (o Dashboard, da Sprint 002). Reabrir `tasks/002_dashboard.md`/o código do Dashboard dentro desta sprint ampliaria seu escopo para dois módulos simultaneamente, contrariando `docs/08_RULES.md` (Definition of Done, item 6 — "menor escopo necessário") e o princípio de simplicidade deliberada de `docs/00_PRODUCT_BLUEPRINT.md`. `tasks/002_dashboard.md` (Seção 10) já previu esse momento: "Quando os módulos Clientes, Projetos, Relatórios e Insights forem implementados em sprints futuras, cada um deve expor sua própria operação de consulta (...) e o Dashboard passa a consumi-las de forma incremental e aditiva". Esta sprint entrega essa operação de consulta (Seção 9); **conectar** o cartão do Dashboard a ela fica registrado como o próximo passo natural e de escopo pequeno, a ser executado conscientemente como sua própria tarefa (Seção 18), não silenciosamente dentro desta.
- **Reabertura/edição de um cliente arquivado.** Um cliente arquivado permanece consultável (rastreabilidade), mas nenhuma operação de "reativar" é especificada nesta sprint — não há exigência documentada para isso no MVP.
- **Exclusão física (hard delete) de um Cliente.** `docs/06_API.md` trata "arquivar" e "excluir" como equivalentes em efeito (irreversibilidade), mas exclusão física contrariaria a rastreabilidade exigida por `docs/00_PRODUCT_BLUEPRINT.md` e `docs/05_DATABASE.md` (Auditoria); esta sprint implementa apenas o arquivamento (mudança de estado, nunca remoção do registro — ver Seção 12).
- **Fluxo formal de aprovação humana via IA/Timeline/Insights** para o arquivamento — esses módulos não existem ainda. Ver Seção 12 para a interpretação adotada nesta sprint.
- **Busca, filtros avançados ou paginação** na lista de clientes — nenhum documento exige isso para o MVP; escopo mínimo necessário é uma lista simples.
- **Multiempresa, seleção de Empresa, ou qualquer campo de contato/endereço não justificado** pela documentação (`docs/05_DATABASE.md` descreve a entidade Cliente de forma conceitual, "sem definição de campos, tipos ou estrutura física" — ver Seção 9).
- **Qualquer módulo além de Clientes** — Projetos (Sprint 004), Landing Pages, Google Ads, Analytics, Relatórios, Insights, Biblioteca, IA, Configurações.

---

## 5. Funcionalidades

1. **Cadastro de cliente** — nome e contexto essencial, associado automaticamente à Empresa do usuário autenticado.
2. **Listagem de clientes ativos** da Empresa, com estado vazio explícito ("nenhum cliente cadastrado ainda") quando aplicável.
3. **Detalhe do cliente** — nome, contexto, status, e áreas em estado vazio para Projetos/Landing Pages/Campanhas/Relatórios/Insights.
4. **Atualização do contexto do cliente** (nome e/ou contexto).
5. **Arquivamento do cliente**, como ação de negócio distinta, com confirmação explícita do usuário antes de ser executada.
6. **Ativação da navegação para Clientes** na sidebar já existente.
7. **Delimitação por propriedade** — usuário só vê, cria, edita ou arquiva clientes da própria Empresa.

---

## 6. Fluxo do usuário

1. Usuário autenticado, a partir do `/dashboard`, clica no item **Clientes** da sidebar (agora ativo).
2. Sistema navega para `/clients`, exibindo estado de carregamento e, em seguida, a lista de clientes ativos da Empresa.
3. Se não houver nenhum cliente: lista mostra estado vazio explícito ("Nenhum cliente cadastrado ainda"), com uma ação para cadastrar o primeiro.
4. Usuário aciona "Novo cliente" → formulário de cadastro (nome, contexto) → ao salvar, é redirecionado à lista, agora com o novo cliente visível.
5. Usuário clica em um cliente da lista → navega para `/clients/:id`, tela de detalhe.
6. Na tela de detalhe, usuário pode:
   - Editar nome/contexto (ação "atualizar contexto");
   - Acionar "Arquivar cliente" → sistema exibe uma confirmação explícita, descrevendo que a ação é irreversível → usuário confirma → cliente é arquivado e removido da lista de ativos.
7. Se a busca de dados falhar (lista ou detalhe): estado de erro explícito, com opção de tentar novamente — mesmo padrão já usado no Dashboard (`tasks/002_dashboard.md`, Seção 7.3 e Seção 8, componente `ErrorState`).

---

## 7. Layout e estrutura da interface

Todas as telas desta sprint são renderizadas dentro da `AppShell` já existente (Sidebar + Topbar, `tasks/002_dashboard.md`, Seção 7.1) — nenhuma tela desta sprint recria cabeçalho ou navegação.

### 7.1 Lista de clientes (`/clients`)

```
┌─────────────────────────────────────────────────────────────┐
│  AppShell (Sidebar com "Clientes" ativo + Topbar)             │
├─────────────────────────────────────────────────────────────┤
│  Clientes                                    [ + Novo cliente]│
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ Nome do cliente                                     >  │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Nome do cliente                                     >  │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                                 │
│  (estado vazio, quando não houver clientes:)                  │
│  "Nenhum cliente cadastrado ainda." [ + Cadastrar primeiro ]  │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Cadastro / edição de cliente (`/clients/new`, `/clients/:id/edit`)

```
┌───────────────────────────────────────┐
│         Novo cliente / Editar          │
│                                         │
│   Nome:      [____________________]    │
│   Contexto:  [____________________]    │
│              [____________________]    │
│                                         │
│         [ Salvar ]   [ Cancelar ]      │
└───────────────────────────────────────┘
```

Mesmo formulário reutilizado para criação e edição — apenas o texto da ação e os dados pré-carregados mudam.

### 7.3 Detalhe do cliente (`/clients/:id`)

```
┌─────────────────────────────────────────────────────────────┐
│  Nome do cliente                          [Editar] [Arquivar] │
│  Contexto: ..................................................│
│                                                                 │
│  Projetos         — "Nenhum projeto ainda" (estado vazio)     │
│  Landing Pages     — "Nenhuma landing page ainda" (estado vazio)│
│  Campanhas Google Ads — "Nenhuma campanha ainda" (estado vazio)│
│  Relatórios        — "Nenhum relatório ainda" (estado vazio)  │
│  Insights          — "Nenhum insight ainda" (estado vazio)    │
└─────────────────────────────────────────────────────────────┘
```

Cada seção vazia usa o componente `EmptyState` já existente (Seção 8), com um texto que deixa claro que o dado ainda não existe porque o módulo correspondente não foi implementado — nunca um número ou contagem fabricada, conforme instrução explícita desta sprint.

### 7.4 Confirmação de arquivamento

Modal/diálogo de confirmação explícita, exibido ao acionar "Arquivar": descreve a irreversibilidade da ação e exige um segundo clique de confirmação antes de a operação ser executada — nunca uma ação de um único clique (ver Seção 12).

---

## 8. Componentes necessários

**Reaproveitados integralmente da Sprint 002 (nenhuma recriação):** `AppShell`, `Sidebar`, `SidebarNavItem` (apenas o item "Clientes" passa de desabilitado para ativo — nenhum outro item é alterado), `Topbar`, `UserMenu`, `EmptyState`, `LoadingState`, `ErrorState`.

**Não reaproveitado nesta sprint:** `SummaryCard` — seu escopo, definido em `tasks/002_dashboard.md` (Seção 8), é especificamente os widgets agregados do Dashboard; a lista de clientes desta sprint usa uma listagem simples, não cartões de resumo.

**Novos, em `frontend/src/features/clients/`:**
- `ClientsListPage` — lista de clientes ativos.
- `ClientFormPage` — formulário de cadastro/edição (reutilizado nas duas ações).
- `ClientDetailPage` — detalhe do cliente, com as seções em estado vazio da Seção 7.3.
- `clientsApi` — camada única de chamadas HTTP ao domínio Clientes (mesmo padrão de `authApi`, `tasks/001_autenticacao.md`, Seção 8).

**Novo, compartilhado, em `frontend/src/components/ui/`:**
- `ConfirmDialog` — diálogo de confirmação explícita, genérico e reutilizável. Justificado porque `docs/06_API.md` (Seção "Aprovação Humana") exige o mesmo padrão de confirmação explícita e separada para "arquivar ou excluir um Cliente, Projeto, Campanha ou Landing Page" — construí-lo como componente compartilhado, e não específico de Clientes, evita recriação idêntica nas Sprints 004 em diante, sem antecipar nenhuma lógica de negócio dessas sprints futuras.

**Novos, no backend, em `backend/src/modules/clients/`:**
- `ClientsModule`, `ClientsController`, `ClientsService`.
- `Client` schema (Mongoose).
- DTOs: `CreateClientDto`, `UpdateClientContextDto` (validados com `class-validator`/`class-transformer`, já usados desde a Sprint 001).

---

## 9. Dados necessários (entidade Cliente)

`docs/05_DATABASE.md` descreve o Cliente de forma conceitual, "sem definição de campos, tipos ou estrutura física":

> "Finalidade: Representar o cliente de marketing atendido pela Empresa (...) Responsabilidade: Ser a fonte de contexto de negócio usada pelo ClientAgent — quem é, o que já foi feito, o que importa saber antes de agir (...) Relação com outras entidades: Pertence a uma Empresa; possui um ou mais Projetos; está associado a Landing Pages, Campanhas, Relatórios e Insights gerados em seu nome."

Campos conceituais mínimos necessários nesta sprint, sem especulação além do que a documentação e o escopo (Seção 3) exigem:

- `_id`
- `empresaId` — referência à Empresa (`docs/05_DATABASE.md`: "Todo cliente pertence a uma Empresa", `docs/06_API.md`); nunca aceito do corpo da requisição, sempre resolvido a partir do usuário autenticado (Seção 10).
- `name` — nome do cliente/negócio/marca atendido.
- `context` — texto livre com as informações essenciais de contexto ("quem é, o que já foi feito, o que importa saber antes de agir" — `docs/05_DATABASE.md`); campo opcional no cadastro, editável a qualquer momento via "atualizar contexto".
- `status` — `ativo` ou `arquivado` (necessário para a operação de arquivamento, Seção 12).
- `archivedAt` — preenchido apenas quando arquivado; sustenta rastreabilidade (`docs/00_PRODUCT_BLUEPRINT.md`, "todo dado relevante é rastreável até sua causa").
- `createdAt`, `updatedAt`.

> **Nota de arquitetura — por que não há campo "objetivo" no Cliente.** `docs/02_PRD.md` menciona, em linguagem de produto, "definição de objetivos de marketing por cliente/conta". `docs/05_DATABASE.md`, que formaliza o modelo de dados, define **Objetivo** como uma entidade que "pertence a um Projeto", não ao Cliente diretamente — a cadeia estrutural é Empresa → Cliente → Projeto → Objetivo. As duas descrições não se contradizem: um objetivo de marketing continua associado ao cliente, mas indiretamente, através dos Projetos que esse cliente vier a ter (Sprint 004). Por isso, esta sprint **não** cria um campo de objetivo no Cliente — fazê-lo duplicaria uma responsabilidade que `docs/05_DATABASE.md` já atribui explicitamente ao Projeto, contrariando a regra de "fonte única por tipo de informação" (`docs/04_AI_ORCHESTRATION.md`, Seção 6).
>
> **Nota de arquitetura — "histórico" do cliente.** `docs/03_ARCHITECTURE.md` cita "histórico" entre as informações do módulo Clientes, mas `docs/05_DATABASE.md` define "Histórico do Projeto" como uma entidade que "pertence a um Projeto", não ao Cliente. O histórico de um cliente, portanto, é a agregação dos históricos de seus Projetos — que não existem nesta sprint. Nenhum campo de histórico é criado diretamente no Cliente.

---

## 10. Integração com backend

O frontend concentra toda comunicação com o domínio Clientes em `clientsApi` (mesmo padrão de `authApi`, reaproveitando a instância `apiClient` já configurada na Sprint 001, `tasks/001_autenticacao.md`, Seção 8).

Toda requisição a um endpoint de Clientes:
- Inclui o JWT da sessão ativa (reaproveitando `ProtectedRoute` e o guard de autenticação da Sprint 001 — nenhum novo mecanismo de sessão é criado).
- Tem seu `empresaId` de escopo resolvido no backend a partir do usuário autenticado (via o mesmo mecanismo que já expõe `GET /users/me`, Sprint 001) — nunca a partir de um valor enviado pelo cliente da API.

Não há nenhuma nova dependência de infraestrutura além da já existente: mesmo banco (MongoDB Atlas, mesma `MONGODB_URI`), mesmo mecanismo de autenticação, mesma instância Axios.

---

## 11. Rotas/API necessárias

Conforme `docs/06_API.md` (domínio Clientes: "Cadastrar cliente; atualizar contexto do cliente; consultar cliente; arquivar cliente"), seguindo a mesma filosofia de "ações de negócio, não CRUD genérico" já aplicada nas sprints anteriores:

| Operação | Domínio (`docs/06_API.md`) | Rota | Regra |
|---|---|---|---|
| Cadastrar cliente | Clientes | `POST /clients` | `empresaId` resolvido do usuário autenticado; `name` obrigatório |
| Consultar clientes | Clientes | `GET /clients` | Lista apenas clientes com `status = ativo` da Empresa do usuário autenticado |
| Consultar cliente (detalhe) | Clientes | `GET /clients/:id` | Retorna 404 se o cliente não pertencer à Empresa do usuário autenticado (nunca revela que o registro existe em outra Empresa) |
| Atualizar contexto do cliente | Clientes | `PATCH /clients/:id` | Permite alterar `name`/`context`; não altera `status` |
| Arquivar cliente | Clientes | `POST /clients/:id/archive` | Operação distinta e separada de "atualizar" (`docs/06_API.md`, Seção "Aprovação Humana": "sempre distinta e posterior à operação que produziu o artefato"); muda `status` para `arquivado` e preenche `archivedAt` |

Todas as rotas exigem JWT válido (guard da Sprint 001) — nenhuma rota de Clientes é pública.

---

## 12. Regras de negócio

- **Todo cliente pertence a exatamente uma Empresa** (`docs/06_API.md`) — nesta fase do MVP, sempre a Empresa única do sistema (`docs/03_ARCHITECTURE.md`, Seção 9).
- **Arquivar é irreversível e exige aprovação humana explícita.** `docs/06_API.md` (Seção "Aprovação Humana") lista "arquivar ou excluir um Cliente" entre as operações que "sempre exigem uma confirmação humana explícita e separada antes de sua execução"; `docs/04_AI_ORCHESTRATION.md` reforça: "decisão final é sempre humana". Como o mecanismo formal de aprovação via IA/Timeline (Insights, fluxo de aprovação) ainda não existe neste estágio do produto, esta sprint interpreta e implementa essa exigência como uma **confirmação explícita de interface**: um diálogo dedicado (`ConfirmDialog`, Seção 8) que o usuário precisa confirmar ativamente antes de a chamada de arquivamento ser disparada — nunca uma ação de clique único. Essa interpretação fica registrada conscientemente aqui, para revisão caso um mecanismo de aprovação mais formal seja introduzido em sprint futura.
- **Arquivamento é uma mudança de estado, nunca uma exclusão física.** Preserva a rastreabilidade exigida por `docs/00_PRODUCT_BLUEPRINT.md` ("dado é ativo crítico") e por `docs/05_DATABASE.md` (Auditoria). Um cliente arquivado deixa de aparecer na lista padrão, mas seu registro nunca é removido do banco.
- **Nenhum dado de Projetos, Landing Pages, Campanhas, Relatórios ou Insights é exibido como se existisse.** A tela de detalhe do cliente mostra apenas estados vazios explícitos para essas categorias (Seção 7.3), nunca contagens fabricadas.
- **Delimitação por propriedade:** um usuário nunca consegue listar, consultar, editar ou arquivar um cliente que não pertença à sua própria Empresa — mesmo em um cenário hipotético de múltiplos registros de Empresa no banco, o filtro por `empresaId` do usuário autenticado é aplicado em toda operação, sem exceção.
- **Nome é obrigatório**; contexto é opcional no cadastro e editável a qualquer momento.

---

## 13. Segurança e autenticação

- Todas as rotas de `/clients` exigem JWT válido, reaproveitando o guard já implementado na Sprint 001 — nenhum novo mecanismo de autenticação é criado.
- **Autorização delimitada por propriedade** (`docs/06_API.md`, Segurança: "Um usuário só pode operar sobre Clientes, Projetos e artefatos que pertençam à sua Empresa"): toda consulta, criação, atualização e arquivamento de Cliente é filtrada pelo `empresaId` do usuário autenticado, resolvido no backend — nunca aceito como parâmetro vindo do frontend.
- Nenhuma informação de cliente de outra Empresa é revelada, mesmo indiretamente (ex.: um `GET /clients/:id` de um cliente de outra Empresa retorna 404, nunca 403 com detalhes que confirmem a existência do registro).
- Arquivamento exige o mesmo nível de proteção de qualquer outra operação desta sprint (JWT + propriedade) mais a confirmação explícita de interface descrita na Seção 12 — nenhum atalho técnico contorna essa exigência (`docs/08_RULES.md`, Segurança).

---

## 14. Estrutura de arquivos esperada

```
backend/src/modules/clients/
├── clients.module.ts
├── clients.controller.ts
├── clients.service.ts
├── schemas/
│   └── client.schema.ts
└── dto/
    ├── create-client.dto.ts
    └── update-client-context.dto.ts
```

```
frontend/src/features/clients/
├── pages/
│   ├── ClientsListPage.tsx
│   ├── ClientFormPage.tsx
│   └── ClientDetailPage.tsx
└── api/
    └── clientsApi.ts

frontend/src/components/ui/
└── ConfirmDialog.tsx        # novo componente compartilhado, ver Seção 8
```

> **Nota de nomenclatura.** O diretório usado é `clients/` (inglês), não `clientes/` — corrigindo uma inconsistência de grafia em relação ao nome coloquial do módulo. Essa é a pasta que já existe, vazia, desde a fundação técnica (Sprint 0) em ambos `backend/src/modules/clients/` e `frontend/src/features/clients/`, e é o mesmo padrão de nomenclatura em inglês já usado em `auth`, `users` e `dashboard` nas Sprints 001 e 002. Renomear a pasta para `clientes/` criaria uma inconsistência estrutural não justificada, contrariando `docs/08_RULES.md` ("consistência entre documentação e nome real").

Arquivos existentes alterados por esta sprint: `frontend/src/App.tsx` (rotas `/clients`, `/clients/new`, `/clients/:id`, `/clients/:id/edit`); `frontend/src/components/layout/SidebarNavItem` — apenas os dados de configuração do item "Clientes" (de desabilitado para ativo, sem alterar o componente em si); `backend/src/app.module.ts` (importar `ClientsModule`).

---

## 15. Critérios de aceitação

- [ ] Um cliente pode ser cadastrado com nome (obrigatório) e contexto (opcional).
- [ ] A lista de clientes exibe apenas clientes com status ativo da Empresa do usuário autenticado.
- [ ] A lista de clientes exibe estado vazio explícito quando não houver nenhum cliente cadastrado.
- [ ] O detalhe de um cliente exibe nome, contexto e status reais — nunca fabricados.
- [ ] O detalhe de um cliente exibe estados vazios explícitos para Projetos, Landing Pages, Campanhas, Relatórios e Insights — nunca contagens fabricadas.
- [ ] O contexto (e o nome) de um cliente existente pode ser atualizado.
- [ ] Arquivar um cliente exige uma confirmação explícita antes de ser executado — nenhuma ação de um único clique arquiva um cliente.
- [ ] Um cliente arquivado deixa de aparecer na lista padrão, mas seu registro não é removido do banco.
- [ ] Um usuário não consegue consultar, editar ou arquivar um cliente que pertença a outra Empresa (mesmo que outro registro de Empresa exista no banco).
- [ ] Todas as rotas de Clientes exigem JWT válido — sem exceção.
- [ ] O item "Clientes" da sidebar está ativo e navega corretamente para `/clients`; nenhum outro item da sidebar foi alterado.
- [ ] Nenhum dado de Cliente, Projeto, Landing Page, Campanha, Relatório ou Insight é mockado, hardcoded ou fabricado em qualquer tela ou resposta de API.

---

## 16. Definition of Done

Conforme `docs/08_RULES.md` (Definition of Done), esta sprint só é considerada concluída quando, simultaneamente:

1. Funciona conforme o objetivo descrito em `docs/03_ARCHITECTURE.md` (módulo Clientes) e `docs/07_ROADMAP.md` (item "Clientes" do MVP).
2. Respeita a arquitetura vigente sem exceções não documentadas — inclusive as decisões registradas nas Seções 9 e 14 sobre onde vivem Objetivo/Histórico e sobre o nome do diretório.
3. Foi validada por revisão de código e pelos testes aplicáveis (cadastro, listagem escopada por Empresa, atualização de contexto, arquivamento com confirmação, isolamento entre Empresas).
4. Não introduz regressão em nada que as Sprints 001 e 002 já entregavam (login, sessão, `ProtectedRoute`, Dashboard, demais itens da sidebar).
5. Está documentada — este próprio documento é a referência; qualquer desvio de implementação em relação a ele deve ser refletido aqui como atualização consciente.
6. Foi entregue com o menor escopo necessário — sem CRUD de Projetos/Landing Pages/etc., sem busca/paginação, sem reconexão do Dashboard (Seção 4).

---

## 17. Dependências

- Sprint 001 — Autenticação, concluída e validada (JWT, `ProtectedRoute`, guard de rotas, usuário autenticado disponível nos controllers).
- Sprint 002 — Dashboard, concluída e validada (`AppShell`, `Sidebar`, `EmptyState`, `LoadingState`, `ErrorState`, item "Clientes" já presente na sidebar, ainda que desabilitado).
- **Sem dependência** de Projetos, Landing Pages, Google Ads, Analytics, Relatórios, Insights ou Biblioteca — todos tratados como não implementados, com estado vazio correspondente na tela de detalhe do cliente.

---

## 18. Resultado esperado

Ao final da Sprint 003, a Empresa única do MarketingAI pode ter clientes reais cadastrados: uma lista navegável a partir da sidebar, um formulário de cadastro/edição, uma tela de detalhe com estados vazios honestos para tudo que ainda não existe, e um fluxo de arquivamento seguro, com confirmação explícita e sem exclusão física de dado.

Esse resultado desbloqueia diretamente a Sprint 004 — Projetos, que depende de um Cliente já existente para poder ser criada (`docs/05_DATABASE.md`: "Projeto (...) pertence a um Cliente"). Fica registrado, como próximo passo consciente e de escopo pequeno — não incluído nesta sprint (Seção 4) —, conectar o cartão "Clientes ativos" do Dashboard (`tasks/002_dashboard.md`) à operação de consulta que esta sprint já disponibiliza (`GET /clients`), completando a evolução aditiva que aquele documento já previa.
