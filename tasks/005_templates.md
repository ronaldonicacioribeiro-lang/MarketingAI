# Sprint 005 — Templates Inteligentes

**Produto:** MarketingAI
**Documento:** Especificação Técnica de Sprint
**Sprint:** 005 — Templates Inteligentes
**Depende de:** Sprint 001 — Autenticação, Sprint 002 — Dashboard e Sprint 003 — Clientes (concluídas e validadas). Sem dependência funcional de Sprint 004 — Projetos (ver Seção 16).
**Base documental:** `PROJECT.md`, `README.md`, `docs/00_PRODUCT_BLUEPRINT.md`, `docs/01_VISION.md`, `docs/02_PRD.md`, `docs/03_ARCHITECTURE.md`, `docs/04_AI_ORCHESTRATION.md`, `docs/05_DATABASE.md`, `docs/06_API.md`, `docs/07_ROADMAP.md`, `docs/08_RULES.md`, `docs/09_TECH_STACK.md`
**Status:** Especificação — aguardando implementação (nenhum código desta sprint foi escrito)

> Este documento é uma especificação técnica. Ele não contém código, não altera backend, frontend ou banco de dados, e não deve ser interpretado como autorização para início de implementação até revisão e aprovação explícita. Ele deve ser lido em sequência com `tasks/001_autenticacao.md`, `tasks/002_dashboard.md`, `tasks/003_clientes.md` e `tasks/004_projetos.md`.

---

## 1. Objetivo

Especificar o schema mínimo e o CRUD básico de **Template** — o modelo reutilizável a partir do qual, em sprint futura, Landing Pages serão geradas. Segundo `docs/03_ARCHITECTURE.md` (Seção 9, Decisões Arquiteturais do MVP): "Landing Pages são geradas a partir de templates inteligentes, não de criação livre irrestrita, garantindo consistência e velocidade". Esta sprint entrega exatamente essa pré-condição: sem Templates cadastrados, a sprint de Landing Pages não teria a partir de que gerar nada.

Esta sprint **não** entrega o módulo Biblioteca completo, nem geração assistida por IA — ambos ficam explicitamente fora do escopo (Seção 4), com a justificativa documental completa.

---

## 2. Contexto

`docs/07_ROADMAP.md` posiciona **Templates Inteligentes** como item próprio do MVP, logo após Projetos e antes de Landing Pages: "Projetos → **Templates** → Landing Pages → Google Ads → Assistente de IA → **Biblioteca** → (...)". A justificativa registrada ali é direta: "Foram escolhidos como parte do MVP porque sustentam diretamente a decisão arquitetural já aprovada em `03_ARCHITECTURE.md`: landing pages nascem de templates, não de criação livre, garantindo consistência e velocidade desde a primeira entrega."

Note-se que **Biblioteca** aparece como uma sprint **separada e posterior** no mesmo roadmap — isso é o centro da tensão documental que a Seção 4 resolve explicitamente.

`docs/04_AI_ORCHESTRATION.md` descreve o `KnowledgeAgent` como quem, em sprints futuras (quando a geração assistida por IA existir), vai "consultar a Biblioteca de templates e materiais existentes" para entregar um ponto de partida validado ao `LandingPageAgent`. Esta sprint não implementa esse fluxo — apenas garante que exista algo real para consultar quando ele for construído.

---

## 3. Escopo

Fazem parte desta sprint, correspondendo às operações do domínio Biblioteca definidas em `docs/06_API.md` ("Adicionar item à biblioteca; consultar itens; atualizar item; arquivar item") — aplicadas exclusivamente ao tipo de item **Template**:

- **Cadastrar template** — nome (obrigatório), descrição e conteúdo/estrutura, sempre associado à Empresa do usuário autenticado.
- **Consultar templates** — lista de templates ativos da Empresa, com estado vazio explícito quando não houver nenhum.
- **Consultar template (detalhe)** — nome, descrição, conteúdo, status, e uma área em estado vazio para "Landing Pages geradas a partir deste template" (Seção 4 — esse módulo ainda não existe).
- **Atualizar template** — nome, descrição e conteúdo.
- **Arquivar template** — ação de negócio distinta e irreversível, com confirmação explícita (reaproveitando `ConfirmDialog`).
- Entidade **Template** (Mongoose), delimitada por propriedade de Empresa.
- Ativação do item "Biblioteca" na sidebar (`tasks/002_dashboard.md`, Seção 7.2), hoje desabilitado, apontando para a lista de Templates.

---

## 4. Fora do escopo

### A tensão entre Roadmap e Arquitetura/Banco de Dados — resolvida conscientemente

`docs/07_ROADMAP.md` trata "Templates Inteligentes" como sprint própria, separada de "Biblioteca". Já `docs/05_DATABASE.md` descreve Template como uma entidade que "Pertence à Biblioteca", e `docs/06_API.md` **não define nenhum domínio de API próprio para "Templates"** — as únicas operações documentadas para esse tipo de dado pertencem inteiramente ao domínio **Biblioteca** ("Adicionar item à biblioteca; consultar itens; atualizar item; arquivar item"). Não existe, em nenhum documento, um domínio "Templates" isolado.

Isso não é uma contradição a ser ignorada — é resolvida aqui da mesma forma que `tasks/004_projetos.md` (Seção 4) já resolveu a tensão equivalente sobre Objetivo/Estado/Histórico do Projeto: **entrega mínima e consciente, com a decisão registrada explicitamente**.

- Esta sprint entrega **apenas o schema de Template e seu CRUD básico** — a fatia mínima do domínio Biblioteca (`docs/06_API.md`) necessária para que a Sprint 006 (Landing Pages) tenha o que consumir, exatamente como `docs/07_ROADMAP.md` justifica a existência desta sprint.
- Esta sprint **não** entrega o módulo Biblioteca completo como descrito em `docs/03_ARCHITECTURE.md` (Seção 4): "Repositório central de ativos reutilizáveis — templates, conteúdos aprovados anteriormente, referências de campanhas bem-sucedidas." Não há tela geral de "Biblioteca" com múltiplos tipos de ativo — apenas a lista de Templates.
- **Entidade Documento não é criada.** `docs/05_DATABASE.md` descreve a Biblioteca como algo que "contém Templates e Documentos" — Documento é o segundo tipo de item, usado como "referência de conteúdo e boas práticas pelo KnowledgeAgent". Não há necessidade documentada de Documento para desbloquear Landing Pages; fica para a sprint que entregar o módulo Biblioteca em sua forma completa.
- **Nenhuma geração assistida por IA.** `KnowledgeAgent`, `LandingPageAgent`, `CopyAgent` e qualquer fluxo de `docs/04_AI_ORCHESTRATION.md` ficam inteiramente fora — esta sprint entrega apenas armazenamento estrutural (nome, descrição, conteúdo), nunca a geração de uma landing page a partir de um template.
- **Nenhuma Landing Page real.** O módulo não existe ainda (`docs/07_ROADMAP.md`); a tela de detalhe do template exibe estado vazio explícito para "Landing Pages geradas a partir deste template" — nunca uma contagem fabricada, mesmo que seja tentador mostrar "0 landing pages" como se fosse um dado real consultado.
- **Reabertura de um template arquivado.** Mesma decisão já tomada para Cliente (`tasks/003_clientes.md`, Seção 4) — sem operação de reativação nesta sprint.
- **Exclusão física (hard delete).** Preserva rastreabilidade, mesma decisão já registrada em Clientes e Projetos.
- **Categorias, tags ou tipos de template.** Nenhum documento define uma taxonomia de templates; inventar uma seria decisão de produto não autorizada por esta especificação.
- **Editor visual de conteúdo/estrutura.** O campo de conteúdo é texto livre nesta sprint (Seção 9) — um editor estruturado de blocos/seções é decisão de design da própria Sprint de Landing Pages, quando ela definir como consome esse conteúdo.
- **Qualquer módulo além de Biblioteca/Template** — Landing Pages, Google Ads, Analytics, Relatórios, Insights, IA, Configurações.

---

## 5. Funcionalidades

1. **Cadastro de template** — nome, descrição e conteúdo, associado automaticamente à Empresa do usuário autenticado.
2. **Listagem de templates ativos** da Empresa, com estado vazio explícito quando não houver nenhum.
3. **Detalhe do template** — nome, descrição, conteúdo, status, e área em estado vazio para Landing Pages associadas.
4. **Atualização do template** (nome, descrição e/ou conteúdo).
5. **Arquivamento do template**, como ação de negócio distinta, com confirmação explícita (reaproveitando `ConfirmDialog`).
6. **Ativação da navegação para Biblioteca** na sidebar já existente, apontando para a lista de Templates.
7. **Delimitação por propriedade** — um template só é visível/editável por usuários da mesma Empresa.

---

## 6. Fluxo do usuário

1. Usuário autenticado clica em "Biblioteca" na sidebar (agora ativo) → navega para `/library`.
2. Vê a lista de templates ativos da Empresa — ou, se vazia, o estado vazio explícito com uma ação para cadastrar o primeiro.
3. Usuário aciona "Novo template" → formulário (nome, descrição, conteúdo) → ao salvar, é levado ao detalhe do template criado.
4. Usuário navega para `/library/:id` → vê nome, descrição, conteúdo, status, e a seção "Landing Pages geradas a partir deste template" em estado vazio.
5. Usuário pode:
   - Editar nome/descrição/conteúdo — ação "atualizar";
   - Acionar "Arquivar" → confirmação explícita (`ConfirmDialog`) → template arquivado, sai da listagem padrão.
6. Se a busca de dados falhar (lista ou detalhe): estado de erro explícito, com opção de tentar novamente — mesmo padrão de `EmptyState`/`LoadingState`/`ErrorState` já usado nas sprints anteriores.

---

## 7. Layout e estrutura da interface

Todas as telas usam a `AppShell` já existente.

### 7.1 Lista de templates (`/library`)

```
┌─────────────────────────────────────────────────────────────┐
│  Biblioteca                                  [ + Novo template]│
│  ┌───────────────────────────────────────────────────────┐   │
│  │ Nome do template                                    >  │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Nome do template                                    >  │   │
│  └───────────────────────────────────────────────────────┘   │
│  (estado vazio: "Nenhum template cadastrado ainda." + ação)  │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Cadastro / edição de template (`/library/new`, `/library/:id/edit`)

```
┌───────────────────────────────────────┐
│      Novo template / Editar            │
│                                         │
│   Nome:        [________________]      │
│   Descrição:   [________________]      │
│   Conteúdo:    [________________]      │
│                [________________]      │
│         [ Salvar ]   [ Cancelar ]      │
└───────────────────────────────────────┘
```

### 7.3 Detalhe do template (`/library/:id`)

```
┌─────────────────────────────────────────────────────────────┐
│  Nome do template                       [Editar] [Arquivar]   │
│  Descrição: ..................................................│
│  Conteúdo: ....................................................│
│                                                                 │
│  Landing Pages geradas a partir deste template                │
│  "Nenhuma landing page ainda." (estado vazio)                 │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Confirmação de arquivamento

Reaproveita `ConfirmDialog` (`tasks/003_clientes.md`, Seção 8) — descreve a irreversibilidade e exige confirmação explícita, nenhuma ação de um único clique.

---

## 8. Componentes necessários

Nomenclatura alinhada a `docs/08_RULES.md`. Nenhum componente abaixo implica lógica de negócio de outro módulo.

**Reaproveitados integralmente (nenhuma recriação):** `AppShell`, `Sidebar` (apenas o item "Biblioteca" passa de desabilitado para ativo), `SidebarNavItem`, `Topbar`, `UserMenu`, `EmptyState`, `LoadingState`, `ErrorState`, `ConfirmDialog` (`tasks/002_dashboard.md`, `tasks/003_clientes.md`).

**Novos, em `frontend/src/features/library/`:**
- `TemplatesListPage` — lista de templates ativos.
- `TemplateFormPage` — formulário de cadastro/edição (mesmo componente para as duas ações, mesmo padrão de `ClientFormPage`/`ProjectFormPage`).
- `TemplateDetailPage` — detalhe do template, incluindo a seção em estado vazio da Seção 7.3.
- `templatesApi` — camada única de chamadas HTTP ao domínio, mesmo padrão de `clientsApi`/`projectsApi`.

Nenhum hook dedicado é criado além do necessário — mesmo padrão já usado em Clientes: a lógica de busca/loading/erro fica local a cada página.

---

## 9. Estrutura de dados

### Template

`docs/05_DATABASE.md`:
> "Finalidade: Representar um modelo reutilizável usado como ponto de partida para novas Landing Pages. Responsabilidade: Garantir consistência e velocidade na geração de páginas (...) Relação com outras entidades: Pertence à Biblioteca; pode originar múltiplas Landing Pages ao longo do tempo, em diferentes Projetos e Clientes."

Campos conceituais necessários nesta sprint:
- `_id`
- `empresaId` — referência à Empresa, denormalizada diretamente no Template (mesmo padrão de defesa em profundidade já usado em Cliente e Projeto) — nunca aceito do corpo da requisição.
- `name` — nome do template, obrigatório.
- `description` — texto livre, opcional.
- `content` — texto livre representando a estrutura/conteúdo do template nesta versão mínima (Seção 4 — nenhum formato estruturado de blocos é definido, pois isso pertence à Sprint de Landing Pages).
- `status` — `ativo` ou `arquivado` (mesmo padrão de Cliente, `tasks/003_clientes.md`).
- `archivedAt`.
- `createdAt`, `updatedAt`.

> **Nota de arquitetura — Template pertence à Empresa, não a um Cliente ou Projeto.** `docs/06_API.md` (domínio Biblioteca): "Itens da Biblioteca pertencem à Empresa, não a um projeto específico — é a exceção deliberada à regra de que toda entidade de produção pertence a um projeto, conforme `05_DATABASE.md`." O escopo por Empresa segue o mesmo padrão já validado em Clientes: `empresaId` sempre resolvido do usuário autenticado, incluído em toda query.
>
> **Nota de arquitetura — onde vive o schema.** "Templates" não é um dos treze módulos funcionais listados em `docs/03_ARCHITECTURE.md` (Seção 3) — o módulo correspondente é **Biblioteca**, e o schema já existe reservado como pasta vazia em `backend/src/modules/library/` e `frontend/src/features/library/` desde a Sprint 0. O schema de Template vive, portanto, dentro de `modules/library/`, não em um novo `modules/templates/` — mesmo raciocínio já usado para Empresa dentro de `modules/users/` (`tasks/001_autenticacao.md`, Seção 9) e para o Histórico do Projeto dentro de `modules/projects/` (`tasks/004_projetos.md`, Seção 8). Quando Documento for adicionado em sprint futura, ele estende o mesmo `LibraryModule`, sem reestruturação.

---

## 10. Regras de API / endpoints

Conforme `docs/06_API.md` (domínio Biblioteca — único domínio documentado para este dado):

| Operação | Domínio (`docs/06_API.md`) | Rota | Regra |
|---|---|---|---|
| Adicionar item à biblioteca | Biblioteca | `POST /templates` | `empresaId` resolvido do usuário autenticado; `name` obrigatório |
| Consultar itens | Biblioteca | `GET /templates` | Lista apenas templates com `status = ativo` da Empresa do usuário autenticado |
| Consultar item (detalhe) | Biblioteca | `GET /templates/:id` | 404 se não pertencer à Empresa autenticada |
| Atualizar item | Biblioteca | `PATCH /templates/:id` | Permite alterar `name`/`description`/`content`; não altera `status` |
| Arquivar item | Biblioteca | `POST /templates/:id/archive` | Operação distinta e separada do `PATCH`, muda `status` para `arquivado` |

> **Nota de nomenclatura — rota `/templates`, não `/library/templates`.** Ainda que a fonte documental das operações seja o domínio Biblioteca, a rota usa o nome da entidade diretamente — mesmo padrão já usado em `/clients` e `/projects` (nenhuma rota deste projeto é prefixada pelo nome do módulo). Usar `/library/templates` sugeriria a existência de uma hierarquia de tipos de item dentro de Biblioteca que esta sprint não constrói (Seção 4) — a rota simples evita essa implicação.

Todas as rotas exigem JWT válido — nenhuma rota é pública.

---

## 11. Integrações necessárias

- Nenhuma integração com Cliente ou Projeto — Template não pertence a nenhum dos dois (Seção 9).
- Reaproveita o mesmo mecanismo de resolução de `empresaId` a partir do usuário autenticado (`GET /users/me`, `CurrentUser` decorator) já usado em Clientes e Projetos — nenhuma lógica nova de identificação de Empresa é criada.
- Nenhuma integração com IA, KnowledgeAgent ou qualquer especialista (Seção 4).

---

## 12. Segurança e autenticação

- Todas as rotas de `/templates` exigem JWT válido, reaproveitando o guard já implementado na Sprint 001.
- **Autorização delimitada por propriedade** (`docs/06_API.md`, Segurança): toda consulta, criação, atualização e arquivamento de Template é filtrada pelo `empresaId` do usuário autenticado, resolvido no backend — nunca aceito do corpo da requisição.
- Nenhuma informação de template de outra Empresa é revelada, mesmo indiretamente (`GET /templates/:id` de um template de outra Empresa retorna 404).
- Arquivamento exige o mesmo nível de proteção de qualquer outra operação (JWT + propriedade) mais a confirmação explícita de interface.

---

## 13. Regras de negócio

- **Todo template pertence a exatamente uma Empresa** — nesta fase do MVP, sempre a Empresa única do sistema (`docs/03_ARCHITECTURE.md`, Seção 9).
- **Nome é obrigatório**; descrição e conteúdo são opcionais no cadastro e editáveis a qualquer momento.
- **Arquivar é uma mudança de estado, nunca uma exclusão física** — preserva rastreabilidade (`docs/00_PRODUCT_BLUEPRINT.md`), mesma decisão já tomada para Cliente e Projeto.
- **Arquivamento é ação distinta e irreversível**, com confirmação explícita de interface — nenhum atalho de um único clique.
- **Um template arquivado deixa de aparecer na listagem padrão**, mas seu registro não é removido do banco.
- **Nenhum dado de Landing Page é exibido como se existisse** — a seção correspondente no detalhe do template é sempre um estado vazio explícito nesta sprint (Seção 4).

---

## 14. Estrutura de arquivos esperada

```
backend/src/modules/library/
├── library.module.ts
├── library.controller.ts
├── library.service.ts
├── schemas/
│   └── template.schema.ts
└── dto/
    ├── create-template.dto.ts
    └── update-template.dto.ts
```

```
frontend/src/features/library/
├── pages/
│   ├── TemplatesListPage.tsx
│   ├── TemplateFormPage.tsx
│   └── TemplateDetailPage.tsx
└── api/
    └── templatesApi.ts
```

Arquivos existentes que esta sprint precisa alterar: `backend/src/app.module.ts` (importar `LibraryModule`); `frontend/src/App.tsx` (rotas `/library`, `/library/new`, `/library/:id`, `/library/:id/edit`); `frontend/src/components/layout/Sidebar.tsx` (apenas o item "Biblioteca" passa de desabilitado para ativo, sem alterar mais nenhum item, mesmo padrão já usado em Clientes).

---

## 15. Critérios de aceitação

- [ ] Um template pode ser cadastrado com nome (obrigatório), descrição e conteúdo (opcionais).
- [ ] A lista de templates exibe apenas templates ativos da Empresa do usuário autenticado.
- [ ] A lista exibe estado vazio explícito quando não houver nenhum template cadastrado.
- [ ] O detalhe de um template exibe nome, descrição, conteúdo e status reais — nunca fabricados.
- [ ] O detalhe exibe estado vazio explícito para "Landing Pages geradas a partir deste template" — nunca uma contagem fabricada.
- [ ] Nome, descrição e conteúdo de um template existente podem ser atualizados.
- [ ] Arquivar um template exige confirmação explícita antes de ser executado.
- [ ] Um template arquivado deixa de aparecer na lista padrão, mas seu registro não é removido do banco.
- [ ] Um usuário não consegue consultar, editar ou arquivar um template que pertença a outra Empresa.
- [ ] Todas as rotas de Templates exigem JWT válido.
- [ ] O item "Biblioteca" da sidebar está ativo e navega para `/library`; nenhum outro item foi alterado.
- [ ] Nenhum dado de Landing Page é mockado, hardcoded ou simulado em qualquer camada.

---

## 16. Definition of Done

Conforme `docs/08_RULES.md` (Definition of Done), esta sprint só é considerada concluída quando, simultaneamente:

1. Funciona conforme o objetivo descrito em `docs/07_ROADMAP.md` (item "Templates Inteligentes" do MVP) e serve de pré-condição documentada para a Sprint 006 (Landing Pages).
2. Respeita a arquitetura vigente sem exceções não documentadas — inclusive a decisão registrada na Seção 9 sobre o schema viver em `modules/library/`, não em um módulo "Templates" próprio.
3. Foi validada por revisão de código e pelos testes aplicáveis (cadastro, listagem escopada por Empresa, atualização, arquivamento com confirmação, isolamento entre Empresas).
4. Não introduz regressão em nada que as Sprints 001 a 004 já entregavam.
5. Está documentada — este próprio documento é a referência, incluindo a resolução consciente da tensão Roadmap/Arquitetura registrada na Seção 4.
6. Foi entregue com o menor escopo necessário — sem Documento, sem tela geral de Biblioteca, sem geração por IA, sem editor de conteúdo estruturado.

---

## 17. Dependências

- Sprint 001 — Autenticação, concluída e validada (JWT, guard de rotas, usuário autenticado, entidade Empresa).
- Sprint 002 — Dashboard, concluída e validada (`AppShell`, `Sidebar`, `EmptyState`, `LoadingState`, `ErrorState`, item "Biblioteca" já presente na sidebar, ainda que desabilitado).
- Sprint 003 — Clientes, concluída e validada (`ConfirmDialog`, padrão de service escopado por Empresa).
- **Sem dependência funcional de Sprint 004 — Projetos.** Template pertence à Empresa, não a um Cliente ou Projeto (Seção 9) — nada nesta sprint consulta ou referencia Projetos. A ordem no roadmap é sequencial por convenção do processo, não por necessidade técnica entre os dois módulos.
- **Sem dependência** de Landing Pages, Google Ads, Analytics, Relatórios, Insights, IA ou do módulo Biblioteca completo — todos tratados como não implementados, com estado vazio correspondente.

---

## 18. Resultado esperado

Ao final da Sprint 005, a Empresa única do MarketingAI pode ter Templates reais cadastrados: uma lista navegável a partir da sidebar ("Biblioteca"), um formulário de cadastro/edição, uma tela de detalhe honesta sobre o que ainda não existe (Landing Pages associadas), e um fluxo de arquivamento seguro, com confirmação explícita e sem exclusão física de dado.

Esse resultado desbloqueia diretamente a Sprint 006 — Landing Pages, que segundo `docs/03_ARCHITECTURE.md` e `docs/07_ROADMAP.md` depende de templates já existentes para gerar páginas "a partir de templates inteligentes, não de criação livre". Fica registrado, como sprint futura própria e não incluída aqui (Seção 4), a expansão do módulo Biblioteca para sua forma completa — Documento, tela geral de Biblioteca com múltiplos tipos de ativo, e a integração real do `KnowledgeAgent` — sem necessidade de reestruturar o que esta sprint já entrega, apenas estendendo o mesmo `LibraryModule`.
