# 05 — Modelo de Dados

**Produto:** MarketingAI
**Documento:** Modelagem Conceitual de Dados
**Base:** `00_PRODUCT_BLUEPRINT.md`, `01_VISION.md`, `02_PRD.md`, `03_ARCHITECTURE.md`, `04_AI_ORCHESTRATION.md`
**Status:** Fundacional

> Este documento modela o **domínio de dados** do MarketingAI — as entidades de negócio que o sistema precisa conhecer e como elas se relacionam. Ele não define tipos de dado, não define colunas/schemas e não contém nenhum código. É a base conceitual sobre a qual o modelo físico de dados é construído.
>
> **Nota tecnológica:** o banco de dados oficial do MarketingAI é o **MongoDB Atlas**, conforme `09_TECH_STACK.md`. Isso significa que cada entidade descrita abaixo corresponde a uma **coleção** MongoDB, e as relações entre entidades são implementadas via **referências entre documentos**, não via chaves estrangeiras de um banco relacional. A modelagem permanece conceitual — schemas Mongoose, índices e decisões de embutimento vs. referência são definidos na implementação, não aqui.

---

# Filosofia dos Dados

O MarketingAI é, por definição, um sistema que transforma objetivo em execução com apoio de Inteligência Artificial. Isso só é possível se os dados do sistema não forem tratados como registro passivo de eventos, mas como **a matéria-prima de que a inteligência do produto depende para tomar boas decisões**.

Três ideias sustentam a filosofia de dados do MarketingAI:

- **Dado é contexto antes de ser histórico.** Cada entidade registrada — um cliente, um projeto, uma campanha, um relatório — existe para que um agente de IA (humano ou artificial) tome uma decisão melhor no momento presente. O valor de um dado não está apenas em "o que aconteceu", mas em "o que isso significa para a próxima decisão".
- **Nada se perde, tudo se conecta.** Conforme descrito em `04_AI_ORCHESTRATION.md`, a inteligência do MarketingAI depende de memória e de contexto compartilhado entre especialistas. Isso só funciona se o modelo de dados preservar a relação entre entidades (quem gerou o quê, a partir de qual objetivo, para qual cliente) — nunca informação solta e sem rastro de origem.
- **Todo dado relevante é rastreável até sua causa.** Em conformidade com o princípio de explicabilidade definido em `00_PRODUCT_BLUEPRINT.md`, qualquer saída do sistema — uma campanha, um relatório, uma recomendação — deve poder ser rastreada até o objetivo, o cliente e as informações que a originaram.

O modelo de dados do MarketingAI, portanto, não existe apenas para armazenar o que o sistema fez. Ele existe para sustentar **por que** o sistema fez o que fez, e para que essa razão continue disponível no futuro.

---

# Domínios de Dados

A seguir estão descritas as entidades de negócio que compõem o domínio de dados do MarketingAI. Cada entidade é descrita por finalidade, responsabilidade, quem a utiliza e sua relação com outras entidades — sem definição de campos, tipos ou estrutura física.

### Usuário

- **Finalidade:** Representar a pessoa que acessa e opera o MarketingAI.
- **Responsabilidade:** Ser o ponto de autoria de decisões humanas — aprovações, ajustes de objetivo, criação de clientes e projetos.
- **Quem utiliza:** Todo módulo funcional descrito em `03_ARCHITECTURE.md`; toda interação com o StrategyAgent parte de um Usuário.
- **Relação com outras entidades:** Pertence a uma Empresa; cria e acompanha Projetos e Clientes; é responsável por aprovações registradas na Timeline do Projeto e no Log IA.

### Empresa

- **Finalidade:** Representar a organização operadora da plataforma.
- **Responsabilidade:** Ser o limite de contexto e propriedade de todos os dados operacionais do sistema — Usuários, Clientes, Projetos e Configurações pertencem a uma Empresa.
- **Quem utiliza:** Base estrutural de todo o sistema; hoje existe uma única Empresa em operação, conforme decisão de MVP registrada em `03_ARCHITECTURE.md`.
- **Relação com outras entidades:** Contém Usuários, Clientes, Configurações e, indiretamente, todos os dados gerados a partir deles. É a entidade que sustenta a evolução futura para múltiplas empresas (multi-tenant), sem exigir reconstrução do modelo.

### Cliente

- **Finalidade:** Representar o cliente de marketing atendido pela Empresa (ex.: uma pessoa, um negócio, uma marca).
- **Responsabilidade:** Ser a fonte de contexto de negócio usada pelo ClientAgent — quem é, o que já foi feito, o que importa saber antes de agir.
- **Quem utiliza:** Módulo Clientes; ClientAgent; todo especialista que precisa de contexto de cliente antes de executar.
- **Relação com outras entidades:** Pertence a uma Empresa; possui um ou mais Projetos; está associado a Landing Pages, Campanhas, Relatórios e Insights gerados em seu nome.

### Projeto

- **Finalidade:** Representar uma iniciativa concreta de marketing com objetivo definido.
- **Responsabilidade:** Agrupar tudo o que é produzido em nome de um Objetivo específico de um Cliente — landing pages, campanhas, relatórios, tarefas.
- **Quem utiliza:** Módulo Projetos; ClientAgent; todo especialista de execução, direta ou indiretamente.
- **Relação com outras entidades:** Pertence a um Cliente; possui um Objetivo; possui Estado do Projeto; agrupa Landing Pages, Campanhas Google Ads, Relatórios, Tarefas e Histórico do Projeto.

### Estado do Projeto

- **Finalidade:** Representar em que fase um Projeto se encontra ao longo do tempo (ex.: planejamento, em execução, aguardando aprovação, concluído, pausado).
- **Responsabilidade:** Dar visibilidade sobre o andamento do trabalho sem exigir que o usuário interprete isso a partir de artefatos soltos.
- **Quem utiliza:** Dashboard (para priorizar o que exige atenção); StrategyAgent (para decidir se um fluxo pode prosseguir).
- **Relação com outras entidades:** Pertence a um Projeto; cada mudança de estado gera um evento registrado no Histórico do Projeto.

### Objetivo

- **Finalidade:** Representar a meta de negócio que orienta um Projeto (ex.: gerar leads, aumentar visibilidade, lançar um serviço).
- **Responsabilidade:** Ser o critério contra o qual toda execução da IA é validada — nenhuma ação deve ser tomada sem relação clara com um Objetivo.
- **Quem utiliza:** StrategyAgent (na etapa de "Análise do objetivo", conforme `04_AI_ORCHESTRATION.md`); todo especialista que precisa saber "para que serve" o que está produzindo.
- **Relação com outras entidades:** Pertence a um Projeto; referenciado por Landing Pages, Campanhas, Relatórios e Insights gerados dentro desse projeto.

### Landing Page

- **Finalidade:** Representar uma página gerada para apoiar um Objetivo de um Projeto.
- **Responsabilidade:** Reunir a estrutura e o conteúdo produzidos pelo LandingPageAgent e pelo CopyAgent para um fim específico.
- **Quem utiliza:** Módulo Landing Pages; LandingPageAgent; CopyAgent; SEOAgent (na avaliação); Analytics (na coleta de desempenho).
- **Relação com outras entidades:** Pertence a um Projeto; pode ser originada a partir de um Template; gera Analytics Snapshots ao longo do tempo.

### Template

- **Finalidade:** Representar um modelo reutilizável usado como ponto de partida para novas Landing Pages.
- **Responsabilidade:** Garantir consistência e velocidade na geração de páginas, conforme decisão de MVP registrada em `03_ARCHITECTURE.md`.
- **Quem utiliza:** KnowledgeAgent (na recuperação); LandingPageAgent (na aplicação); módulo Biblioteca (no armazenamento).
- **Relação com outras entidades:** Pertence à Biblioteca; pode originar múltiplas Landing Pages ao longo do tempo, em diferentes Projetos e Clientes.

### Campanha Google Ads

- **Finalidade:** Representar uma campanha publicitária estruturada para apoiar um Objetivo de um Projeto.
- **Responsabilidade:** Existir sempre, inicialmente, como rascunho — nunca como campanha já publicada — até aprovação humana explícita, conforme princípio inquebrável registrado em `04_AI_ORCHESTRATION.md`.
- **Quem utiliza:** Módulo Google Ads; GoogleAdsAgent; CopyAgent (para os textos); AnalyticsAgent (após publicação).
- **Relação com outras entidades:** Pertence a um Projeto; contém um ou mais Grupos de Anúncios; gera Analytics Snapshots após publicação; sua aprovação é registrada no Histórico do Projeto.

### Grupo de Anúncios

- **Finalidade:** Representar uma subdivisão temática ou estratégica dentro de uma Campanha Google Ads.
- **Responsabilidade:** Organizar Palavras-chave e Anúncios relacionados sob um mesmo direcionamento.
- **Quem utiliza:** GoogleAdsAgent.
- **Relação com outras entidades:** Pertence a uma Campanha Google Ads; contém Palavras-chave e Anúncios.

### Palavra-chave

- **Finalidade:** Representar um termo de busca relevante associado a um Grupo de Anúncios.
- **Responsabilidade:** Orientar o direcionamento de um Grupo de Anúncios dentro de uma campanha.
- **Quem utiliza:** GoogleAdsAgent; SEOAgent (como referência cruzada de intenção de busca).
- **Relação com outras entidades:** Pertence a um Grupo de Anúncios.

### Anúncio

- **Finalidade:** Representar a peça publicitária final apresentada dentro de um Grupo de Anúncios.
- **Responsabilidade:** Materializar, em texto, a proposta de valor de uma campanha para um público específico.
- **Quem utiliza:** GoogleAdsAgent (montagem); CopyAgent (redação dos textos).
- **Relação com outras entidades:** Pertence a um Grupo de Anúncios; seu conteúdo textual é produzido pelo CopyAgent.

### Analytics Snapshot

- **Finalidade:** Representar uma captura pontual de desempenho de uma Landing Page ou Campanha em um determinado momento.
- **Responsabilidade:** Preservar o dado bruto de performance (ex.: CTR, CPC, conversões) sem interpretação, servindo de insumo para o AnalyticsAgent.
- **Quem utiliza:** Módulo Analytics; AnalyticsAgent; ReportAgent (indiretamente, via interpretação do AnalyticsAgent).
- **Relação com outras entidades:** Associado a uma Landing Page ou a uma Campanha Google Ads; múltiplos snapshots ao longo do tempo formam a base histórica de desempenho de um artefato.

### Relatório

- **Finalidade:** Representar a consolidação interpretativa de desempenho de um Projeto em um determinado período.
- **Responsabilidade:** Explicar o que aconteceu, por que aconteceu, e o que é recomendado como próximo passo — conforme responsabilidade do ReportAgent.
- **Quem utiliza:** Módulo Relatórios; ReportAgent; Usuário (consumidor final).
- **Relação com outras entidades:** Pertence a um Projeto; construído a partir de um ou mais Analytics Snapshots interpretados pelo AnalyticsAgent; pode originar novos Insights IA.

### Insight IA

- **Finalidade:** Representar uma oportunidade, padrão ou recomendação identificada pela Inteligência Artificial que ainda não é uma ação — apenas uma sugestão registrada.
- **Responsabilidade:** Tornar visível ao usuário algo que a IA percebeu, mas que depende de decisão humana para se tornar ação (alinhado ao princípio de decisão final humana).
- **Quem utiliza:** Qualquer especialista pode gerar um Insight (ex.: AnalyticsAgent identificando uma oportunidade de otimização, SEOAgent identificando uma melhoria); StrategyAgent apresenta ao usuário.
- **Relação com outras entidades:** Associado a um Projeto e, quando aplicável, a uma Landing Page, Campanha ou Relatório que o originou.

### Tarefa

- **Finalidade:** Representar uma unidade de trabalho pendente ou concluída dentro de um Projeto.
- **Responsabilidade:** Tornar explícito o que ainda precisa ser feito ou revisado — por um humano ou como consequência de um fluxo de IA (ex.: "revisar rascunho de campanha").
- **Quem utiliza:** Dashboard; Usuário; StrategyAgent (ao identificar pendências durante a etapa de Validação).
- **Relação com outras entidades:** Pertence a um Projeto; pode estar associada a uma Campanha, Landing Page ou Insight que a originou.

### Histórico do Projeto

- **Finalidade:** Representar a linha do tempo de eventos relevantes ocorridos dentro de um Projeto.
- **Responsabilidade:** Preservar, em ordem cronológica, tudo que mudou o estado ou o rumo do projeto — mudanças de Estado do Projeto, aprovações, entregas, decisões.
- **Quem utiliza:** Usuário (para entender a trajetória do projeto); StrategyAgent e MemoryAgent (para recuperar contexto histórico antes de agir).
- **Relação com outras entidades:** Pertence a um Projeto; referencia eventos originados por qualquer outra entidade do domínio (Estado do Projeto, Campanha, Landing Page, Relatório, Insight, Tarefa).

### Biblioteca

- **Finalidade:** Representar o repositório central de ativos reutilizáveis da Empresa.
- **Responsabilidade:** Organizar Templates e Documentos de forma que possam ser reaproveitados entre Projetos e Clientes diferentes, evitando retrabalho.
- **Quem utiliza:** Módulo Biblioteca; KnowledgeAgent.
- **Relação com outras entidades:** Pertence a uma Empresa; contém Templates e Documentos.

### Documento

- **Finalidade:** Representar um conteúdo de referência armazenado na Biblioteca (ex.: briefing, guia de marca, case de sucesso, boas práticas).
- **Responsabilidade:** Fornecer contexto e referência de qualidade para os especialistas de execução, através do KnowledgeAgent.
- **Quem utiliza:** KnowledgeAgent; indiretamente, todo especialista que depende de referência prévia (CopyAgent, LandingPageAgent, SEOAgent, GoogleAdsAgent).
- **Relação com outras entidades:** Pertence à Biblioteca; pode estar associado a um Cliente específico ou ser de uso geral da Empresa.

### Prompt

- **Finalidade:** Representar a instrução estruturada utilizada internamente para orientar um agente especialista na execução de uma tarefa específica.
- **Responsabilidade:** Tornar rastreável exatamente o que foi solicitado a um especialista em um determinado momento, sustentando a explicabilidade do sistema.
- **Quem utiliza:** StrategyAgent (na formulação); qualquer especialista (na execução); auditoria futura do comportamento da IA.
- **Relação com outras entidades:** Associado a uma execução específica de um especialista, dentro de um Projeto; referenciado pelo Log IA correspondente.

### Memória IA

- **Finalidade:** Representar o conhecimento de longo prazo preservado pelo MemoryAgent — decisões passadas, preferências reveladas, aprendizados acumulados.
- **Responsabilidade:** Evitar que o sistema "recomece do zero" a cada novo ciclo de trabalho, conforme filosofia registrada em `04_AI_ORCHESTRATION.md`.
- **Quem utiliza:** MemoryAgent; StrategyAgent (consulta, durante a etapa de Análise do Objetivo).
- **Relação com outras entidades:** Associada a um Cliente e/ou Projeto; alimentada por eventos relevantes do Histórico do Projeto e por decisões humanas (aprovações, rejeições, ajustes).

### Log IA

- **Finalidade:** Representar o registro técnico-funcional de cada execução realizada por um agente de IA.
- **Responsabilidade:** Garantir rastreabilidade completa de "quem foi acionado, quando, com qual entrada e qual saída" — distinta da Memória IA, que é curada e de longo prazo; o Log IA é o registro bruto de execução.
- **Quem utiliza:** Auditoria; StrategyAgent (eventualmente, para diagnóstico de um fluxo); qualquer revisão futura de comportamento da IA.
- **Relação com outras entidades:** Associado a uma execução específica de um especialista, dentro de um Projeto; referencia o Prompt utilizado nessa execução.

### Configuração

- **Finalidade:** Representar as preferências e parâmetros operacionais da Empresa e do Usuário dentro da plataforma.
- **Responsabilidade:** Governar comportamento geral do sistema, sem conter regra de negócio de marketing, conforme definido em `03_ARCHITECTURE.md`.
- **Quem utiliza:** Módulo Configurações.
- **Relação com outras entidades:** Pertence a uma Empresa e, quando aplicável, a um Usuário específico dentro dela.

---

# Relacionamentos

As entidades do MarketingAI se organizam em torno de um encadeamento central: **Empresa → Cliente → Projeto → Objetivo**, que fornece o contexto sob o qual toda produção do sistema — Landing Pages, Campanhas, Relatórios, Insights — é gerada.

Conceitualmente, os relacionamentos seguem três padrões:

- **Relações de contexto (quem/para quem).** Empresa contém Usuários e Clientes; Cliente possui Projetos; Projeto possui um Objetivo. Essas relações respondem "para quem e por que isso existe".
- **Relações de produção (o que foi gerado).** Projeto agrupa os artefatos produzidos em seu nome — Landing Pages, Campanhas Google Ads (e, dentro delas, Grupos de Anúncios, Palavras-chave e Anúncios), Relatórios e Insights. Essas relações respondem "o que foi feito a partir desse contexto".
- **Relações de registro (o que aconteceu e por quê).** Histórico do Projeto, Log IA, Prompt e Memória IA registram a trajetória e as decisões que levaram a cada artefato existir. Essas relações respondem "como e por que chegamos até aqui".

Nenhuma entidade de produção (Landing Page, Campanha, Relatório, Insight) deve existir sem relação com um Projeto — essa é a regra estrutural que garante que todo trabalho da IA seja sempre rastreável até um Objetivo humano.

A Biblioteca e seus Documentos/Templates são a exceção deliberada a essa regra: pertencem à Empresa como um todo, não a um Projeto específico, precisamente para permitir reuso entre diferentes Clientes e Projetos.

---

# Timeline do Projeto

Todo Projeto possui uma linha do tempo — o Histórico do Projeto — que registra, em ordem cronológica, os eventos que importam para entender sua trajetória:

- Criação do Projeto e definição do Objetivo.
- Mudanças de Estado do Projeto.
- Geração de artefatos relevantes (Landing Page criada, Campanha estruturada).
- Pontos de aprovação humana (aprovado, rejeitado, ajustado).
- Publicação efetiva de uma Campanha.
- Geração de Relatórios.
- Insights relevantes identificados pela IA.

A timeline não é um recurso decorativo — ela é a materialização do princípio de rastreabilidade definido no `00_PRODUCT_BLUEPRINT.md`. Qualquer pessoa que entre em um Projeto em qualquer momento deve conseguir entender, olhando sua timeline, o que aconteceu, quando e por decisão de quem — sem precisar reconstruir esse entendimento a partir de artefatos soltos.

---

# Memória da IA

A Memória IA é o mecanismo pelo qual o MarketingAI preserva aprendizado ao longo do tempo, sob responsabilidade do MemoryAgent (`04_AI_ORCHESTRATION.md`).

Decisões importantes que devem ser preservadas na Memória IA incluem:

- Preferências expressas por um Usuário ou reveladas pelo comportamento em relação a um Cliente (ex.: tom de comunicação preferido, tipos de campanha que funcionaram melhor).
- Aprovações e rejeições relevantes, e o motivo por trás delas quando disponível.
- Padrões de resultado observados ao longo de múltiplos Projetos de um mesmo Cliente.
- Ajustes feitos manualmente pelo usuário sobre entregas geradas pela IA, que indicam um desvio entre o que a IA propôs e o que o usuário realmente queria.

A Memória IA se diferencia do Histórico do Projeto por natureza: o Histórico do Projeto é um registro cronológico bruto de eventos; a Memória IA é uma camada curada de aprendizado, construída a partir desses eventos, e que deve influenciar ativamente decisões futuras do StrategyAgent e dos especialistas.

---

# Insights

Um Insight IA representa uma oportunidade identificada pela Inteligência Artificial que ainda não é uma ação — é uma sugestão registrada, sujeita a avaliação humana.

O sistema registra um Insight sempre que um especialista, durante sua execução normal, percebe algo relevante além do que foi diretamente solicitado — por exemplo, o AnalyticsAgent identificando uma queda de desempenho não perguntada, ou o SEOAgent identificando uma oportunidade de melhoria ao avaliar uma página por outro motivo.

Cada Insight preserva sua origem (qual especialista o gerou, em qual Projeto, a partir de qual dado ou análise), garantindo que o usuário sempre entenda o raciocínio por trás da sugestão antes de decidir agir sobre ela ou descartá-la.

---

# Biblioteca de Conhecimento

A Biblioteca organiza dois tipos de ativo reutilizável: **Templates**, usados como ponto de partida estrutural para Landing Pages, e **Documentos**, usados como referência de conteúdo e boas práticas pelo KnowledgeAgent.

Diferente das entidades de produção, os itens da Biblioteca pertencem à Empresa como um todo, não a um Projeto ou Cliente específico — o que permite que um template validado com um Cliente seja reaproveitado com outro, e que um documento de boas práticas sirva a qualquer especialista que precise dele, em qualquer contexto.

A organização da Biblioteca deve favorecer descoberta rápida pelo KnowledgeAgent: cada item deve carregar contexto suficiente (para que tipo de objetivo serve, em que situação já funcionou) para que o especialista consiga recuperar a referência certa no momento certo, sem depender de busca manual do usuário.

---

# Auditoria

O MarketingAI precisa sustentar auditoria em dois planos, conforme os princípios de explicabilidade e confiabilidade definidos no `00_PRODUCT_BLUEPRINT.md` e no `04_AI_ORCHESTRATION.md`:

- **Auditoria de decisão humana.** Toda aprovação, rejeição ou ajuste feito por um Usuário sobre uma entrega da IA (especialmente publicação de Campanha, conforme regra de aprovação humana) deve ficar registrado no Histórico do Projeto, com autoria e momento identificáveis.
- **Auditoria de execução da IA.** Toda execução de um agente especialista deve ficar registrada no Log IA, preservando qual Prompt originou a execução, o que foi produzido e em que contexto (Projeto, Cliente, Objetivo) isso ocorreu.

Essas duas camadas de auditoria, combinadas, garantem que nunca exista uma ação relevante — humana ou de IA — sem explicação rastreável até sua origem.

---

# Evolução Futura

O modelo de dados foi desenhado para crescer por extensão, não por reconstrução, seguindo o mesmo princípio arquitetural registrado em `03_ARCHITECTURE.md`:

- A entidade **Empresa** já existe desde o MVP como limite conceitual de propriedade dos dados, preparando o modelo para suportar múltiplas empresas operando de forma isolada (visão SaaS multi-tenant), sem exigir redesenho das demais entidades.
- Novos canais de mídia paga, além de Google Ads, podem ser modelados como novas entidades de campanha equivalentes a Campanha Google Ads, Grupo de Anúncios, Palavra-chave e Anúncio, sem alterar o restante do domínio.
- Novos formatos de conteúdo publicável, além de Landing Page, podem ser adicionados como novas entidades de produção, seguindo o mesmo padrão de relação com Projeto e Template.
- A Memória IA e o Log IA foram desenhados como camadas independentes desde o início, permitindo que a profundidade de aprendizado da IA evolua ao longo do tempo sem exigir mudança estrutural nas demais entidades.
- Qualquer nova entidade futura deve seguir a mesma regra estrutural já estabelecida: pertencer a um Projeto (se for produção), à Biblioteca (se for reuso) ou à Empresa (se for configuração ou propriedade), preservando a rastreabilidade de ponta a ponta que sustenta todo o domínio.
