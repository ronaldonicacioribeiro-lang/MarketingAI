# 07 — Roadmap Estratégico

**Produto:** MarketingAI
**Documento:** Evolução Estratégica do Produto
**Base:** `00_PRODUCT_BLUEPRINT.md`, `01_VISION.md`, `02_PRD.md`, `03_ARCHITECTURE.md`, `04_AI_ORCHESTRATION.md`, `05_DATABASE.md`, `06_API.md`
**Status:** Fundacional

> Este documento não é um cronograma. Ele não contém datas, prazos ou estimativas de tempo. Ele representa a **sequência estratégica de evolução** do MarketingAI — o que vem primeiro, o que vem depois, e por quê — mantendo o produto sempre coerente com o `00_PRODUCT_BLUEPRINT.md`.

---

# Objetivo do Roadmap

O MarketingAI só cumpre sua missão se evoluir na ordem certa. Um produto que tenta entregar tudo de uma vez corre dois riscos ao mesmo tempo: atrasa a validação do que realmente importa, e acumula complexidade antes de provar que ela é necessária — exatamente o tipo de crescimento especulativo que o `00_PRODUCT_BLUEPRINT.md` trata como princípio inquebrável a evitar.

Evoluir de forma incremental significa que cada versão do MarketingAI precisa se sustentar sozinha: entregar valor real, ser usável de ponta a ponta e gerar aprendizado suficiente para justificar a versão seguinte. Este roadmap existe para que toda decisão de "o que construir agora" tenha uma resposta clara — e para que "o que construir depois" nunca seja decidido por pressão de momento, e sim por evolução consciente do que já foi validado.

---

# MVP (Versão 1.0)

O MVP é a menor versão do MarketingAI capaz de resolver, de ponta a ponta, o fluxo essencial descrito em `02_PRD.md` e `03_ARCHITECTURE.md`: transformar objetivo em execução com apoio de Inteligência Artificial, para uma única empresa operando internamente.

### Login

Todo o resto do sistema depende de um usuário identificado. É o pré-requisito funcional de qualquer outra entrega — sem ele, nenhuma outra funcionalidade tem contexto de "para quem" está sendo executada. Corresponde aos módulos Autenticação e Usuários definidos em `03_ARCHITECTURE.md`.

### Dashboard

É o ponto de entrada do usuário e a primeira prova de valor do produto: uma visão consolidada do que precisa de atenção. Sem ele, o usuário teria que navegar entre módulos para descobrir o que está pendente, contrariando o objetivo de reduzir esforço operacional.

### Clientes

É a base de contexto de todo o sistema, conforme `05_DATABASE.md`. Nenhuma outra funcionalidade — projeto, campanha, relatório — tem sentido sem um cliente ao qual pertença.

### Projetos

É onde o objetivo de negócio é declarado e onde todo trabalho da IA passa a ser rastreável, conforme a regra estrutural definida em `05_DATABASE.md`. Sem projetos, não existe unidade de trabalho coerente para organizar landing pages, campanhas e relatórios.

### Templates Inteligentes

Foram escolhidos como parte do MVP porque sustentam diretamente a decisão arquitetural já aprovada em `03_ARCHITECTURE.md`: landing pages nascem de templates, não de criação livre, garantindo consistência e velocidade desde a primeira entrega.

### Landing Pages

É um dos dois entregáveis de execução do MVP (junto com Google Ads) — a materialização direta da proposta de valor do produto: transformar objetivo em artefato de marketing pronto para uso.

### Google Ads

É o segundo entregável de execução do MVP. Foi priorizado como único canal de mídia paga da primeira versão — conforme decisão explícita de `03_ARCHITECTURE.md` — para provar com profundidade o modelo de geração assistida com aprovação humana antes de expandir para outros canais.

### Assistente de IA

É a camada que torna todo o resto possível. Sem o StrategyAgent como ponto único de conversa, definido em `04_AI_ORCHESTRATION.md`, o usuário teria que operar cada módulo manualmente — o oposto do que o MarketingAI se propõe a ser.

### Biblioteca

Entra no MVP porque sustenta o KnowledgeAgent desde o primeiro dia: sem uma base de referência e templates para consultar, a geração de landing pages e campanhas perderia consistência e qualidade já na primeira entrega.

### Relatórios Básicos

O ciclo de marketing só se fecha quando o resultado é interpretado e comunicado. Relatórios básicos garantem que o MVP entregue o ciclo completo — objetivo, execução, resultado — mesmo que ainda de forma simples.

### Analytics Básico

É o pré-requisito de dado para que Relatórios Básicos e Insights Básicos existam. Sem uma coleta mínima de desempenho, não há o que interpretar nem recomendar.

### Insights Básicos

Foram incluídos no MVP em versão simples para validar, desde já, um dos diferenciais centrais do produto — a IA identificando oportunidades além do que foi diretamente solicitado — sem exigir ainda um mecanismo sofisticado de recomendação. Corresponde ao módulo Insights definido em `03_ARCHITECTURE.md`. A camada avançada de recomendação proativa contínua permanece fora do MVP (ver `02_PRD.md`, Baixa Prioridade).

---

# Versão 1.1

A Versão 1.1 representa a maturação natural do que o MVP validou, sem introduzir novos módulos:

- **Melhorias na IA.** Refinamento da qualidade das respostas do StrategyAgent e dos especialistas, com base no uso real acumulado durante o MVP.
- **Novos templates.** Ampliação da variedade de templates inteligentes disponíveis na Biblioteca, a partir dos padrões de uso observados.
- **Mais relatórios.** Novos formatos e recortes de relatório, além do relatório básico do MVP, respondendo a perguntas de negócio que surgirem no uso real.
- **Melhor experiência do usuário.** Ajustes de fluxo, navegação e clareza nos módulos existentes, com base em fricções reais identificadas pelos primeiros usuários.
- **Pesquisa assistida de mercado e concorrência.** Capacidade originalmente prevista como Alta Prioridade em `02_PRD.md`, mas redefinida para esta versão: entra depois do MVP para não atrasar a validação do fluxo essencial (objetivo → execução → resultado), mas é a primeira nova capacidade de domínio da Versão 1.1, dado seu valor já validado como necessidade real do usuário.

A regra que rege a Versão 1.1 é simples: nenhuma funcionalidade nova de domínio é introduzida além da Pesquisa de Mercado — o restante é aprofundamento do que já existe.

---

# Versão 2.0

A Versão 2.0 introduz capacidade avançada, apoiada na confiança já construída com o MVP e a Versão 1.1:

- **SEO.** Ativação do SEOAgent e do domínio SEO — já definidos em `04_AI_ORCHESTRATION.md` e `06_API.md`, mas intencionalmente inativos até esta versão (nem em versão básica, conforme `03_ARCHITECTURE.md`) — com recomendações técnicas, on-page e de palavras-chave.
- **Automações.** Fluxos que reduzem a necessidade de o usuário solicitar manualmente ações recorrentes, sempre respeitando os pontos de aprovação humana já estabelecidos em `04_AI_ORCHESTRATION.md` e `06_API.md`.
- **Fluxos inteligentes.** Sequências de trabalho compostas, coordenadas pelo StrategyAgent, que hoje exigiriam múltiplas solicitações separadas do usuário.
- **Mais integrações.** Expansão além de Google Ads como único canal de mídia paga, seguindo o mesmo padrão de geração assistida com aprovação — conforme trajetória de escalabilidade já prevista em `03_ARCHITECTURE.md`.
- **Editor visual de Landing Pages.** Camada de edição mais rica sobre o que hoje é gerado a partir de template, dando ao usuário mais controle fino sobre o resultado final.

---

# Versão 3.0

A Versão 3.0 representa a visão de longo prazo já registrada em `00_PRODUCT_BLUEPRINT.md`:

- **Multiempresa.** Evolução do modelo de dados — já preparado desde o MVP através da entidade Empresa (`05_DATABASE.md`) — para suportar múltiplas empresas operando de forma isolada na mesma plataforma.
- **SaaS.** Consolidação do MarketingAI como produto comercial independente, com onboarding autônomo e operação segura de dados de múltiplos clientes pagantes.
- **Marketplace.** Espaço para templates, integrações ou capacidades adicionais oferecidas por terceiros dentro do ecossistema do produto.
- **Plugins.** Extensibilidade controlada, permitindo que novas capacidades sejam adicionadas sem alterar o núcleo do sistema.
- **IA cada vez mais autônoma.** Ampliação gradual da autonomia dos agentes especialistas, sempre dentro dos limites de aprovação humana que permanecem inquebráveis em qualquer versão do produto.

---

# Critérios de Evolução

Nenhuma funcionalidade nova entra no roadmap do MarketingAI sem passar pelos seguintes critérios, na mesma lógica de decisão já estabelecida em `00_PRODUCT_BLUEPRINT.md`:

1. **Está alinhada à missão e à visão do produto?** Uma funcionalidade que não aproxima o MarketingAI de sua missão não entra, independentemente de quão interessante pareça tecnicamente.
2. **Resolve um problema real já validado pelo uso, não uma hipótese?** Funcionalidades especulativas, sem evidência de necessidade real, aguardam validação antes de entrar no roadmap.
3. **Respeita os princípios inquebráveis de IA e de produto?** Nenhuma funcionalidade pode contornar aprovação humana, explicabilidade ou segurança de dados.
4. **É a evolução mais simples possível do que já existe?** Prefere-se sempre aprofundar um módulo existente a criar um novo, quando ambos resolvem o mesmo problema.
5. **Tem relação clara com a versão em que está sendo proposta?** Uma funcionalidade de Versão 3.0 não deve ser antecipada para o MVP apenas por conveniência de desenvolvimento.
6. **Foi avaliada quanto ao seu impacto nos módulos e agentes já existentes?** Nenhuma funcionalidade nova pode comprometer a responsabilidade única de um módulo ou agente já definido.

---

# Funcionalidades Fora do Escopo Atual

Não fazem parte do MVP (Versão 1.0):

- Suporte a múltiplas empresas (multi-tenant).
- Publicação automática de campanhas sem aprovação humana.
- Canais de mídia paga além de Google Ads.
- Editor visual avançado de Landing Pages — o MVP entrega geração por template, não edição visual livre.
- **SEO, em qualquer grau** (básico ou avançado) — o SEOAgent e o domínio SEO já estão definidos em `04_AI_ORCHESTRATION.md` e `06_API.md`, mas permanecem inativos até a Versão 2.0.
- **Pesquisa assistida de mercado e concorrência** — redefinida para a Versão 1.1 (ver acima); não faz parte do MVP.
- Automações e fluxos inteligentes compostos.
- Marketplace e sistema de plugins de terceiros.
- Qualquer ampliação da autonomia dos agentes além da geração assistida com aprovação humana já definida em `04_AI_ORCHESTRATION.md`.
- Integrações externas além do escopo funcional já definido em `03_ARCHITECTURE.md` e `06_API.md`.

---

# Princípios

- **Simplicidade antes de amplitude.** O produto cresce em profundidade antes de crescer em número de funcionalidades.
- **Qualidade antes de velocidade de lançamento.** Nenhuma versão é lançada apenas para "ter mais recursos" — cada entrega precisa manter o padrão de qualidade definido em `00_PRODUCT_BLUEPRINT.md`.
- **Escalabilidade sem reconstrução.** Toda evolução deve seguir as fronteiras já estabelecidas em `03_ARCHITECTURE.md` e `05_DATABASE.md`, crescendo por extensão, nunca por reescrita.
- **Valor real ao usuário como critério final.** Nenhuma funcionalidade entra no roadmap apenas por ser tecnicamente possível — precisa resolver um problema real de quem usa o produto.
- **Evitar funcionalidades desnecessárias.** Toda proposta de nova funcionalidade deve justificar por que não pode esperar, e por que não é uma complexidade especulativa disfarçada de oportunidade.
- **Coerência entre versões.** Nenhuma versão contradiz a anterior — o roadmap evolui, não se reinventa a cada etapa.
