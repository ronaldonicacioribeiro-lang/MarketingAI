# 09 — Stack Técnica Oficial

**Produto:** MarketingAI
**Documento:** Decisão de Stack Técnica
**Base:** `03_ARCHITECTURE.md`, `05_DATABASE.md`, `06_API.md`, `08_RULES.md`
**Status:** Fundacional

> Este é o primeiro documento da hierarquia `docs/` que define tecnologia concreta. Os documentos `00` a `08` foram deliberadamente escritos sem tecnologia para que a arquitetura funcional, o modelo de dados e as regras de negócio fossem decididos antes de qualquer escolha de ferramenta — conforme `08_RULES.md`, Seção "Filosofia de Desenvolvimento": *"arquitetura orienta a implementação, nunca o contrário"*. Este documento registra a decisão consciente de stack, feita depois — e em conformidade com — toda a fundação funcional já estabelecida.

---

## Stack Oficial

### Frontend
- **React** — biblioteca de interface.
- **Vite** — build tool e servidor de desenvolvimento.
- **TypeScript** — tipagem estática.
- **Tailwind CSS** — estilização utilitária.

### Backend
- **NestJS** — framework de aplicação backend.
- **TypeScript** — tipagem estática, consistente com o frontend.
- **Mongoose** — camada de modelagem de dados sobre MongoDB.

### Banco de Dados
- **MongoDB Atlas (Free Tier)** — banco de dados de documentos, hospedado.

### Controle de Versão
- **Git.**

---

## Impacto no Modelo de Dados (`05_DATABASE.md`)

`05_DATABASE.md` modela o domínio de dados do MarketingAI de forma conceitual, independente de tecnologia. Com a escolha do MongoDB, essa modelagem se traduz da seguinte forma, sem alterar nenhuma entidade ou relacionamento já definido:

- Cada **entidade de domínio** (Usuário, Empresa, Cliente, Projeto, Landing Page, etc.) se torna uma **coleção** MongoDB — não uma tabela.
- Relações do tipo **"pertence a"** (ex.: Projeto pertence a um Cliente) são implementadas como **referências** (`ObjectId`) entre documentos, mantendo cada entidade em sua própria coleção — preservando a fonte única de verdade por entidade, conforme a Seção "Relacionamentos" de `05_DATABASE.md`.
- Estruturas que são sempre lidas e escritas junto com sua entidade "dona" e não têm ciclo de vida próprio (ex.: os campos de um Grupo de Anúncios dentro de uma Campanha, quando fizer sentido no detalhamento técnico futuro) podem ser candidatas a **documentos embutidos** — essa decisão é de modelagem física e será tomada quando os schemas Mongoose forem efetivamente implementados, não neste documento.
- **Log IA** e **Histórico do Projeto**, por natureza de append-only e alto volume, são bons candidatos a coleções otimizadas para escrita sequencial — decisão também de implementação futura.
- Nenhuma entidade descrita em `05_DATABASE.md` deixa de existir ou muda de responsabilidade por conta da tecnologia escolhida — o MongoDB é o meio de persistência, não uma redefinição do domínio.

A definição de schemas Mongoose, índices e a estratégia exata de referência vs. embutimento por entidade é trabalho de implementação e será feita a partir da Sprint 1 em diante, módulo a módulo — nunca antecipada especulativamente, conforme o princípio de simplicidade de `00_PRODUCT_BLUEPRINT.md`.

---

## Regras de Uso da Stack

- Nenhuma tecnologia fora desta lista é introduzida sem que este documento seja atualizado conscientemente primeiro, conforme `08_RULES.md`.
- MongoDB Atlas Free Tier é a instância de banco de dados válida até que uma decisão consciente de upgrade seja registrada aqui.
- A stack aqui definida vale para toda a Sprint 0 e as sprints seguintes, salvo revisão explícita deste documento.
