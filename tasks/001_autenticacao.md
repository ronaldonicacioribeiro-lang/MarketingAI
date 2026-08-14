# Sprint 001 — Autenticação

**Produto:** MarketingAI
**Documento:** Especificação Técnica de Sprint
**Sprint:** 001 — Autenticação
**Depende de:** Sprint 0 — Fundação técnica (concluída: estrutura de pastas NestJS/React, `ConfigModule`, `DatabaseModule` pronto porém não conectado)
**Base documental:** `PROJECT.md`, `README.md`, `docs/00_PRODUCT_BLUEPRINT.md`, `docs/01_VISION.md`, `docs/02_PRD.md`, `docs/03_ARCHITECTURE.md`, `docs/05_DATABASE.md`, `docs/06_API.md`, `docs/07_ROADMAP.md`, `docs/08_RULES.md`, `docs/09_TECH_STACK.md`
**Status:** Especificação — aguardando implementação (nenhum código de autenticação está presente neste repositório no momento)

> Este documento é uma especificação técnica. Ele não contém código, não altera backend, frontend ou banco de dados, e não deve ser interpretado como autorização para início de implementação até revisão e aprovação explícita. Ele formaliza, dentro deste repositório, o pré-requisito que `tasks/002_dashboard.md` já assume como "Sprint 001 — Autenticação (concluída e validada)" — os dois documentos devem ser lidos como uma sequência única e sem lacunas.

---

## 1. Objetivo

Especificar a fundação de autenticação do MarketingAI: cadastro do primeiro administrador, login, logout, sessão via JWT e proteção de rotas. Segundo `docs/03_ARCHITECTURE.md` (Seção 4), a camada de Autenticação/Usuários "é o portão de entrada de toda a plataforma — nenhum outro módulo é acessado sem uma sessão autenticada válida"; segundo `docs/07_ROADMAP.md`, é "o pré-requisito funcional de qualquer outra entrega — sem ele, nenhuma outra funcionalidade tem contexto de 'para quem' está sendo executada".

Esta sprint também precisa entregar, de forma explícita e sem ambiguidade, tudo o que `tasks/002_dashboard.md` já declara depender dela — em especial uma operação de consulta ao usuário autenticado (Seção 10 e 17 daquele documento) — para que a sequência 001 → 002 não deixe nenhuma lacuna a ser resolvida improvisadamente durante a implementação do Dashboard.

---

## 2. Contexto

`docs/07_ROADMAP.md` define a ordem de evolução do MVP como **Login → Dashboard → Clientes → Projetos → Templates → Landing Pages → Google Ads → Assistente de IA → Biblioteca → Relatórios → Analytics → Insights**. A Sprint 001 corresponde ao primeiro item dessa lista, e é descrita ali como o "pré-requisito funcional de qualquer outra entrega".

`docs/03_ARCHITECTURE.md` (Seção 4) descreve as duas responsabilidades envolvidas nesta sprint como módulos distintos, ainda que trabalhem em conjunto:

- **Autenticação** — "responsável por validar a identidade de quem acessa o sistema e manter a sessão do usuário".
- **Usuários** — "responsável pelo cadastro, atualização e gestão das pessoas que operam a plataforma dentro de uma Empresa (...) trata de uma responsabilidade distinta: quem a pessoa é e o que pode fazer, não a validação da sessão em si".

Este documento é escrito depois de uma investigação que confirmou que o código desta sprint — embora já tenha sido implementado e validado anteriormente (primeiro login realizado com sucesso, conexão com MongoDB Atlas confirmada) — não está presente neste repositório Git (nenhuma branch, commit, stash ou clone local o contém). Esta especificação existe, portanto, para que a (re)implementação siga um contrato único e explícito, e não decisões improvisadas — coerente com `docs/08_RULES.md`: "Nenhuma decisão de código deve forçar uma reinterpretação da arquitetura (...) a mudança é discutida e aprovada conscientemente no documento (...) primeiro — não decidida silenciosamente no código."

---

## 3. Escopo

Fazem parte desta sprint:

- Entidades **Usuário** e **Empresa** (Mongoose), conforme `docs/05_DATABASE.md`.
- Conexão real do backend ao MongoDB Atlas, através de `MONGODB_URI` (o `DatabaseModule` já existe desde a Sprint 0 e passa a ser conectado a `AppModule` nesta sprint).
- Fluxo de criação do **primeiro administrador** (bootstrap): cria a Empresa única do sistema (se ainda não existir) e o primeiro Usuário administrador vinculado a ela.
- **Login** por e-mail e senha, com emissão de um token **JWT** contendo o mínimo necessário para identificar o usuário.
- Expiração configurável do JWT.
- Hash de senha com **bcrypt** — a senha nunca é armazenada em texto puro.
- Proteção de rotas no backend (guard de autenticação) e no frontend (`ProtectedRoute`).
- **Logout** no frontend (remoção da sessão local).
- Persistência da sessão no frontend entre recarregamentos de página.
- Uma operação de **consulta ao usuário autenticado** (nome, e-mail, Empresa vinculada), no domínio Usuários de `docs/06_API.md` — pré-requisito explícito de `tasks/002_dashboard.md`.
- Tratamento uniforme de erros de autenticação, sem revelar se uma conta existe ou não (`docs/06_API.md`, domínio Autenticação).
- Telas de **Login** e de **configuração do primeiro administrador**.

---

## 4. Fora do escopo

- **CRUD completo de Empresa.** Nenhuma tela de gestão, edição, listagem ou seleção de Empresa. O MVP é single-tenant (`docs/03_ARCHITECTURE.md`, Seção 9): existe uma única Empresa, criada automaticamente no bootstrap do primeiro administrador.
- **CRUD completo de Usuários.** `docs/06_API.md` (domínio Usuários) descreve, a longo prazo, "cadastrar usuário; atualizar perfil; consultar usuário; desativar usuário" — esta sprint entrega apenas a criação do primeiro administrador e a consulta ao usuário autenticado. Cadastro de novos usuários além do primeiro, edição de perfil e desativação ficam para uma sprint futura, ainda não definida no roadmap.
- **Recuperação/redefinição de credencial.** `docs/06_API.md` lista "solicitar recuperação de acesso; redefinir credencial de acesso" como operações do domínio Autenticação, mas nenhum dos dois documentos de origem (contexto original desta sprint, nem `docs/07_ROADMAP.md`) exige essa capacidade para o MVP inicial. Fica registrada aqui como lacuna documentada, não como omissão silenciosa — a ser retomada quando houver necessidade real validada.
- **Revogação/blacklist de JWT no servidor.** O logout desta sprint é inteiramente client-side (remoção do token local); nenhuma infraestrutura de invalidação server-side de tokens ainda válidos é criada.
- **Qualquer módulo além de Autenticação/Usuários** — Dashboard (`tasks/002_dashboard.md`), Clientes, Projetos, Landing Pages, Google Ads, Analytics, Relatórios, Insights, Biblioteca, IA, Configurações. Nenhuma tela, endpoint ou schema desses módulos é criado nesta sprint.
- **Multiempresa (multi-tenant).** Fora do MVP (`docs/03_ARCHITECTURE.md`, Seção 10).
- **Seleção direta de agentes de IA** ou qualquer funcionalidade de `docs/04_AI_ORCHESTRATION.md` — não há superfície de IA nesta sprint.

---

## 5. Funcionalidades

1. **Cadastro do primeiro administrador** — cria a Empresa única (se ainda não existir) e o primeiro Usuário, com papel de administrador.
2. **Bloqueio do bootstrap após o primeiro administrador** — uma segunda tentativa de criar "o primeiro administrador" é rejeitada.
3. **Login** com e-mail e senha, retornando um JWT válido em caso de sucesso.
4. **Logout**, removendo a sessão local e retornando o usuário ao estado não autenticado.
5. **Persistência de sessão** — a aplicação restaura o estado autenticado automaticamente ao recarregar a página, enquanto o token continuar válido.
6. **Proteção de rotas** — no backend, por um guard que valida o JWT; no frontend, pelo componente `ProtectedRoute`.
7. **Consulta ao usuário autenticado** — retorna nome, e-mail e Empresa vinculada, sem nunca expor a senha (hash ou não).
8. **Tratamento de erros de autenticação** — mensagens claras para o usuário, sem revelar detalhes que comprometam a segurança (ex.: se um e-mail está ou não cadastrado).

---

## 6. Fluxo do usuário

### 6.1 Primeiro acesso (bootstrap do administrador)
1. Usuário acessa `/first-admin`.
2. Preenche nome, e-mail, senha e confirmação de senha.
3. Sistema valida os dados e verifica se já existe um administrador.
4. Se não existir: cria a Empresa única (caso ainda não exista) e o primeiro Usuário administrador, com senha já em hash.
5. Sistema confirma a criação e direciona o usuário para `/login`.
6. Se já existir um administrador: a tentativa é rejeitada com uma mensagem clara, orientando o usuário a ir para `/login`.

### 6.2 Login
1. Usuário acessa `/login` e informa e-mail e senha.
2. Sistema valida a entrada, busca o usuário pelo e-mail e compara a senha com o hash armazenado.
3. Se inválido (e-mail inexistente ou senha incorreta): mensagem de erro genérica, idêntica nos dois casos.
4. Se válido: sistema emite o JWT, o frontend persiste a sessão localmente e o usuário é direcionado à área autenticada.

### 6.3 Sessão contínua
1. A cada carregamento da aplicação, o frontend verifica se existe uma sessão persistida.
2. Se existir e o token ainda for válido: a sessão é restaurada automaticamente, sem exigir novo login.
3. Se o token estiver ausente, inválido ou expirado: o usuário permanece/retorna ao estado não autenticado e qualquer tentativa de acessar uma rota protegida redireciona para `/login`.
4. Usuário pode encerrar a sessão a qualquer momento (logout), retornando ao estado não autenticado.

---

## 7. Layout e estrutura da interface

### 7.1 `/login`

```
┌───────────────────────────────────────┐
│              MarketingAI               │
│                                         │
│   E-mail:     [____________________]   │
│   Senha:      [____________________]   │
│                                         │
│              [   Entrar   ]            │
│                                         │
│   (mensagem de erro, quando houver)    │
└───────────────────────────────────────┘
```

Tela simples, funcional e profissional: campos de e-mail e senha, ação de entrar, área de mensagem de erro. Sem elementos de outros módulos (sem sidebar — a `AppShell` pertence à Sprint 002).

### 7.2 `/first-admin`

```
┌───────────────────────────────────────┐
│      Configurar primeiro acesso        │
│                                         │
│   Nome:            [________________]  │
│   E-mail:          [________________]  │
│   Senha:           [________________]  │
│   Confirmar senha: [________________]  │
│                                         │
│         [ Criar administrador ]        │
│                                         │
│   (mensagem de erro, quando houver)    │
└───────────────────────────────────────┘
```

Acessível apenas enquanto nenhum administrador existir. Após o sucesso, a tela conduz o usuário para `/login` (não faz login automático — mantém a etapa de login como um passo explícito e auditável).

### 7.3 Área autenticada (placeholder desta sprint)

`docs/03_ARCHITECTURE.md` descreve o Dashboard como o destino do usuário após o login — mas o Dashboard é objeto de `tasks/002_dashboard.md`, não desta sprint. Para que `ProtectedRoute`, a sessão e o logout sejam demonstráveis de ponta a ponta sem antecipar a Sprint 002, esta sprint entrega uma **tela autenticada mínima e temporária** (ex.: confirmação de que o login funcionou, nome do usuário e botão de logout), explicitamente marcada como provisória e destinada a ser **totalmente substituída** pela implementação de `tasks/002_dashboard.md` — nunca uma versão parcial do Dashboard real.

---

## 8. Componentes necessários

Nomenclatura alinhada a `docs/08_RULES.md` (nomes de domínio, sem sinônimos).

**Frontend (`frontend/src/features/auth/`):**
- `LoginPage` — tela de login.
- `FirstAdminSetupPage` — tela de bootstrap do primeiro administrador.
- `AuthContext` — contexto React responsável por usuário atual, estado de autenticação, login, logout e restauração de sessão.
- `useAuth` — hook de acesso ao `AuthContext`, para não duplicar lógica de autenticação em cada página.
- `ProtectedRoute` — componente de proteção de rota, reutilizável por qualquer módulo futuro.
- `authApi` — camada única de chamadas HTTP ao domínio de autenticação/usuários (nenhuma chamada Axios solta em página).

**Frontend (compartilhado, `frontend/src/lib/`):**
- `apiClient` — instância única do Axios, configurada com `VITE_API_BASE_URL` (já presente em `frontend/.env.example` desde a Sprint 0), reutilizável por todos os módulos futuros.

**Backend (`backend/src/modules/auth/`):**
- `AuthModule`, `AuthController`, `AuthService`.
- `JwtAuthGuard` — guard de proteção de rotas.
- `CurrentUser` — decorator para expor o usuário autenticado aos controllers/services.
- DTOs: `FirstAdminDto`, `LoginDto` (validados com `class-validator`/`class-transformer`).

**Backend (`backend/src/modules/users/`):**
- `UsersModule`, `UsersService`.
- `UsersController` — expõe apenas a consulta ao usuário autenticado nesta sprint (Seção 11).
- `User` schema (Mongoose).

Nenhum desses componentes deve conter lógica de negócio de outro módulo — `AuthService` cuida de identidade/sessão; `UsersService` cuida de dados de usuário/Empresa, conforme a separação já definida em `docs/03_ARCHITECTURE.md` (Seção 4).

---

## 9. Dados necessários

Entidades conforme `docs/05_DATABASE.md`:

### Usuário
> "Ser o ponto de autoria de decisões humanas — aprovações, ajustes de objetivo, criação de clientes e projetos (...) Pertence a uma Empresa."

Campos conceituais necessários nesta sprint: `_id`, `name`, `email` (único), `passwordHash` (nunca em texto puro; projeção `select: false` por padrão), `role` (nesta sprint, um único valor possível — administrador —, extensível sem redesenho quando outros papéis forem justificados por uma sprint futura), `empresaId` (referência à Empresa), `createdAt`, `updatedAt`.

### Empresa
> "Ser o limite de contexto e propriedade de todos os dados operacionais do sistema (...) hoje existe uma única Empresa em operação, conforme decisão de MVP registrada em `03_ARCHITECTURE.md`."

Campos conceituais necessários nesta sprint: `_id`, `name`, `createdAt`, `updatedAt`. Nenhum outro campo é criado especulativamente — quando a tela "Empresa" da sidebar (hoje desabilitada, `tasks/002_dashboard.md`, Seção 7.2) for implementada, novos campos serão decididos conscientemente naquela sprint, não antecipados aqui.

> **Nota de arquitetura — onde vive o schema de Empresa.** `docs/03_ARCHITECTURE.md` (Seção 3) define treze módulos funcionais para o MVP; "Empresa" não é um deles — é uma **entidade** (`docs/05_DATABASE.md`), não um módulo com responsabilidade própria. Por isso, o schema `Empresa` vive dentro do módulo **Usuários** (`backend/src/modules/users/schemas/empresa.schema.ts`), sem `EmpresaController`, `EmpresaService` ou `EmpresaModule` dedicados — apenas o schema, usado internamente pelo bootstrap do primeiro administrador. Essa decisão evita criar um módulo backend fora da lista fechada de `03_ARCHITECTURE.md` (Seção 3) e do padrão de pastas já existente desde a Sprint 0. Se, em uma sprint futura, "Empresa" precisar de operações próprias (edição do nome da Empresa, por exemplo), essa mudança deve ser refletida conscientemente em `docs/03_ARCHITECTURE.md` primeiro, conforme `docs/08_RULES.md`.

---

## 10. Integração com backend

O frontend concentra toda comunicação HTTP em `apiClient` (Axios, `baseURL` = `VITE_API_BASE_URL`) e `authApi` (camada específica do domínio de autenticação/usuários), nunca chamadas soltas dentro das páginas.

Fluxo de integração:
- `FirstAdminSetupPage` chama `authApi` para `POST /auth/first-admin`.
- `LoginPage` chama `authApi` para `POST /auth/login`; em caso de sucesso, `AuthContext` armazena o token retornado e persiste a sessão localmente.
- Ao iniciar a aplicação, `AuthContext` verifica se existe uma sessão persistida; se existir, chama `authApi` para `GET /users/me` para validar o token e obter os dados atuais do usuário/Empresa — se a chamada falhar (token inválido/expirado), a sessão local é descartada e o usuário permanece não autenticado.
- Toda chamada subsequente a uma rota protegida inclui o JWT no cabeçalho de autorização.
- Logout limpa o token local — nenhuma chamada ao backend é necessária para esta operação (Seção 4).

Esta é a mesma operação de "consulta ao usuário autenticado" que `tasks/002_dashboard.md` (Seções 10, 11 e 17) declara como sua única dependência de backend — esta sprint a entrega de forma definitiva, não apenas como possibilidade condicional.

---

## 11. Rotas/API necessárias

Conforme `docs/06_API.md`, que separa o domínio **Autenticação** ("validar identidade, manter sessão") do domínio **Usuários** ("gerenciar as pessoas que operam a plataforma"):

| Operação | Domínio (`docs/06_API.md`) | Rota | Regra |
|---|---|---|---|
| Criar o primeiro administrador | Autenticação (bootstrap) | `POST /auth/first-admin` | Só é aceita enquanto nenhum administrador existir; cria Empresa (se necessário) + Usuário |
| Autenticar usuário | Autenticação | `POST /auth/login` | Retorna JWT; erro genérico se e-mail ou senha inválidos |
| Consultar usuário autenticado | Usuários | `GET /users/me` | Requer JWT válido; retorna nome, e-mail e Empresa; nunca retorna `passwordHash` |

Encerrar sessão (**logout**) não gera uma rota de backend nesta sprint — é uma operação inteiramente client-side (Seção 4), consistente com `docs/06_API.md` ao descrever "encerrar sessão" como responsabilidade do domínio Autenticação sem, no entanto, exigir estado server-side para isso no nível atual de maturidade do produto.

"Solicitar recuperação de acesso" e "redefinir credencial de acesso" (`docs/06_API.md`, domínio Autenticação) **não são implementadas nesta sprint** — ver Seção 4.

Rotas de frontend: `/first-admin`, `/login`, e uma rota autenticada mínima (placeholder da Seção 7.3), todas fora do prefixo reservado a `/dashboard` (Sprint 002).

---

## 12. Regras de negócio

- Existe exatamente **um** administrador criado pelo fluxo de bootstrap; uma segunda tentativa de `POST /auth/first-admin` é sempre rejeitada, independentemente de quem a solicita.
- A senha nunca é armazenada, logada ou retornada em texto puro — apenas o hash gerado por bcrypt é persistido.
- Nenhuma resposta de API retorna `passwordHash`, em nenhuma circunstância.
- Falhas de autenticação (e-mail inexistente ou senha incorreta) retornam a **mesma** mensagem genérica, para não revelar se uma conta existe — princípio explícito de `docs/06_API.md`: "Falhas de autenticação nunca revelam se uma conta existe ou não, por princípio de segurança."
- Todo usuário pertence a exatamente uma Empresa (`docs/06_API.md`, domínio Usuários) — nesta sprint, sempre a Empresa única criada no bootstrap.
- Toda operação além de `POST /auth/first-admin` e `POST /auth/login` exige um JWT válido.
- O sistema permanece single-tenant: não há tela, endpoint ou campo que permita criar, listar ou selecionar mais de uma Empresa.

---

## 13. Segurança e autenticação

- **Hash de senha:** bcrypt, nunca texto puro, conforme Seção 5/17 do contexto original desta sprint e `docs/08_RULES.md` (Segurança).
- **JWT:** assinado com um segredo lido de variável de ambiente (`JWT_SECRET`, nunca hardcoded); expiração configurável por variável de ambiente (`JWT_EXPIRES_IN`), com um valor padrão razoável para desenvolvimento.
- **Validação do token:** feita inteiramente pelo mecanismo nativo do NestJS para JWT (sem introduzir Passport ou bibliotecas adicionais de estratégia de autenticação) — decisão já registrada para esta sprint, mantendo a stack backend restrita ao que `docs/09_TECH_STACK.md` já define (NestJS, TypeScript, Mongoose) mais o mínimo necessário para autenticação.
- **Sem revogação server-side:** um JWT emitido continua válido até expirar; não há blacklist nesta sprint (Seção 4).
- **CORS:** restrito à origem configurada do frontend, nunca aberto irrestritamente.
- **Guard de rotas:** todo endpoint além de `POST /auth/first-admin` e `POST /auth/login` exige JWT válido, verificado antes de qualquer lógica de negócio do controller.
- **Segredos:** `JWT_SECRET` e `MONGODB_URI` reais nunca são commitados — apenas placeholders vazios em `.env.example`, conforme já estabelecido na Sprint 0 (`.gitignore` já exclui `.env`).

---

## 14. Estrutura de arquivos esperada

```
backend/src/modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   ├── first-admin.dto.ts
│   └── login.dto.ts
├── guards/
│   └── jwt-auth.guard.ts
├── decorators/
│   └── current-user.decorator.ts
└── interfaces/
    └── jwt-payload.interface.ts

backend/src/modules/users/
├── users.module.ts
├── users.service.ts
├── users.controller.ts        # apenas GET /users/me nesta sprint
└── schemas/
    ├── user.schema.ts
    └── empresa.schema.ts       # ver Nota de arquitetura, Seção 9
```

```
frontend/src/features/auth/
├── pages/
│   ├── LoginPage.tsx
│   └── FirstAdminSetupPage.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── components/
│   └── ProtectedRoute.tsx
├── api/
│   └── authApi.ts
└── types.ts

frontend/src/lib/
└── apiClient.ts
```

Arquivos existentes da Sprint 0 que esta sprint precisa alterar (nenhum reescrito do zero): `backend/src/app.module.ts` (importar `DatabaseModule`, `AuthModule`, `UsersModule`), `backend/src/main.ts` (validação global de DTOs e CORS), `backend/.env.example` (adicionar `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`), `frontend/src/App.tsx` (rotas de `/first-admin`, `/login` e a área autenticada mínima da Seção 7.3).

---

## 15. Critérios de aceitação

- [ ] O primeiro administrador pode ser criado quando não existe nenhum administrador no sistema.
- [ ] Uma segunda tentativa de criar "o primeiro administrador" é rejeitada com uma mensagem clara.
- [ ] A senha é armazenada apenas como hash (bcrypt) — nunca em texto puro, em nenhuma camada.
- [ ] Login com credenciais válidas retorna um JWT.
- [ ] Login com credenciais inválidas (e-mail inexistente ou senha incorreta) retorna a mesma mensagem de erro genérica nos dois casos.
- [ ] O JWT possui expiração configurável e deixa de ser aceito após expirar.
- [ ] Uma requisição a uma rota protegida sem JWT é rejeitada.
- [ ] Uma requisição a uma rota protegida com JWT inválido ou expirado é rejeitada.
- [ ] `GET /users/me` retorna nome, e-mail e Empresa do usuário autenticado — nunca o hash de senha.
- [ ] `ProtectedRoute` redireciona um usuário não autenticado para `/login`.
- [ ] A sessão é restaurada automaticamente ao recarregar a página, enquanto o token permanecer válido.
- [ ] O logout remove a sessão local e retorna o usuário ao estado não autenticado.
- [ ] O backend conecta ao MongoDB Atlas exclusivamente através de `MONGODB_URI` — nenhuma string de conexão hardcoded no código.
- [ ] Nenhum segredo real (`.env` real, chave JWT, string de conexão real) é commitado ao Git.
- [ ] Nenhum dado de usuário ou Empresa é mockado, hardcoded ou fabricado em qualquer tela ou resposta de API.

---

## 16. Definition of Done

Conforme `docs/08_RULES.md` (Definition of Done), esta sprint só é considerada concluída quando, simultaneamente:

1. Funciona conforme o objetivo descrito em `docs/03_ARCHITECTURE.md` (módulos Autenticação e Usuários) e `docs/07_ROADMAP.md` (item "Login" do MVP).
2. Respeita a arquitetura vigente sem exceções não documentadas — inclusive a decisão registrada na Seção 9 sobre onde vive o schema de Empresa.
3. Foi validada por revisão de código e pelos testes aplicáveis (criação do primeiro administrador, bloqueio do segundo, login válido/inválido, expiração de JWT, acesso protegido com e sem token válido).
4. Não introduz regressão em nada que a Sprint 0 já entregava (estrutura de pastas, `ConfigModule`, build limpo do frontend e do backend).
5. Está documentada — este próprio documento é a referência; qualquer desvio de implementação em relação a ele deve ser refletido aqui como atualização consciente.
6. Foi entregue com o menor escopo necessário — sem CRUD de Empresa, sem CRUD de Usuários além do bootstrap, sem recuperação de senha, sem nada da Sprint 002 em diante.

---

## 17. Dependências

- Sprint 0 — Fundação técnica, concluída (estrutura NestJS/React, `ConfigModule`, `DatabaseModule` já implementado e pronto para ser conectado).
- Cluster MongoDB Atlas já criado pelo usuário — esta sprint apenas conecta a ele via `MONGODB_URI`; não cria nem altera o cluster.
- **Sem dependência** de Dashboard, Clientes, Projetos ou qualquer outro módulo — esta sprint é, ela própria, a dependência de todos os demais.

---

## 18. Resultado esperado

Ao final da Sprint 001, o MarketingAI tem uma fundação de autenticação completa e verificável dentro deste repositório: é possível criar o primeiro administrador, fazer login, receber e usar um JWT com expiração, ter rotas protegidas tanto no backend quanto no frontend, persistir e encerrar a sessão, e consultar os dados do usuário autenticado (nome, e-mail, Empresa) através de `GET /users/me`.

Esse resultado satisfaz, de forma explícita e sem lacunas, tudo o que `tasks/002_dashboard.md` já assume como pré-requisito — em particular a operação de consulta ao usuário autenticado (Seções 10, 11 e 17 daquele documento) e o mecanismo `ProtectedRoute` (Seções 6 e 13 daquele documento) — permitindo que a Sprint 002 seja retomada imediatamente após esta sprint ser validada, sem necessidade de decisões adicionais sobre autenticação.
