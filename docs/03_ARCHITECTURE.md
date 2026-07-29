# 03 — Arquitetura Funcional

**Produto:** MarketingAI
**Documento:** Arquitetura Funcional do Sistema
**Base:** `00_PRODUCT_BLUEPRINT.md`, `01_VISION.md`, `02_PRD.md`
**Status:** Fundacional

> Este documento descreve **como o sistema se organiza funcionalmente**, não com que tecnologia é construído. Toda decisão aqui descrita deve estar subordinada aos princípios definidos em `00_PRODUCT_BLUEPRINT.md`. Detalhes de stack, frameworks, linguagens, banco de dados e definição individual de agentes de IA são propositalmente deixados para documentos futuros (`04_AI_ORCHESTRATION.md`, `05_DATABASE.md`, `06_API.md`).

---

## 1. Objetivos da Arquitetura

- Suportar o MVP definido em `02_PRD.md` com foco em **produtividade e qualidade de execução**, não em suportar múltiplas empresas simultaneamente.
- Garantir que cada módulo do sistema tenha responsabilidade clara e isolada, evitando acoplamento desnecessário entre áreas funcionais distintas.
- Permitir que a Inteligência Artificial atue como camada de apoio a praticamente todos os módulos, sem se tornar um módulo monolítico e opaco.
- Preservar, desde o MVP, uma trajetória de evolução plausível para uma arquitetura multiempresa, sem forçar hoje uma complexidade que o estágio atual do produto não justifica.
- Manter todo fluxo relevante — especialmente os que envolvem publicação externa de campanhas — sob controle e aprovação humana, conforme os princípios inquebráveis do Product Blueprint.
- Produzir uma base compreensível o suficiente para que qualquer novo desenvolvedor do time entenda, em poucos minutos, onde cada responsabilidade do sistema vive.

---

## 2. Princípios Arquiteturais

1. **Módulos com responsabilidade única.** Cada módulo resolve um domínio funcional bem definido. Um módulo que absorve responsabilidades de outro é considerado erro de design.
2. **IA como camada de apoio, não como módulo isolado do restante do sistema.** A Inteligência Artificial atravessa os módulos funcionais, mas cada módulo continua responsável por seu próprio domínio.
3. **Aprovação humana antes de qualquer publicação externa.** Nenhuma ação que produza efeito fora da plataforma (ex.: publicação de campanha) ocorre sem revisão e aprovação explícita do usuário.
4. **Simplicidade proporcional ao estágio do produto.** A arquitetura do MVP é desenhada para uma única empresa operando internamente — não para multiempresa — evitando complexidade especulativa.
5. **Separação entre geração e publicação.** Sempre que a IA gera um artefato com efeito externo (campanha, conteúdo publicado), a geração e a publicação são etapas distintas e desacopladas.
6. **Rastreabilidade de ponta a ponta.** Toda saída relevante de um módulo deve poder ser associada à sua origem (cliente, projeto, objetivo) e ao momento em que foi produzida.
7. **Evolução sem reconstrução.** As fronteiras entre módulos são desenhadas para permitir crescimento futuro (ex.: multiempresa) por extensão, não por reescrita.

---

## 3. Organização em Módulos

O MarketingAI é organizado nos seguintes módulos funcionais:

1. **Autenticação**
2. **Usuários**
3. **Dashboard**
4. **Clientes**
5. **Projetos**
6. **Landing Pages**
7. **Google Ads**
8. **Analytics**
9. **Relatórios**
10. **Insights**
11. **Biblioteca**
12. **IA**
13. **Configurações**

Esses módulos representam domínios funcionais do sistema, não necessariamente componentes técnicos isolados. Autenticação e Usuários formam a camada de acesso que precede toda navegação — nenhum outro módulo é alcançável sem passar por eles antes. A relação entre os módulos de produção é ilustrada de forma simplificada a seguir:

```
                    ┌────────────────────────┐
                    │ Autenticação · Usuários │  (camada de acesso)
                    └────────────┬────────────┘
                                 │
                         ┌───────────┐
                         │ Dashboard │
                         └─────┬─────┘
                               │
        ┌──────────────┬──────┴───────┬───────────────┐
        │              │              │                │
  ┌───────────┐  ┌───────────┐  ┌─────────────┐  ┌───────────┐
  │  Clientes  │──│  Projetos │──│ Landing     │  │ Google Ads│
  └───────────┘  └─────┬─────┘  │ Pages       │  └─────┬─────┘
                        │        └─────────────┘        │
                        │                                │
                        └───────────────┬────────────────┘
                                         │
                                  ┌─────────────┐
                                  │  Analytics  │
                                  └──────┬──────┘
                                         │
                                  ┌─────────────┐
                                  │ Relatórios  │
                                  └─────────────┘

  Módulos transversais: Biblioteca · IA · Configurações · Insights
```

> **Nota:** o módulo **SEO** já está definido em `04_AI_ORCHESTRATION.md` (SEOAgent) e `06_API.md` (domínio SEO), mas não faz parte do perímetro do MVP — sua ativação está prevista para a Versão 2.0 do produto (ver `07_ROADMAP.md` e Seção 10 deste documento).

---

## 4. Responsabilidades de Cada Módulo

### Autenticação
Responsável por validar a identidade de quem acessa o sistema e manter a sessão do usuário. É o portão de entrada de toda a plataforma — nenhum outro módulo é acessado sem uma sessão autenticada válida.

### Usuários
Responsável pelo cadastro, atualização e gestão das pessoas que operam a plataforma dentro de uma Empresa. Trabalha em conjunto com o módulo Autenticação, mas trata de uma responsabilidade distinta: quem a pessoa é e o que pode fazer, não a validação da sessão em si.

### Dashboard
Ponto de entrada do sistema após o login. Consolida uma visão geral do estado atual de clientes, projetos e campanhas, priorizando o que exige atenção do usuário (aprovações pendentes, relatórios recentes, alertas relevantes).

### Clientes
Responsável pelo cadastro e manutenção das informações essenciais de cada cliente atendido pela empresa: dados de contexto, histórico e objetivos de marketing associados. É a base de contexto usada pelos demais módulos.

### Projetos
Organiza o trabalho de marketing em iniciativas concretas associadas a um cliente. Um projeto agrupa objetivos, prazos e os artefatos gerados nos demais módulos (landing pages, campanhas, relatórios) relacionados a essa iniciativa.

### Landing Pages
Responsável pela geração de landing pages a partir de templates inteligentes, adaptados ao objetivo e ao contexto do projeto/cliente. Cuida da criação, edição e organização das páginas geradas, sem se responsabilizar pela análise de performance (função do módulo Analytics).

### Google Ads
Responsável pela geração de campanhas de Google Ads assistida por IA. Toda campanha gerada neste módulo permanece em estado de rascunho até que o usuário revise e aprove explicitamente sua publicação — a publicação em si é uma ação distinta e posterior à geração.

### Analytics
Responsável por coletar e organizar os dados de desempenho de landing pages e campanhas. Fornece a base de dados de performance que alimenta o módulo de Relatórios, sem interpretar ou redigir conclusões — apenas estrutura o dado.

### Relatórios
Responsável por transformar os dados organizados pelo Analytics em relatórios interpretativos: o que aconteceu, por que aconteceu e o que é recomendado como próximo passo. É o módulo que devolve sentido de negócio ao dado bruto.

### Insights
Responsável por apresentar ao usuário oportunidades identificadas pela Inteligência Artificial durante a execução normal dos demais módulos (ex.: uma observação do AnalyticsAgent durante uma análise de desempenho). Não gera insight por conta própria — apenas recebe, organiza e apresenta o que os especialistas identificam, deixando a decisão de agir ou descartar sempre com o usuário.

### Biblioteca
Repositório central de ativos reutilizáveis — templates, conteúdos aprovados anteriormente, referências de campanhas bem-sucedidas. Funciona como memória de reuso entre projetos e clientes, evitando retrabalho.

### IA
Camada de apoio inteligente que dá suporte funcional aos demais módulos (geração de landing pages, geração de campanhas, interpretação de relatórios). Não é operada diretamente pelo usuário como um módulo autônomo — atua a serviço dos módulos funcionais. A composição interna dessa camada será detalhada em `04_AI_ORCHESTRATION.md`.

### Configurações
Responsável pelas preferências gerais do sistema, controles de usuário e parâmetros operacionais da plataforma. Não contém lógica de negócio de marketing — apenas governa o comportamento geral do sistema.

---

## 5. Fluxo de Navegação do Usuário

1. O usuário se autentica via **Autenticação**; sua identidade e permissões são resolvidas pelo módulo **Usuários**.
2. Uma vez autenticado, o usuário chega ao **Dashboard**, com visão geral do que precisa de atenção — incluindo Insights pendentes de avaliação.
3. A partir do Dashboard, o usuário navega para **Clientes** para selecionar ou cadastrar um cliente.
4. Dentro de um cliente, o usuário acessa ou cria um **Projeto**, definindo objetivo e escopo do trabalho.
5. A partir do projeto, o usuário aciona os módulos de execução necessários: **Landing Pages** e/ou **Google Ads**.
6. Campanhas e páginas geradas ficam disponíveis para revisão; campanhas de Google Ads aguardam **aprovação explícita** antes de qualquer publicação.
7. Após publicação/execução, o usuário acompanha o desempenho em **Analytics**.
8. Periodicamente, o usuário consulta **Relatórios** para entender resultado e próximos passos recomendados. Oportunidades identificadas ao longo do caminho aparecem no módulo **Insights**, para aceite ou descarte.
9. Em qualquer etapa, o usuário pode recorrer à **Biblioteca** para reaproveitar templates e conteúdos já validados.
10. **Configurações** é acessado de forma independente do fluxo de trabalho, conforme necessidade pontual do usuário.
11. O módulo **IA** não é navegado diretamente — está presente como apoio dentro dos módulos de Landing Pages, Google Ads, Analytics, Relatórios e Insights.

---

## 6. Fluxo de Trabalho do Sistema

O fluxo de trabalho central do MarketingAI segue a sequência:

**Cliente → Projeto → Objetivo → Geração assistida por IA → Revisão humana → Aprovação → Execução/Publicação → Coleta de dados → Interpretação → Relatório → Ajuste do próximo ciclo.**

Pontos de controle explícitos nesse fluxo:

- Toda geração de conteúdo (landing page, campanha) é feita pela camada de IA, mas **nunca é publicada automaticamente**.
- A aprovação do usuário é uma etapa obrigatória e visível, nunca implícita, antes de qualquer publicação de campanha de Google Ads.
- O resultado de cada ciclo (dados de Analytics + Relatórios) retroalimenta o próximo ciclo de planejamento dentro do mesmo projeto ou de projetos futuros do mesmo cliente.

---

## 7. Regras de Separação de Responsabilidades

- Nenhum módulo deve conter lógica de negócio pertencente a outro módulo. Ex.: o módulo Google Ads não interpreta performance — essa responsabilidade é do módulo Relatórios.
- O módulo **IA** nunca publica ou executa uma ação externa por conta própria; ele entrega um artefato para revisão dentro do módulo funcional correspondente (Landing Pages, Google Ads).
- O módulo **Analytics** organiza dado; o módulo **Relatórios** interpreta dado. Essa separação evita que a interpretação de negócio fique implícita ou perdida dentro da camada de coleta.
- O módulo **Clientes** é a única fonte de verdade sobre contexto de cliente; nenhum outro módulo deve duplicar ou manter sua própria cópia divergente dessas informações.
- O módulo **Biblioteca** é somente um repositório de reuso; ele não gera conteúdo novo — apenas armazena e disponibiliza o que já foi validado em outros módulos.
- O módulo **Configurações** não contém regra de negócio de marketing; contém apenas parâmetros operacionais do sistema.

---

## 8. Escalabilidade Futura

Ainda que o MVP seja desenhado como plataforma interna de uma única empresa, a organização em módulos com responsabilidade única foi escolhida deliberadamente para permitir, no futuro e sem reconstrução:

- Evolução do módulo **Clientes** para suportar múltiplas empresas operando de forma isolada dentro da mesma plataforma (visão SaaS multi-tenant descrita em `00_PRODUCT_BLUEPRINT.md`).
- Ampliação do módulo **Google Ads** para outros canais de mídia paga, seguindo o mesmo padrão de geração assistida com aprovação humana.
- Ampliação do módulo **Landing Pages** para outros formatos de conteúdo publicável.
- Evolução da camada **IA** para maior autonomia em módulos específicos, respeitando sempre os princípios de aprovação humana definidos no Product Blueprint.
- Extração futura de qualquer módulo como componente independentemente escalável, caso o volume de uso justifique — decisão que será tratada tecnicamente em documento próprio, não neste.

---

## 9. Decisões Arquiteturais do MVP

> **Nota de escopo — multi-cliente (dentro de uma Empresa) vs. multiempresa (entre Empresas).** Os documentos de produto (`00_PRODUCT_BLUEPRINT.md`, `01_VISION.md`, `02_PRD.md`) descrevem consultores e agências — que atendem múltiplos clientes próprios — como público-alvo do MarketingAI, e citam capacidade multi-cliente como diferencial. Isso **não contradiz** a decisão de MVP single-tenant abaixo: cada uma dessas personas (ex.: uma consultora com 10 clientes, uma agência com 25 contas) corresponde a exatamente uma **Empresa** operando o sistema, com múltiplos **Clientes** cadastrados dentro dela — capacidade que o MVP já entrega integralmente através dos módulos Clientes e Projetos. O que o MVP **não** entrega é **multiempresa**: várias Empresas diferentes e isoladas compartilhando a mesma instância da plataforma (o modelo SaaS comercial, vendido a múltiplas agências simultaneamente). Essa capacidade é a evolução de longo prazo prevista para a Versão 3.0 (ver `07_ROADMAP.md`). Em resumo: multi-cliente é MVP; multiempresa é visão de futuro.

- O MVP é uma **plataforma interna de uma única empresa** (uma única Empresa, no sentido de `05_DATABASE.md`), não uma solução multiempresa. O foco é produtividade e qualidade de execução para essa operação inicial — sem prejuízo de essa Empresa gerenciar quantos Clientes forem necessários, conforme nota acima.
- **Landing Pages** são geradas a partir de **templates inteligentes**, não de criação livre irrestrita, garantindo consistência e velocidade.
- **Campanhas de Google Ads** são sempre geradas pela IA em estado de rascunho e **somente publicadas após aprovação explícita do usuário** — nunca de forma automática.
- Os treze módulos listados na Seção 3 definem o perímetro funcional completo do MVP; nenhuma funcionalidade fora desse perímetro deve ser considerada parte da primeira entrega. O módulo **SEO**, embora já definido em `04_AI_ORCHESTRATION.md` e `06_API.md`, é a exceção deliberada — está documentado, mas sua ativação só ocorre na Versão 2.0 (ver Seção 10).
- O módulo **Insights** entra no MVP em versão básica — superfície simples de oportunidades identificadas como subproduto de outros fluxos, sem mecanismo de recomendação proativa sofisticado, conforme `07_ROADMAP.md`.
- A camada de IA é tratada, nesta fase, como um módulo funcional único de apoio; sua composição interna (agentes especializados, se houver) será definida separadamente em `04_AI_ORCHESTRATION.md`.

---

## 10. Itens Explicitamente Fora do Escopo do MVP

- Suporte a múltiplas empresas operando de forma isolada na mesma plataforma (multi-tenant) — ver nota de escopo na Seção 9.
- **SEO, mesmo em versão básica.** O SEOAgent (`04_AI_ORCHESTRATION.md`) e o domínio SEO (`06_API.md`) já estão definidos, mas nenhuma capacidade de SEO é ativada antes da Versão 2.0 (ver `07_ROADMAP.md`).
- **Pesquisa assistida de mercado e concorrência.** Prevista originalmente em `02_PRD.md`, essa capacidade foi redefinida para a Versão 1.1 do produto — ver `07_ROADMAP.md`.
- Publicação automática de campanhas sem aprovação humana.
- Canais de mídia paga além de Google Ads.
- Formatos de publicação além de landing pages.
- Definição detalhada de arquitetura técnica, stack, frameworks e linguagens (tratado fora deste documento).
- Modelo de dados e persistência em MongoDB (ver `05_DATABASE.md` e `09_TECH_STACK.md`).
- Definição individual dos agentes de IA e seus contratos (ver `04_AI_ORCHESTRATION.md`).
- Qualquer funcionalidade classificada como Baixa Prioridade em `02_PRD.md`.
