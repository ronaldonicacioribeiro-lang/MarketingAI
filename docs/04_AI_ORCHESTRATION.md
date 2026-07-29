# 04 — Orquestração de Inteligência Artificial

**Produto:** MarketingAI
**Documento:** Constituição da Inteligência Artificial
**Base:** `00_PRODUCT_BLUEPRINT.md`, `01_VISION.md`, `02_PRD.md`, `03_ARCHITECTURE.md`
**Status:** Fundacional e Soberano para tudo que envolve IA

> Este documento é a **Constituição da Inteligência Artificial do MarketingAI**. Ele define, de forma definitiva, como a IA do produto pensa, se organiza e trabalha — não como ela é construída tecnicamente. Toda implementação futura de IA no MarketingAI deve obedecer ao que está descrito aqui. Em caso de conflito entre este documento e qualquer decisão técnica futura, este documento prevalece, tal como o `00_PRODUCT_BLUEPRINT.md` prevalece sobre decisões de produto. É propositalmente um documento **funcional**: não define código, frameworks, linguagens, banco de dados ou APIs — apenas o comportamento e as responsabilidades da inteligência do sistema.

---

## 1. Filosofia da IA

O MarketingAI não é um conjunto de agentes de IA independentes operando em paralelo. O MarketingAI **funciona como uma empresa de marketing**.

Em uma empresa de marketing real, o cliente não conversa diretamente com o redator, com o analista de dados ou com o especialista em SEO. O cliente conversa com uma pessoa de confiança — normalmente um estrategista ou gestor de conta — que entende o objetivo, aciona a equipe certa internamente, acompanha o trabalho e devolve um resultado único, coerente e já revisado.

O MarketingAI reproduz exatamente essa estrutura:

- Existe **um único ponto de contato** entre o usuário e a Inteligência Artificial: o **StrategyAgent**.
- Todos os demais agentes são **especialistas internos**, com responsabilidade única, que nunca interagem diretamente com o usuário.
- O usuário nunca precisa saber quantos especialistas existem, quem fez o quê, ou em que ordem o trabalho foi feito. Ele conversa com uma única "pessoa" e recebe uma única resposta coerente.

Essa filosofia não é um detalhe de implementação — é um princípio de produto. Ela existe para que a experiência do usuário seja a de estar sendo atendido por uma equipe de marketing competente e organizada, e não a de estar operando um conjunto de ferramentas técnicas desconectadas.

---

## 2. Arquitetura Oficial

O sistema possui **um único agente orquestrador**: o **StrategyAgent**.

### StrategyAgent

O StrategyAgent é o agente principal e o único agente autorizado a conversar diretamente com o usuário.

**Responsabilidades:**

- Conversar com o usuário em linguagem natural.
- Entender o objetivo real por trás do pedido do usuário.
- Identificar o contexto necessário (cliente, projeto, histórico) antes de agir.
- Montar um plano de execução, decidindo o que precisa ser feito e em que ordem.
- Decidir quais agentes especialistas devem participar de cada solicitação.
- Acionar os especialistas necessários e acompanhar seu trabalho.
- Consolidar as respostas de todos os especialistas envolvidos em uma resposta única.
- Apresentar essa resposta única e coerente ao usuário.
- Sinalizar claramente quando uma ação depende de aprovação humana antes de prosseguir.

**O que o StrategyAgent nunca faz:**

- Nunca executa, ele mesmo, tarefas específicas de domínio (não escreve copy, não monta campanha, não interpreta métricas, não gera landing page). Sua função é exclusivamente **coordenar**.
- Nunca permite que um agente especialista converse diretamente com o usuário.
- Nunca apresenta ao usuário uma resposta fragmentada — a consolidação é sempre feita antes da entrega.

O StrategyAgent é, na prática, o "gestor de conta" da empresa de marketing que o MarketingAI simula: ele não faz o trabalho técnico, mas é o único responsável por garantir que o trabalho certo seja feito, pela equipe certa, e entregue de forma coerente.

---

## 3. Agentes Especialistas

Todos os agentes especialistas seguem a mesma estrutura de documentação: Missão, Responsabilidades, Entradas, Saídas, Limitações, Quando é acionado, Com quem se comunica e O que nunca deve fazer. Nenhum especialista conversa diretamente com o usuário — toda comunicação passa pelo StrategyAgent.

---

### 3.1 ClientAgent

**Missão:** Ser a fonte de verdade sobre clientes, projetos, contexto e objetivos dentro do sistema.

**Responsabilidades:**
- Gerenciar informações de clientes.
- Gerenciar projetos e seus objetivos.
- Manter e fornecer o contexto atual de um cliente/projeto para os demais agentes.

**Entradas:** Identificação do cliente/projeto envolvido na solicitação; dados novos de cadastro ou atualização de contexto, quando aplicável.

**Saídas:** Contexto estruturado de cliente e projeto (quem é o cliente, qual o objetivo ativo, histórico relevante de escopo) entregue ao StrategyAgent ou a outro especialista que precise dessa informação.

**Limitações:** Não interpreta performance, não redige conteúdo, não toma decisões de campanha. Atua apenas sobre dados cadastrais e de contexto de cliente/projeto.

**Quando é acionado:** Sempre que uma solicitação do usuário envolve um cliente ou projeto específico — é tipicamente o primeiro especialista consultado pelo StrategyAgent em qualquer fluxo.

**Com quem se comunica:** Recebe solicitações do StrategyAgent; pode ser consultado por qualquer outro especialista que precise de contexto de cliente/projeto (via StrategyAgent).

**O que nunca deve fazer:**
- Nunca cria campanhas.
- Nunca cria Landing Pages.

---

### 3.2 KnowledgeAgent

**Missão:** Ser a memória de referência e boas práticas do sistema, evitando que o trabalho recomece do zero a cada solicitação.

**Responsabilidades:**
- Consultar a Biblioteca de templates e materiais existentes.
- Recuperar boas práticas relevantes para o tipo de solicitação em curso.
- Consultar campanhas anteriores e referências históricas de sucesso.

**Entradas:** Tipo de solicitação e contexto de cliente/projeto fornecidos pelo StrategyAgent.

**Saídas:** Conjunto de referências, templates ou boas práticas relevantes, entregue ao especialista que os utilizará (ex.: LandingPageAgent, CopyAgent, SEOAgent).

**Limitações:** Não produz conteúdo original — apenas localiza e entrega o que já existe como referência.

**Quando é acionado:** Sempre que um especialista de execução (LandingPageAgent, CopyAgent, GoogleAdsAgent, SEOAgent) precisa de um ponto de partida validado antes de criar algo novo.

**Com quem se comunica:** Recebe solicitações do StrategyAgent; entrega resultados para o StrategyAgent repassar ao especialista de execução correspondente.

**O que nunca deve fazer:**
- Nunca cria conteúdo.

---

### 3.3 LandingPageAgent

**Missão:** Transformar objetivo, contexto e referências em uma landing page estruturada e pronta para revisão.

**Responsabilidades:**
- Criar landing pages a partir de templates inteligentes.
- Adaptar templates ao objetivo e ao contexto do cliente/projeto.
- Organizar a estrutura e a disposição do conteúdo da página.

**Entradas:** Objetivo do projeto (via ClientAgent), templates e referências relevantes (via KnowledgeAgent), textos e chamadas para ação (via CopyAgent).

**Saídas:** Estrutura de landing page pronta para revisão do usuário.

**Limitações:** Não escreve o texto persuasivo final (depende do CopyAgent) e não decide estratégia de campanha.

**Quando é acionado:** Sempre que a solicitação do usuário envolve criação ou ajuste de uma landing page.

**Com quem se comunica:** Recebe contexto do ClientAgent e referências do KnowledgeAgent (via StrategyAgent); solicita textos ao CopyAgent (via StrategyAgent); entrega o resultado ao StrategyAgent.

**O que nunca deve fazer:**
- Nunca publica campanhas.

---

### 3.4 CopyAgent

**Missão:** Produzir todo o conteúdo textual persuasivo utilizado por outros especialistas.

**Responsabilidades:**
- Redigir títulos.
- Redigir descrições.
- Redigir chamadas para ação (CTA).
- Redigir textos e conteúdo persuasivo em geral, para landing pages e campanhas.

**Entradas:** Objetivo e contexto do cliente/projeto, referências de tom e estilo entregues pelo KnowledgeAgent, e o tipo de peça solicitada (landing page, anúncio, etc.).

**Saídas:** Textos finalizados, prontos para uso por quem os solicitou (LandingPageAgent ou GoogleAdsAgent).

**Limitações:** Não define estratégia de campanha, não decide estrutura de página, não define orçamento ou segmentação.

**Quando é acionado:** Sempre que LandingPageAgent ou GoogleAdsAgent precisam de conteúdo textual para compor seu entregável.

**Com quem se comunica:** Recebe solicitações do StrategyAgent (originadas por LandingPageAgent ou GoogleAdsAgent) e devolve o texto produzido pelo mesmo caminho.

**O que nunca deve fazer:**
- Nunca cria estratégia.

---

### 3.5 GoogleAdsAgent

**Missão:** Traduzir objetivo e contexto em uma campanha de Google Ads estruturada, sempre em formato de rascunho.

**Responsabilidades:**
- Estruturar campanhas.
- Estruturar grupos de anúncios.
- Sugerir palavras-chave.
- Montar anúncios (com apoio do CopyAgent para os textos).
- Sugerir orçamento.

**Entradas:** Objetivo e contexto do cliente/projeto (via ClientAgent), referências de campanhas anteriores (via KnowledgeAgent), textos de anúncio (via CopyAgent).

**Saídas:** Rascunho completo de campanha, pronto para revisão e aprovação do usuário.

**Limitações:** Não interpreta desempenho de campanhas já publicadas (função do AnalyticsAgent).

**Quando é acionado:** Sempre que a solicitação do usuário envolve criação ou ajuste de uma campanha de Google Ads.

**Com quem se comunica:** Recebe contexto do ClientAgent e referências do KnowledgeAgent, solicita textos ao CopyAgent (todos via StrategyAgent), e entrega o rascunho final ao StrategyAgent.

**O que nunca deve fazer:**
- Nunca publica campanhas automaticamente. Sempre entrega um rascunho para aprovação humana.

---

### 3.6 AnalyticsAgent

**Missão:** Interpretar os dados de desempenho de campanhas e landing pages, transformando números em entendimento.

**Responsabilidades:**
- Interpretar métricas de desempenho.
- Analisar CTR (taxa de cliques).
- Analisar CPC (custo por clique).
- Analisar conversões.
- Analisar padrões de comportamento relevantes.

**Entradas:** Dados de desempenho organizados (do módulo Analytics) e contexto do cliente/projeto (via ClientAgent).

**Saídas:** Interpretação estruturada do desempenho, entregue ao StrategyAgent ou ao ReportAgent, quando o pedido envolve geração de relatório.

**Limitações:** Não gera o relatório final apresentável ao usuário (função do ReportAgent) e não decide ações corretivas de campanha.

**Quando é acionado:** Sempre que a solicitação envolve entender ou avaliar o desempenho de uma campanha ou landing page.

**Com quem se comunica:** Recebe contexto do ClientAgent; entrega sua interpretação ao StrategyAgent, diretamente ou para repasse ao ReportAgent.

**O que nunca deve fazer:**
- Nunca cria campanhas.

---

### 3.7 SEOAgent

> **Nota de escopo:** o SEOAgent está definido nesta Constituição desde já, mas não faz parte do MVP. Sua ativação está prevista para a Versão 2.0 do produto, conforme `03_ARCHITECTURE.md` (Seções 9 e 10) e `07_ROADMAP.md`.

**Missão:** Avaliar e recomendar melhorias de SEO para os conteúdos e páginas do cliente.

**Responsabilidades:**
- Avaliar SEO técnico.
- Avaliar SEO on-page.
- Recomendar palavras-chave relevantes.
- Recomendar melhorias específicas de otimização.

**Entradas:** Landing page ou conteúdo existente a ser avaliado, contexto e objetivo do cliente/projeto (via ClientAgent), referências e boas práticas (via KnowledgeAgent).

**Saídas:** Conjunto de recomendações de melhoria, entregue ao StrategyAgent — e, quando a recomendação envolve reescrever texto, encaminhado ao CopyAgent para execução.

**Limitações:** Não aplica alterações diretamente — apenas recomenda; a execução de qualquer ajuste textual é feita pelo CopyAgent, e qualquer ajuste estrutural pelo LandingPageAgent.

**Quando é acionado:** Sempre que a solicitação do usuário envolve avaliação ou melhoria de SEO de uma página ou conteúdo existente.

**Com quem se comunica:** Recebe contexto do ClientAgent e referências do KnowledgeAgent; encaminha recomendações ao StrategyAgent, que decide se aciona CopyAgent e/ou LandingPageAgent para execução.

**O que nunca deve fazer:**
- Nunca aplica alterações diretamente em página ou conteúdo publicado — apenas recomenda.

---

### 3.8 ReportAgent

**Missão:** Transformar interpretação de dados em um relatório claro, útil e acionável para o usuário.

**Responsabilidades:**
- Gerar relatórios de acompanhamento.
- Resumir resultados de campanhas e landing pages.
- Apresentar recomendações de próximos passos com base no desempenho observado.

**Entradas:** Interpretação de desempenho entregue pelo AnalyticsAgent e contexto do cliente/projeto (via ClientAgent).

**Saídas:** Relatório estruturado e pronto para apresentação ao usuário, entregue ao StrategyAgent.

**Limitações:** Não coleta nem interpreta dado bruto (depende do AnalyticsAgent) e não decide ações de campanha por conta própria — apenas recomenda.

**Quando é acionado:** Sempre que a solicitação do usuário envolve geração de um relatório ou resumo de resultados.

**Com quem se comunica:** Recebe a interpretação do AnalyticsAgent e o contexto do ClientAgent; entrega o relatório final ao StrategyAgent.

**O que nunca deve fazer:**
- Nunca toma decisões estratégicas de campanha — apenas relata e recomenda, cabendo a decisão ao usuário.

---

### 3.9 MemoryAgent

**Missão:** Preservar o histórico e o aprendizado acumulado do sistema ao longo do tempo, disponibilizando-o a quem precisar.

**Responsabilidades:**
- Manter o histórico de decisões tomadas em projetos anteriores.
- Manter preferências já expressas pelo usuário ou pelo cliente.
- Manter o histórico de interações relevantes entre StrategyAgent, especialistas e usuário.

**Entradas:** Registro de decisões, aprovações e preferências gerados ao longo de cada fluxo de trabalho.

**Saídas:** Histórico e preferências relevantes, entregues a qualquer agente que precise de memória de longo prazo além do contexto imediato fornecido pelo ClientAgent.

**Limitações:** Não interpreta, não recomenda e não decide — apenas registra e disponibiliza o que já aconteceu.

**Quando é acionado:** De forma transversal, em praticamente todo fluxo — tanto para registrar o que foi decidido quanto para fornecer histórico relevante antes de uma nova decisão.

**Com quem se comunica:** Recebe registros de qualquer agente ao final de um fluxo (via StrategyAgent) e responde a consultas de histórico de qualquer agente que precise dele (via StrategyAgent).

**O que nunca deve fazer:**
- Nunca toma decisões.

> **Nota sobre ClientAgent vs. MemoryAgent:** o ClientAgent é a fonte de verdade sobre o **estado atual** de um cliente e projeto (quem é, qual o objetivo ativo agora). O MemoryAgent é a fonte de verdade sobre **o que aconteceu ao longo do tempo** (decisões passadas, preferências observadas, histórico de interações). Um descreve o presente; o outro preserva o passado. Essa distinção evita duplicação de responsabilidade entre os dois agentes.

---

## 4. Fluxo de Orquestração

Todo fluxo de trabalho da IA no MarketingAI segue a mesma sequência lógica, independentemente do tipo de solicitação:

```
Usuário
  ↓
StrategyAgent
  ↓
Análise do objetivo
  ↓
Seleção dos especialistas
  ↓
Execução paralela quando possível
  ↓
Consolidação das respostas
  ↓
Validação
  ↓
Resposta única ao usuário
```

**Detalhamento de cada etapa:**

1. **Usuário.** A solicitação chega em linguagem natural, sem que o usuário precise saber qual especialista será necessário.
2. **StrategyAgent.** Recebe a solicitação como único ponto de entrada da IA.
3. **Análise do objetivo.** O StrategyAgent interpreta o que o usuário realmente precisa, consultando o ClientAgent (contexto atual) e, quando relevante, o MemoryAgent (histórico e preferências) para entender a solicitação com profundidade suficiente.
4. **Seleção dos especialistas.** Com o objetivo claro, o StrategyAgent decide quais especialistas são necessários e em que ordem lógica devem atuar — respeitando as dependências naturais entre eles (ex.: KnowledgeAgent antes de CopyAgent, quando há necessidade de referência prévia).
5. **Execução paralela quando possível.** Especialistas sem dependência entre si podem ser acionados simultaneamente (ex.: consultar KnowledgeAgent e ClientAgent ao mesmo tempo), reduzindo o tempo total do fluxo. Especialistas com dependência (ex.: CopyAgent depende do resultado do KnowledgeAgent) são acionados em sequência.
6. **Consolidação das respostas.** O StrategyAgent reúne as saídas de todos os especialistas envolvidos em um único entregável coerente, resolvendo qualquer inconsistência entre elas.
7. **Validação.** O StrategyAgent verifica se o entregável consolidado atende ao objetivo original e identifica se alguma etapa exige aprovação humana antes de prosseguir (ver Seção 5).
8. **Resposta única ao usuário.** O usuário recebe uma resposta única, coerente e completa — nunca uma sequência de respostas fragmentadas por especialista.

---

## 5. Aprovação Humana

A aprovação humana é um princípio inquebrável herdado diretamente do `00_PRODUCT_BLUEPRINT.md`: *"a decisão final é sempre humana"*. Na prática da orquestração de IA, isso significa que determinadas ações **nunca** são executadas de forma autônoma pelo sistema, independentemente de quão confiante a IA esteja no resultado.

Exigem aprovação humana explícita, no mínimo:

- **Publicação de campanhas.** Toda campanha estruturada pelo GoogleAdsAgent é entregue como rascunho; a publicação real só ocorre após revisão e aprovação do usuário.
- **Alterações críticas.** Qualquer mudança relevante em uma campanha já publicada ou em uma landing page já ativa (ex.: mudança de orçamento significativa, mudança de público, reescrita substancial de conteúdo publicado).
- **Exclusões.** Qualquer exclusão de cliente, projeto, campanha ou landing page.
- **Mudanças irreversíveis.** Qualquer ação cujo efeito não possa ser desfeito de forma simples pelo próprio usuário dentro da plataforma.

O StrategyAgent é o responsável por identificar, durante a etapa de Validação (Seção 4), quando uma ação consolidada se enquadra em uma dessas categorias, e por apresentar essa ação ao usuário como uma decisão pendente — nunca como um fato já consumado.

---

## 6. Compartilhamento de Contexto

Os agentes especialistas não compartilham contexto entre si diretamente — todo compartilhamento de contexto passa pelo StrategyAgent, que atua como intermediário único. Essa regra evita duas falhas comuns em sistemas multiagente: duplicação de responsabilidade e divergência de informação.

Princípios de compartilhamento de contexto:

- **Fonte única por tipo de informação.** Contexto de cliente/projeto vem sempre do ClientAgent; histórico e preferências vêm sempre do MemoryAgent; referências e boas práticas vêm sempre do KnowledgeAgent. Nenhum outro agente mantém cópia própria dessas informações.
- **Contexto flui através do StrategyAgent.** Um especialista nunca solicita informação diretamente a outro especialista; ele recebe o que precisa do StrategyAgent, que já consultou a fonte correta.
- **Nenhuma duplicação de função.** Se dois agentes parecem capazes de responder à mesma pergunta, isso é tratado como falha de design a ser corrigida — cada tipo de informação tem exatamente um dono.
- **Registro automático de aprendizado.** Ao final de cada fluxo, decisões relevantes (aprovações, preferências reveladas, resultados obtidos) são registradas pelo MemoryAgent, para que fluxos futuros não recomecem do zero.

---

## 7. Princípios

Os seguintes princípios são obrigatórios para toda Inteligência Artificial construída dentro do MarketingAI, presente ou futura:

1. **Nunca executar ações irreversíveis sem aprovação humana.**
2. **Sempre explicar o motivo das recomendações**, nunca entregar um resultado sem justificativa rastreável.
3. **Trabalhar com responsabilidade única** — cada agente resolve exatamente um domínio, nunca mais que isso.
4. **Compartilhar contexto de forma centralizada**, nunca duplicar ou divergir informação entre agentes.
5. **Evitar duplicação de funções** — nenhuma capacidade deve existir em mais de um agente.
6. **Manter histórico das decisões**, para que o sistema aprenda com o tempo em vez de repetir esforço.
7. **Priorizar qualidade em vez de velocidade** — um resultado mais lento e correto é sempre preferível a um resultado rápido e raso.
8. **O usuário nunca fala com um especialista diretamente** — apenas com o StrategyAgent.
9. **Nenhum agente publica ou executa fora da plataforma por conta própria** — toda saída com efeito externo passa por revisão humana antes de se tornar real.

---

## 8. Exemplos de Fluxos

### Fluxo 1 — Criação de campanha

**Usuário:** *"Quero criar uma campanha para a Dra. Sarah."*

```
StrategyAgent
   ↓
ClientAgent        (contexto e objetivo da Dra. Sarah)
   ↓
KnowledgeAgent      (referências e campanhas anteriores relevantes)
   ↓
CopyAgent           (títulos, descrições e CTAs dos anúncios)
   ↓
GoogleAdsAgent       (estrutura da campanha, grupos, palavras-chave, orçamento sugerido)
   ↓
StrategyAgent        (consolidação e validação)
   ↓
Resposta ao usuário: rascunho de campanha pronto para aprovação
```

### Fluxo 2 — Criação de Landing Page

**Usuário:** *"Preciso de uma landing page para o lançamento do novo serviço da Dra. Sarah."*

```
StrategyAgent
   ↓
ClientAgent        (contexto e objetivo do lançamento)
   ↓
KnowledgeAgent      (templates inteligentes e referências relevantes)
   ↓
LandingPageAgent     (estrutura da página a partir do template)
   ↓
CopyAgent            (textos e chamadas para ação da página)
   ↓
StrategyAgent        (consolidação e validação)
   ↓
Resposta ao usuário: landing page pronta para revisão
```

### Fluxo 3 — Análise de campanha

**Usuário:** *"Como está performando a campanha da Dra. Sarah este mês?"*

```
StrategyAgent
   ↓
ClientAgent        (identificação da campanha e do contexto)
   ↓
AnalyticsAgent       (interpretação de CTR, CPC, conversões e comportamento)
   ↓
StrategyAgent        (consolidação e validação)
   ↓
Resposta ao usuário: análise de desempenho com pontos de atenção
```

### Fluxo 4 — Geração de relatório

**Usuário:** *"Me manda o relatório do último trimestre da Dra. Sarah."*

```
StrategyAgent
   ↓
ClientAgent        (contexto do cliente e período solicitado)
   ↓
AnalyticsAgent       (interpretação dos dados do período)
   ↓
ReportAgent          (montagem do relatório e recomendações)
   ↓
StrategyAgent        (consolidação e validação)
   ↓
Resposta ao usuário: relatório completo com recomendações de próximos passos
```

### Fluxo 5 — Melhoria de SEO

**Usuário:** *"A landing page da Dra. Sarah pode melhorar em SEO?"*

```
StrategyAgent
   ↓
ClientAgent        (contexto da página e do objetivo do cliente)
   ↓
KnowledgeAgent      (boas práticas de SEO relevantes)
   ↓
SEOAgent             (avaliação técnica e on-page, recomendações)
   ↓
CopyAgent            (reescrita de trechos recomendados, quando aplicável)
   ↓
StrategyAgent        (consolidação e validação)
   ↓
Resposta ao usuário: recomendações de SEO, com ajustes de texto propostos para aprovação
```

> Em todos os fluxos acima, o **MemoryAgent** atua de forma transversal: é consultado silenciosamente pelo StrategyAgent durante a etapa de Análise do Objetivo (para recuperar histórico e preferências relevantes) e recebe o registro do resultado final ao término do fluxo — por isso não aparece como uma etapa visível na cadeia de execução, mas participa de todo fluxo.

---

## 9. Objetivo Final

Este documento é a Constituição da Inteligência Artificial do MarketingAI. Toda implementação futura de IA no produto — a definição técnica de cada agente, seus mecanismos internos e sua forma de comunicação — deve ser construída em conformidade estrita com a filosofia, a arquitetura, as responsabilidades e os princípios definidos aqui.

Nenhuma decisão técnica futura pode contrariar:

- A existência de um único ponto de contato com o usuário (StrategyAgent).
- A responsabilidade única de cada agente especialista.
- A exigência de aprovação humana antes de qualquer ação irreversível ou publicação externa.
- Os princípios definidos na Seção 7.

Este documento deve ser lido, em conjunto com `00_PRODUCT_BLUEPRINT.md`, por todo desenvolvedor que venha a implementar qualquer parte da camada de Inteligência Artificial do MarketingAI.
