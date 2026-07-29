# 02 — PRD (Product Requirements Document)

**Produto:** MarketingAI
**Documento:** Requisitos de Produto
**Base:** `01_VISION.md`
**Status:** Fundacional

---

# Resumo Executivo

O MarketingAI é uma plataforma SaaS de automação de marketing digital baseada em Inteligência Artificial, que permite a consultores, agências, times internos e pequenas empresas planejar, executar, medir e otimizar operações de marketing de ponta a ponta, com muito menos esforço manual do que os processos tradicionais exigem.

Este documento traduz a visão de produto definida em `01_VISION.md` em requisitos concretos: o que o produto precisa fazer, para quem, em que ordem de prioridade, e quais critérios definem seu sucesso. Ele serve como referência única para todas as decisões de escopo do MVP e das evoluções subsequentes.

---

# Problema

Profissionais e empresas de marketing enfrentam três problemas recorrentes que limitam sua capacidade de gerar resultado:

1. **Fragmentação de ferramentas** — pesquisa, criação, execução e relatório acontecem em sistemas desconectados, exigindo trabalho manual de integração e gerando perda de contexto entre etapas.
2. **Alto volume de trabalho repetitivo** — grande parte do tempo disponível é consumida por tarefas operacionais (pesquisa de concorrência, adaptação de conteúdo, montagem de relatórios) em vez de decisão estratégica.
3. **Limitação de recursos para operar em escala** — nem toda empresa ou profissional tem orçamento para montar uma equipe completa de marketing, o que restringe sua capacidade de competir com organizações maiores.

Esses três problemas, combinados, resultam em ciclos de marketing lentos, inconsistentes e caros de escalar.

---

# Solução

O MarketingAI resolve esses problemas oferecendo uma plataforma única, orientada por Inteligência Artificial, capaz de conduzir o ciclo de marketing de forma assistida ou automatizada — da pesquisa inicial ao relatório final — mantendo o histórico e o contexto de cada cliente/conta ao longo do tempo.

Em vez de mais uma ferramenta pontual, o produto entrega capacidade operacional: o usuário define objetivos e aprova decisões estratégicas, e a plataforma executa, mede e reporta, reduzindo o tempo entre "decidimos fazer isso" e "está feito e medido".

---

# Público-Alvo

- Consultores e freelancers de marketing digital que atendem múltiplos clientes.
- Agências de marketing de pequeno e médio porte.
- Times de marketing internos (in-house) de empresas de médio porte.
- Pequenas empresas e empreendedores sem equipe de marketing dedicada.

---

# Personas

### Persona 1 — Marina, Consultora de Marketing Independente

- **Idade:** 34 anos
- **Contexto:** Atende de 6 a 10 clientes simultaneamente como consultora autônoma.
- **Objetivo:** Entregar resultado de qualidade para todos os clientes sem precisar contratar uma equipe.
- **Frustração atual:** Passa mais tempo produzindo relatórios e adaptando conteúdo do que efetivamente pensando estratégia.
- **O que o MarketingAI resolve para ela:** Assume as tarefas operacionais repetitivas, permitindo atender mais clientes com o mesmo tempo disponível.

### Persona 2 — Rafael, Sócio de Agência de Marketing de Médio Porte

- **Idade:** 41 anos
- **Contexto:** Lidera uma agência com 12 colaboradores e cerca de 25 contas ativas.
- **Objetivo:** Aumentar a capacidade de entrega da agência sem aumentar proporcionalmente o quadro de funcionários.
- **Frustração atual:** Margem pressionada porque o custo operacional cresce junto com o número de clientes.
- **O que o MarketingAI resolve para ele:** Aumenta a capacidade de entrega por colaborador, melhorando a margem sem sacrificar qualidade.

### Persona 3 — Camila, Coordenadora de Marketing In-House

- **Idade:** 29 anos
- **Contexto:** Lidera um time de marketing de 4 pessoas dentro de uma empresa de médio porte em crescimento.
- **Objetivo:** Sustentar o volume crescente de campanhas e canais exigido pela empresa sem esgotar a equipe.
- **Frustração atual:** O time está sempre reativo, "apagando incêndio", sem tempo para planejamento de médio prazo.
- **O que o MarketingAI resolve para ela:** Absorve tarefas operacionais recorrentes, dando ao time espaço para atuar de forma mais estratégica.

### Persona 4 — Eduardo, Empreendedor de Pequeno Negócio

- **Idade:** 47 anos
- **Contexto:** Dono de um pequeno negócio local, sem equipe de marketing dedicada.
- **Objetivo:** Ter presença de marketing profissional sem precisar contratar uma agência ou aprender marketing digital a fundo.
- **Frustração atual:** Não sabe por onde começar e não tem orçamento para contratar especialistas.
- **O que o MarketingAI resolve para ele:** Oferece um caminho guiado e acessível para executar marketing de qualidade profissional.

### Persona 5 — Beatriz, Analista de Marketing de Agência

- **Idade:** 26 anos
- **Contexto:** Analista operacional em uma agência, responsável pela execução diária de múltiplas contas.
- **Objetivo:** Executar mais campanhas com qualidade consistente, sem depender de retrabalho constante.
- **Frustração atual:** Tarefas repetitivas de pesquisa e montagem de relatório consomem a maior parte do seu dia.
- **O que o MarketingAI resolve para ela:** Automatiza as etapas operacionais recorrentes, liberando tempo para revisão e ajuste fino do trabalho.

---

# Jornada do Usuário

1. **Descoberta e cadastro.** O usuário conhece o MarketingAI, entende a proposta de valor e cria sua conta na plataforma.
2. **Primeiro login e onboarding.** No primeiro acesso, o usuário é guiado por um processo de configuração inicial: informações da sua empresa ou dos seus clientes, objetivos de marketing e canais relevantes.
3. **Criação da primeira conta/cliente.** O usuário cadastra o primeiro cliente ou a primeira operação de marketing que deseja gerenciar dentro da plataforma.
4. **Definição de objetivo.** O usuário informa o que deseja alcançar (ex.: aumentar visibilidade, gerar leads, lançar uma campanha), estabelecendo o direcionamento estratégico.
5. **Execução assistida.** A plataforma conduz as etapas necessárias — pesquisa, priorização, criação de conteúdo e execução — apresentando resultados intermediários para revisão e aprovação do usuário sempre que necessário.
6. **Acompanhamento de resultados.** O usuário acompanha o desempenho das ações em relatórios que explicam o que aconteceu e o que é recomendado como próximo passo.
7. **Ajuste contínuo.** Com base nos resultados, o usuário ajusta objetivos e prioridades, e a plataforma incorpora esse aprendizado no ciclo seguinte.
8. **Acompanhamento contínuo multi-cliente.** Para usuários com múltiplas contas (consultores, agências), a plataforma oferece uma visão consolidada do andamento de todos os clientes simultaneamente.

---

# Funcionalidades do MVP

> **Nota de escopo (atualizada após `03_ARCHITECTURE.md` e `07_ROADMAP.md`):** duas funcionalidades desta seção tiveram sua priorização revisada nos documentos de arquitetura e roadmap, que têm precedência sobre este PRD para decisões de escopo vigente. As mudanças estão anotadas nos itens correspondentes abaixo.

### Alta Prioridade

- Cadastro e login de usuário.
- Cadastro de cliente/conta de marketing, com informações essenciais de contexto.
- Definição de objetivos de marketing por cliente/conta.
- Geração e adaptação de conteúdo de campanha.
- Geração de relatórios de acompanhamento com interpretação dos resultados.
- Histórico persistente de cada cliente/conta.

### Média Prioridade

- Priorização/classificação de oportunidades (leads, campanhas, iniciativas).
- Painel consolidado para usuários com múltiplos clientes/contas.
- Fluxo de aprovação humana antes da execução de ações de campanha.
- Notificações sobre eventos relevantes (campanha concluída, relatório disponível).

### Baixa Prioridade

- **Pesquisa assistida de mercado e concorrência** *(reclassificada de Alta Prioridade — redefinida para a Versão 1.1 do produto, ver `07_ROADMAP.md`; não faz parte do perímetro funcional do MVP definido em `03_ARCHITECTURE.md`)*.
- Recomendações proativas de próximos passos com base em performance histórica, em profundidade — análise contínua de padrões de longo prazo *(uma primeira versão simples e pontual desta capacidade, "Insights Básicos", foi incorporada ao MVP; ver `03_ARCHITECTURE.md` e `07_ROADMAP.md`. Este item refere-se apenas à camada avançada de recomendação proativa contínua, ainda fora do MVP)*.
- Simulação de cenários de campanha antes da execução real.
- Onboarding automatizado assistido para novos clientes/contas.
- Exportação avançada de relatórios em múltiplos formatos.

---

# Requisitos Funcionais

- O sistema deve permitir que o usuário crie e gerencie uma conta própria.
- O sistema deve permitir o cadastro de múltiplos clientes/contas de marketing por usuário.
- O sistema deve permitir a definição de objetivos de marketing associados a cada cliente/conta.
- O sistema deve gerar conteúdo de campanha adaptável a diferentes canais e públicos.
- O sistema deve gerar relatórios de acompanhamento que expliquem resultados e recomendem próximos passos.
- O sistema deve manter o histórico de cada cliente/conta disponível para consulta a qualquer momento.
- O sistema deve permitir que o usuário aprove ou rejeite ações antes de sua execução, quando aplicável.
- O sistema deve notificar o usuário sobre eventos relevantes do seu fluxo de trabalho.

---

# Requisitos Não Funcionais

- **Segurança de dados:** informações de clientes e contas devem ser protegidas com controles de acesso adequados desde o primeiro protótipo.
- **Privacidade:** o sistema deve ser desenhado com práticas compatíveis com LGPD/GDPR desde a concepção.
- **Disponibilidade:** a plataforma deve estar disponível de forma confiável durante o horário comercial dos usuários-alvo.
- **Usabilidade:** a experiência deve ser compreensível para usuários sem conhecimento técnico avançado.
- **Desempenho percebido:** tempos de resposta devem ser compatíveis com um fluxo de trabalho profissional, sem esperas que interrompam a produtividade do usuário.
- **Auditabilidade:** ações relevantes executadas pela plataforma devem ser rastreáveis até sua origem e justificativa.
- **Escalabilidade:** o produto deve ser capaz de crescer de um único usuário para múltiplos clientes pagantes sem necessidade de reconstrução.

---

# Restrições

- Este documento não define arquitetura técnica, stack ou estrutura interna do sistema.
- O MVP deve se manter restrito às funcionalidades de alta prioridade, evitando escopo especulativo.
- Toda ação de execução de campanha em nome do cliente deve respeitar limites e aprovações definidos pelo usuário.
- O produto não deve comprometer segurança ou privacidade de dados em nome de velocidade de entrega.

---

# Critérios de Sucesso

- O MVP consegue conduzir, de ponta a ponta, o fluxo essencial de marketing (objetivo → pesquisa → execução → relatório) para pelo menos um perfil real de cliente.
- Usuários early adopters relatam economia de tempo mensurável em comparação ao processo manual anterior.
- Usuários early adopters confiam o suficiente no sistema para aprovar e utilizar suas recomendações de forma recorrente.
- Nenhum incidente de segurança ou privacidade de dados de cliente durante o período de validação.

---

# Métricas de Negócio

- Tempo médio entre definição de objetivo e entrega do primeiro resultado mensurável.
- Número de clientes/contas ativas gerenciadas por usuário.
- Taxa de retenção de usuários early adopters ao longo do tempo.
- Taxa de aprovação de ações/recomendações geradas pela plataforma.
- Volume de campanhas/conteúdos executados por usuário por período.
- Satisfação do usuário (NPS ou equivalente) em relação ao produto.

---

# Riscos do Projeto

- **Dependência de qualidade dos modelos de IA utilizados:** resultados abaixo do esperado podem comprometer a confiança do usuário na plataforma.
- **Resistência à automação:** usuários podem hesitar em delegar decisões e execução a um sistema de IA sem controles claros de aprovação.
- **Complexidade de manter contexto multi-cliente:** falhas na gestão de histórico podem gerar perda de confiança, especialmente para consultores e agências.
- **Exposição de dados sensíveis de clientes:** qualquer falha de segurança tem impacto direto na viabilidade comercial do produto.
- **Escopo crescente (scope creep):** pressão para adicionar funcionalidades além do MVP pode atrasar a validação do valor central do produto.

---

# Futuras Evoluções

- Evolução da plataforma para modelo SaaS multi-tenant completo, com onboarding self-service e cobrança integrada.
- Camada avançada de recomendação proativa, antecipando próximos passos com base em performance histórica.
- Simulação de cenários de campanha antes da execução real.
- Expansão de integrações com canais e ferramentas externas de marketing.
- Camada de governança e controle para operação segura em escala de contas de clientes reais.
