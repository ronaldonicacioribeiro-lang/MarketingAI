# Sprint 002 — Dashboard

**Produto:** MarketingAI
**Documento:** Especificação Técnica de Sprint
**Sprint:** 002 — Dashboard
**Depende de:** Sprint 001 — Autenticação (concluída e validada)
**Base documental:** `PROJECT.md`, `README.md`, `docs/00_PRODUCT_BLUEPRINT.md`, `docs/01_VISION.md`, `docs/02_PRD.md`, `docs/03_ARCHITECTURE.md`, `docs/04_AI_ORCHESTRATION.md`, `docs/05_DATABASE.md`, `docs/06_API.md`, `docs/07_ROADMAP.md`, `docs/08_RULES.md`
**Status:** Especificação — aguardando implementação (nenhum código foi escrito para esta sprint)

> Este documento é uma especificação técnica. Ele não contém código, não altera backend, frontend ou banco de dados, e não deve ser interpretado como autorização para início de implementação até revisão e aprovação explícita.

---

## 1. Objetivo

Especificar o **Dashboard** do MarketingAI: o ponto de entrada do usuário logo após o login, conforme definido em `docs/03_ARCHITECTURE.md` (módulo Dashboard) e `docs/07_ROADMAP.md` (MVP — Versão 1.0). O Dashboard deve consolidar, em uma única tela, uma visão geral do estado atual do sistema e priorizar o que exige atenção do usuário — sem, nesta sprint, depender de módulos que ainda não existem (Clientes, Projetos, Relatórios, Insights).

Esta sprint também estabelece a **casca de navegação (AppShell)** — sidebar e cabeçalho — que sustentará a navegação de todos os módulos futuros do MVP, já que o Dashboard não pode existir isoladamente de uma estrutura de navegação (`docs/03_ARCHITECTURE.md`, Seção 5 — Fluxo de Navegação do Usuário).

---

## 2. Contexto

A Sprint 001 entregou a camada de acesso do sistema (Autenticação + Usuários, conforme `docs/03_ARCHITECTURE.md`, Seção 4): primeiro administrador, login, logout, JWT com expiração, rotas protegidas, `ProtectedRoute` no frontend, persistência de sessão, hash de senha com bcrypt, entidades `User` e `Empresa`, integração NestJS + Mongoose com MongoDB Atlas, e tratamento de erros de autenticação. Essa camada está validada e em uso — o primeiro login já foi realizado com sucesso.

Segundo `docs/03_ARCHITECTURE.md` (Seção 4), "nenhum outro módulo é alcançável sem passar" pela camada de Autenticação/Usuários, e o Dashboard é o módulo que seu usuário encontra imediatamente depois. Segundo `docs/07_ROADMAP.md`, o Dashboard "é o ponto de entrada do usuário e a primeira prova de valor do produto: uma visão consolidada do que precisa de atenção. Sem ele, o usuário teria que navegar entre módulos para descobrir o que está pendente".

Entretanto, na ordem de evolução definida em `docs/07_ROADMAP.md` (Login → **Dashboard** → Clientes → Projetos → Templates → Landing Pages → Google Ads → Assistente de IA → Biblioteca → Relatórios → Analytics → Insights), o Dashboard é construído **antes** dos módulos que normalmente alimentariam seus indicadores (Clientes, Projetos, Relatórios, Insights). Esta sprint precisa, portanto, entregar uma estrutura visual e funcional completa, mas sem qualquer dado fabricado — apenas dados reais já disponíveis (usuário e Empresa autenticados) e estados vazios explícitos para tudo o que depende de módulos futuros.

---

## 3. Escopo

Fazem parte desta sprint:

- Rota protegida `/dashboard`, acessível apenas a usuário autenticado (reaproveitando `ProtectedRoute` da Sprint 001).
- **AppShell** (estrutura de layout pós-login): barra lateral de navegação (sidebar) e cabeçalho (topbar), reutilizáveis por todos os módulos futuros.
- Sidebar representando a navegação para os módulos do MVP definidos em `docs/03_ARCHITECTURE.md` (Seção 3), com apenas o item **Dashboard** ativo/navegável nesta sprint — os demais aparecem listados, porém desabilitados (ver Seção 7).
- Cabeçalho com saudação ao usuário autenticado, nome da Empresa e ação de logout (reaproveitando o fluxo de logout da Sprint 001).
- Área de conteúdo do Dashboard com cartões de resumo ("widgets") para as categorias de informação que `docs/03_ARCHITECTURE.md` atribui ao módulo (clientes, projetos, aprovações pendentes, relatórios recentes) — todos em **estado vazio explícito** nesta sprint, pois seus módulos de origem ainda não existem.
- Estados de carregamento (loading), vazio (empty) e erro (error) para cada seção com dependência de rede.
- Componentização reutilizável (cartão de resumo, estado vazio, item de navegação) para uso pelos módulos das próximas sprints.

---

## 4. Fora do escopo

- Qualquer dado real de Clientes, Projetos, Estado do Projeto, Tarefas, Landing Pages, Campanhas Google Ads, Analytics, Relatórios ou Insights — nenhum desses módulos existe ainda (`docs/07_ROADMAP.md`).
- Criação de qualquer entidade, coleção ou schema novo no banco de dados.
- Criação de módulos backend além do estritamente necessário para o Dashboard (ver Seção 10).
- Navegação funcional para Clientes, Projetos, Landing Pages, Google Ads, Analytics, Relatórios, Insights, Biblioteca, "Agentes IA", "Empresa" ou Configurações — esses itens existem apenas como referência visual desabilitada nesta sprint (ver Seção 7).
- Tela de chat com o StrategyAgent ("Assistente de IA", `docs/04_AI_ORCHESTRATION.md`) — pertence a uma sprint futura, quando o módulo IA for implementado.
- Qualquer tela de seleção direta de agentes especialistas (ClientAgent, KnowledgeAgent, LandingPageAgent, CopyAgent, GoogleAdsAgent, AnalyticsAgent, SEOAgent, ReportAgent, MemoryAgent) — proibido permanentemente, não apenas nesta sprint (`docs/04_AI_ORCHESTRATION.md`, Seção 7, princípio 8).
- Qualquer tela de gestão de múltiplas empresas (multi-tenant) — fora do MVP (`docs/03_ARCHITECTURE.md`, Seção 10; `docs/07_ROADMAP.md`).
- Módulo SEO — fora do MVP até a Versão 2.0 (`docs/03_ARCHITECTURE.md`, Seção 10).
- Módulo Usuários como item próprio de sidebar — não foi solicitado e não há decisão de produto registrada sobre onde ele deve viver na navegação; fica em aberto para uma sprint futura, não decidido aqui.
- Feed global de atividade entre projetos — `docs/05_DATABASE.md` define Histórico do Projeto como uma timeline **por projeto**, não uma entidade de atividade global; nenhuma entidade desse tipo está documentada, logo não é criada aqui.
- Responsividade mobile completa — os documentos de produto não estabelecem requisito específico de mobile; o layout deve ser funcional em resolução desktop, sem exigência de otimização mobile nesta sprint.

---

## 5. Funcionalidades

1. **Redirecionamento pós-login para `/dashboard`**, reaproveitando o fluxo de autenticação da Sprint 001.
2. **Saudação personalizada** com nome do usuário autenticado e nome da Empresa.
3. **AppShell** com sidebar (navegação) e topbar (identidade + logout), compartilhado por todos os módulos futuros.
4. **Cartões de resumo** para as categorias que `docs/03_ARCHITECTURE.md` associa ao Dashboard — Clientes, Projetos, Aprovações pendentes, Relatórios recentes — todos em estado vazio explícito, com texto claro indicando que o módulo correspondente ainda não foi implementado.
5. **Estados de carregamento, vazio e erro** tratados de forma explícita e visualmente distinta para qualquer chamada ao backend.
6. **Logout**, reaproveitando integralmente o mecanismo já validado na Sprint 001.

---

## 6. Fluxo do usuário

1. Usuário realiza login (Sprint 001) com sucesso.
2. Sistema redireciona para `/dashboard`.
3. `ProtectedRoute` valida a sessão (token JWT); se inválida ou expirada, redireciona para `/login` (comportamento já existente na Sprint 001, apenas reaproveitado).
4. Dashboard exibe estado de carregamento enquanto busca os dados do usuário/Empresa autenticados.
5. Ao concluir a busca:
   - Em caso de sucesso: exibe saudação com nome do usuário e nome da Empresa, sidebar com os módulos do MVP (apenas Dashboard ativo) e os cartões de resumo em estado vazio.
   - Em caso de falha de rede/servidor: exibe estado de erro na área correspondente, com opção de tentar novamente.
6. Usuário pode visualizar (mas não navegar para) os demais módulos listados na sidebar, todos marcados como indisponíveis nesta sprint.
7. Usuário pode encerrar a sessão a qualquer momento pelo menu do cabeçalho (logout).

---

## 7. Layout e estrutura da interface

### 7.1 Estrutura geral (AppShell)

```
┌─────────────────────────────────────────────────────────────┐
│  Topbar: [Logo MarketingAI]      [Nome do usuário ▾ Logout]  │
├───────────────┬─────────────────────────────────────────────┤
│               │  Dashboard                                   │
│  Sidebar      │  Olá, {nome do usuário} — {nome da Empresa}  │
│               │                                               │
│  ● Dashboard  │  ┌───────────────┐  ┌───────────────┐        │
│  ○ Clientes   │  │ Clientes      │  │ Projetos      │        │
│  ○ Projetos   │  │ ativos        │  │ em andamento  │        │
│  ○ Landing    │  │ (estado vazio)│  │ (estado vazio)│        │
│    Pages      │  └───────────────┘  └───────────────┘        │
│  ○ Google Ads │                                               │
│  ○ Analytics  │  ┌───────────────┐  ┌───────────────┐        │
│  ○ Relatórios │  │ Aprovações    │  │ Relatórios    │        │
│  ○ Insights   │  │ pendentes     │  │ recentes      │        │
│  ○ Biblioteca │  │ (estado vazio)│  │ (estado vazio)│        │
│  ○ Agentes IA │  └───────────────┘  └───────────────┘        │
│  ○ Empresa    │                                               │
│  ○ Config.    │                                               │
└───────────────┴─────────────────────────────────────────────┘
● = ativo/navegável nesta sprint   ○ = visível, porém desabilitado
```

### 7.2 Itens da sidebar

A sidebar reflete os módulos funcionais do MVP definidos em `docs/03_ARCHITECTURE.md` (Seção 3), seguindo a mesma ordem de organização de módulos ali definida. O módulo SEO é omitido (fora do MVP até a Versão 2.0).

| Item na sidebar | Módulo correspondente (docs) | Estado nesta sprint |
|---|---|---|
| Dashboard | Dashboard | Ativo |
| Clientes | Clientes | Desabilitado |
| Projetos | Projetos | Desabilitado |
| Landing Pages | Landing Pages | Desabilitado |
| Google Ads | Google Ads | Desabilitado |
| Analytics | Analytics | Desabilitado |
| Relatórios | Relatórios | Desabilitado |
| Insights | Insights | Desabilitado |
| Biblioteca | Biblioteca | Desabilitado |
| Agentes IA | IA | Desabilitado |
| Empresa | Empresa (entidade, `docs/05_DATABASE.md`) | Desabilitado |
| Configurações | Configurações | Desabilitado |

Itens desabilitados são exibidos (não ocultos) para comunicar o roadmap do produto ao usuário, mas não possuem rota nem ação de clique nesta sprint — não há criação de páginas "em construção" por módulo, para evitar esforço especulativo (`docs/00_PRODUCT_BLUEPRINT.md`, princípio de simplicidade deliberada). Um único indicador visual genérico (ex.: rótulo "em breve") é suficiente.

> **Nota de arquitetura — item "Empresa" (não "Empresas").** O MVP é single-tenant: existe uma única Empresa no sistema (`docs/03_ARCHITECTURE.md`, Seção 9; `docs/05_DATABASE.md`). Por isso, o rótulo usado é **"Empresa"**, no singular — nunca "Empresas" — para não sugerir uma lista de múltiplas organizações. Quando implementado (fora desta sprint), esse item deve representar a configuração da Empresa única do sistema, nunca uma tela de gestão multiempresa.
>
> **Nota de arquitetura — item "Agentes IA".** Conforme `docs/04_AI_ORCHESTRATION.md`, o usuário nunca interage diretamente com um agente especialista (ClientAgent, KnowledgeAgent, LandingPageAgent, CopyAgent, GoogleAdsAgent, AnalyticsAgent, SEOAgent, ReportAgent, MemoryAgent) — o único ponto de contato é o StrategyAgent. Quando implementado (fora desta sprint), "Agentes IA" deve representar atividade, histórico, execução ou observabilidade da IA — nunca uma tela de seleção manual de especialista. Esta sprint não implementa esse módulo; a restrição é registrada aqui para orientar sprints futuras.

### 7.3 Cartões de resumo (widgets)

| Widget | Fonte de dado (quando existir) | Estado nesta sprint |
|---|---|---|
| Clientes ativos | Módulo Clientes | Estado vazio — módulo não implementado |
| Projetos em andamento | Módulo Projetos / Estado do Projeto | Estado vazio — módulo não implementado |
| Aprovações pendentes | Tarefa / Campanha Google Ads em rascunho (`docs/05_DATABASE.md`) | Estado vazio — módulo não implementado |
| Relatórios recentes | Módulo Relatórios | Estado vazio — módulo não implementado |

Insights não recebe um cartão dedicado nesta sprint: `docs/03_ARCHITECTURE.md` já trata Insights como módulo transversal de versão básica, e sem AnalyticsAgent/SEOAgent operando ainda não há Insight possível de existir — antecipar esse cartão seria estado vazio permanente sem propósito nesta sprint. Fica registrado como candidato natural a cartão quando o módulo Insights for implementado.

---

## 8. Componentes necessários

Nomenclatura alinhada a `docs/08_RULES.md` (nomes de domínio, não termos técnicos genéricos soltos). Nenhum componente abaixo implica lógica de negócio de outro módulo — apenas estrutura e apresentação.

**Layout (compartilhado entre módulos futuros):**
- `AppShell` — casca de layout pós-login (sidebar + topbar + área de conteúdo).
- `Sidebar` — navegação lateral com a lista de módulos do MVP.
- `SidebarNavItem` — item individual de navegação, com estado ativo/desabilitado.
- `Topbar` — cabeçalho com identidade do usuário/Empresa e ação de logout.
- `UserMenu` — menu do usuário autenticado (reaproveita sessão/logout da Sprint 001).

**Dashboard:**
- `DashboardPage` — página/rota `/dashboard`.
- `SummaryCard` — cartão de resumo reutilizável (título, valor ou estado vazio, ícone opcional).
- `EmptyState` — componente genérico reutilizável para comunicar ausência de dado, usado por qualquer módulo futuro.
- `LoadingState` — indicador de carregamento (skeleton ou spinner) reutilizável.
- `ErrorState` — indicador de erro reutilizável, com ação de nova tentativa.

Nenhum desses componentes deve conter lógica de negócio de Clientes, Projetos, Relatórios ou Insights — apenas renderizam o que recebem, respeitando a separação de responsabilidades de `docs/03_ARCHITECTURE.md` (Seção 7).

---

## 9. Dados necessários

Entidades já existentes, reaproveitadas nesta sprint (`docs/05_DATABASE.md`):

- **Usuário** — nome, e-mail, Empresa vinculada (para saudação e cabeçalho).
- **Empresa** — nome da Empresa (para saudação e cabeçalho).

Entidades referenciadas pela interface, mas **sem dado real disponível** nesta sprint (módulos correspondentes ainda não implementados): Cliente, Projeto, Estado do Projeto, Tarefa, Campanha Google Ads, Relatório, Insight IA. Nenhuma dessas entidades é consultada, mockada ou simulada — as seções que dependeriam delas exibem apenas estado vazio explícito, conforme instrução do usuário de não usar dados falsos como se fossem reais.

---

## 10. Integração com backend

- O Dashboard reaproveita a operação de autenticação/sessão já validada na Sprint 001. Assume-se que o domínio Autenticação/Usuários (`docs/06_API.md`) expõe — ou passa a expor, como extensão mínima e aditiva do que já existe — uma operação de **consulta ao usuário autenticado** (equivalente a "consultar usuário" em `docs/06_API.md`, domínio Usuários), retornando nome, e-mail e a Empresa vinculada. Esta é a única dependência de backend desta sprint.
- **Nenhum novo domínio de API é criado.** Não há endpoint de "resumo do dashboard" (ex.: agregação de contagem de clientes/projetos) nesta sprint, porque não existe dado real para agregar — criar essa agregação agora seria antecipar infraestrutura para módulos inexistentes, contrariando a simplicidade deliberada de `docs/00_PRODUCT_BLUEPRINT.md`. Os cartões de resumo (Seção 7.3) são renderizados em estado vazio diretamente no frontend, sem chamada de rede.
- Quando os módulos Clientes, Projetos, Relatórios e Insights forem implementados em sprints futuras, cada um deve expor sua própria operação de consulta (conforme seu domínio em `docs/06_API.md`), e o Dashboard passa a consumi-las de forma incremental e aditiva — nunca via um endpoint agregador construído antes da existência dos dados que agregaria.

---

## 11. Rotas/API necessárias

| Operação | Domínio (docs/06_API.md) | Situação nesta sprint |
|---|---|---|
| Consultar usuário autenticado (nome, e-mail, Empresa) | Usuários | Reaproveitada da Sprint 001; criada apenas se ainda não existir, como extensão mínima do domínio Usuários já definido |
| Encerrar sessão (logout) | Autenticação | Reaproveitada integralmente da Sprint 001 |

Nenhuma outra rota de API é necessária ou deve ser criada nesta sprint. Rotas de Clientes, Projetos, Relatórios e Insights pertencem a sprints futuras e não são antecipadas aqui.

Rota de frontend: `/dashboard` (protegida por `ProtectedRoute`).

---

## 12. Regras de negócio

- O Dashboard é acessível **somente** a usuários autenticados; sem sessão válida, o usuário é redirecionado para `/login` (regra já estabelecida na Sprint 001, apenas herdada).
- Nenhuma seção do Dashboard exibe número, contagem ou conteúdo fabricado. Toda seção sem dado real disponível exibe estado vazio explícito e compreensível.
- A sidebar deve refletir exatamente os módulos definidos em `docs/03_ARCHITECTURE.md` (Seção 3), com os nomes lá definidos — sem sinônimos ou abreviações não documentadas (`docs/08_RULES.md`, Convenções), exceto pelas duas adaptações de rótulo registradas e justificadas na Seção 7.2 deste documento (singular "Empresa"; "Agentes IA" mapeado ao módulo IA).
- Itens de sidebar sem módulo implementado permanecem visíveis, porém não navegáveis, nesta e em sprints futuras até que o módulo correspondente seja entregue.
- Nenhuma funcionalidade de seleção direta de agente especialista de IA é criada, mesmo que futura — restrição permanente herdada de `docs/04_AI_ORCHESTRATION.md`.
- O sistema permanece single-tenant: nenhuma tela, rótulo ou fluxo desta sprint sugere suporte a múltiplas Empresas.

---

## 13. Segurança e autenticação

- A rota `/dashboard` é protegida pelo mesmo mecanismo de `ProtectedRoute` validado na Sprint 001.
- Toda chamada ao backend feita pelo Dashboard inclui o token JWT da sessão ativa, seguindo o padrão já estabelecido.
- Expiração ou invalidade do JWT durante o uso do Dashboard segue o tratamento já implementado na Sprint 001 (redirecionamento para `/login`) — nenhum novo comportamento de expiração é criado aqui.
- Autorização é delimitada por propriedade (`docs/06_API.md`, Segurança): o usuário só pode ver dados da própria Empresa — nesta sprint, isso se aplica apenas aos dados de usuário/Empresa retornados pela consulta descrita na Seção 10.
- Nenhuma nova superfície de autenticação (login, recuperação de senha, etc.) é criada ou alterada nesta sprint.

---

## 14. Estrutura de arquivos esperada

Estrutura proposta, respeitando a organização por módulo já estabelecida na Sprint 0/1 (`frontend/src/features/`, `backend/src/modules/`) e descrita em `frontend/src/features/README.md` e `backend/src/modules/README.md`.

```
frontend/src/
├── components/
│   └── layout/
│       ├── AppShell.tsx
│       ├── Sidebar.tsx
│       ├── SidebarNavItem.tsx
│       ├── Topbar.tsx
│       └── UserMenu.tsx
│   └── ui/
│       ├── SummaryCard.tsx
│       ├── EmptyState.tsx
│       ├── LoadingState.tsx
│       └── ErrorState.tsx
├── features/
│   └── dashboard/
│       ├── DashboardPage.tsx
│       └── (hooks/serviços específicos do Dashboard, se necessário)
```

```
backend/src/
└── modules/
    └── users/            # extensão mínima, apenas se a consulta ao usuário
                            # autenticado (Seção 10) ainda não existir da Sprint 001
```

Nenhuma pasta nova é criada fora do padrão já estabelecido; `modules/dashboard/` no backend permanece vazio nesta sprint, pois não há lógica de negócio própria do Dashboard no servidor — apenas consumo de dado já exposto por Usuários.

---

## 15. Critérios de aceitação

- [ ] Usuário não autenticado que acessa `/dashboard` é redirecionado para `/login`.
- [ ] Usuário autenticado que faz login é redirecionado para `/dashboard`.
- [ ] O cabeçalho exibe o nome real do usuário autenticado e o nome real da Empresa, obtidos do backend — nunca valores fixos ou fictícios.
- [ ] Durante a busca de dados do usuário/Empresa, um estado de carregamento é exibido.
- [ ] Em caso de falha na busca, um estado de erro claro é exibido, com opção de nova tentativa.
- [ ] Os quatro cartões de resumo (Clientes, Projetos, Aprovações pendentes, Relatórios recentes) exibem estado vazio explícito, com texto compreensível ao usuário (não apenas "0").
- [ ] A sidebar lista todos os módulos do MVP definidos em `docs/03_ARCHITECTURE.md` (exceto SEO), na ordem de `docs/07_ROADMAP.md`.
- [ ] Apenas o item "Dashboard" da sidebar é navegável; os demais estão visivelmente desabilitados e não disparam navegação.
- [ ] O item de sidebar correspondente à Empresa está rotulado no singular ("Empresa").
- [ ] Nenhuma tela, componente ou rótulo permite selecionar diretamente um agente especialista de IA.
- [ ] O logout, acionado pelo menu do usuário, encerra a sessão e redireciona para `/login`, reaproveitando o comportamento validado na Sprint 001.
- [ ] Nenhum dado de Clientes, Projetos, Relatórios ou Insights é mockado, hardcoded ou simulado em qualquer camada (frontend ou backend).

---

## 16. Definition of Done

Conforme `docs/08_RULES.md` (Definition of Done), esta sprint só é considerada concluída quando, simultaneamente:

1. O Dashboard funciona conforme o objetivo descrito em `docs/03_ARCHITECTURE.md` (módulo Dashboard) e `docs/07_ROADMAP.md` (MVP).
2. Respeita a arquitetura vigente sem exceções não documentadas — nenhum módulo além de Usuários é tocado no backend; nenhuma entidade nova é criada.
3. Foi validado por revisão de código e pelos testes aplicáveis (renderização de estados vazio/loading/erro, proteção de rota, navegação restrita da sidebar).
4. Não introduz regressão na Autenticação validada na Sprint 001 (login, logout, expiração de JWT, `ProtectedRoute` continuam funcionando exatamente como antes).
5. Está documentada — este próprio documento é a referência; qualquer desvio de implementação em relação a ele deve ser refletido aqui como atualização consciente, conforme `docs/08_RULES.md`.
6. Foi entregue com o menor escopo necessário — sem páginas, endpoints ou entidades especulativas para módulos ainda não iniciados.

---

## 17. Dependências

- Sprint 001 — Autenticação, concluída e validada (login, logout, JWT, `ProtectedRoute`, persistência de sessão, entidades `User` e `Empresa`).
- Existência (ou criação mínima, como extensão do domínio Usuários já definido em `docs/06_API.md`) de uma operação de consulta ao usuário autenticado, incluindo nome da Empresa vinculada.
- **Sem dependência** dos módulos Clientes, Projetos, Landing Pages, Google Ads, Analytics, Relatórios, Insights, Biblioteca ou IA — todos tratados como não implementados, com estado vazio correspondente.

---

## 18. Resultado esperado

Ao final da Sprint 002, o usuário autenticado chega, após o login, a um Dashboard funcional e honesto: exibe uma saudação real (usuário e Empresa), uma estrutura de navegação (AppShell/sidebar) que já anuncia visualmente todos os módulos previstos no MVP — sem permitir acesso a nenhum deles ainda — e comunica de forma clara e explícita que os indicadores de Clientes, Projetos, Aprovações pendentes e Relatórios ainda não têm dado real disponível, em vez de simular esse dado.

O resultado entrega uma base sólida e reutilizável (AppShell, `SummaryCard`, `EmptyState`, `LoadingState`, `ErrorState`, padrão de sidebar) sobre a qual as próximas sprints — Clientes, Projetos e demais módulos do MVP — poderão ser construídas por extensão, sem retrabalho na camada de layout ou navegação, conforme o princípio de evolução sem reconstrução de `docs/03_ARCHITECTURE.md`.
