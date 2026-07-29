# 06 — Arquitetura Funcional das APIs

**Produto:** MarketingAI
**Documento:** Arquitetura Funcional das APIs
**Base:** `00_PRODUCT_BLUEPRINT.md`, `01_VISION.md`, `02_PRD.md`, `03_ARCHITECTURE.md`, `04_AI_ORCHESTRATION.md`, `05_DATABASE.md`
**Status:** Fundacional

> Este documento define **como as capacidades do MarketingAI são expostas funcionalmente**, não como são implementadas. Não define tecnologia, formato de contrato, protocolo, nem exemplos técnicos de requisição ou resposta — isso pertence a um documento técnico futuro. O que este documento estabelece é definitivo: os domínios de capacidade do sistema, as operações que cada um oferece e as regras de negócio que governam essas operações.

---

# Filosofia das APIs

As APIs do MarketingAI existem para expor **ações de negócio**, não para expor operações genéricas de criar, ler, atualizar e apagar registros.

Essa distinção é central para o produto. Um sistema que expõe apenas CRUD trata "criar uma campanha" e "aprovar uma campanha" como a mesma coisa — inserir ou alterar um registro. O MarketingAI trata essas duas ações como fundamentalmente diferentes: uma é geração assistida por IA, sujeita a revisão; a outra é uma decisão humana com efeito real. Se a API fosse desenhada em torno de CRUD, essa diferença desapareceria na camada de contrato, e o sistema perderia exatamente a distinção que sustenta o princípio de aprovação humana definido em `00_PRODUCT_BLUEPRINT.md` e detalhado em `04_AI_ORCHESTRATION.md`.

Por isso, cada capacidade exposta pelo MarketingAI representa uma ação com significado de negócio — "solicitar geração de campanha", "aprovar campanha", "aceitar insight" — e não uma manipulação genérica de tabela. Essa filosofia também mantém a API alinhada ao modelo de dados descrito em `05_DATABASE.md`: cada entidade de domínio é manipulada através de ações que respeitam seu propósito, não através de acesso irrestrito à sua estrutura interna.

---

# Domínios das APIs

Cada domínio a seguir corresponde a uma área de responsabilidade funcional do sistema. Para cada um: objetivo, responsabilidades, operações disponíveis (descritas como ações de negócio) e regras de negócio que as governam.

### Autenticação

- **Objetivo:** Garantir que apenas usuários legítimos da Empresa tenham acesso ao sistema.
- **Responsabilidades:** Validar identidade, manter sessão ativa, permitir encerramento de sessão e recuperação de acesso.
- **Operações disponíveis:** Autenticar usuário; encerrar sessão; solicitar recuperação de acesso; redefinir credencial de acesso.
- **Regras de negócio:** Toda operação em qualquer outro domínio depende de uma sessão autenticada válida. Falhas de autenticação nunca revelam se uma conta existe ou não, por princípio de segurança.

### Usuários

- **Objetivo:** Gerenciar as pessoas que operam a plataforma.
- **Responsabilidades:** Cadastro, atualização e desativação de usuários dentro de uma Empresa.
- **Operações disponíveis:** Cadastrar usuário; atualizar perfil; consultar usuário; desativar usuário.
- **Regras de negócio:** Todo usuário pertence a exatamente uma Empresa (decisão de MVP registrada em `03_ARCHITECTURE.md`). Desativar um usuário nunca apaga sua autoria em ações e artefatos já registrados — a rastreabilidade é preservada.

### Clientes

- **Objetivo:** Gerenciar os clientes de marketing atendidos pela Empresa.
- **Responsabilidades:** Manter cadastro e contexto de cada cliente atualizado, servindo de base ao ClientAgent.
- **Operações disponíveis:** Cadastrar cliente; atualizar contexto do cliente; consultar cliente; arquivar cliente.
- **Regras de negócio:** Todo cliente pertence a uma Empresa. Arquivar (ou excluir) um cliente é uma mudança irreversível e exige aprovação humana explícita, conforme `04_AI_ORCHESTRATION.md`.

### Projetos

- **Objetivo:** Gerenciar as iniciativas concretas de marketing conduzidas para um cliente.
- **Responsabilidades:** Criar projetos, associar objetivos, acompanhar seu estado e sua timeline.
- **Operações disponíveis:** Criar projeto; definir ou atualizar objetivo; consultar projeto; consultar timeline do projeto; encerrar projeto.
- **Regras de negócio:** Todo projeto pertence a um cliente e possui exatamente um objetivo ativo por vez. Todo artefato de produção do sistema (landing page, campanha, relatório) deve estar associado a um projeto — não existe produção "solta", conforme regra estrutural de `05_DATABASE.md`.

### Landing Pages

- **Objetivo:** Gerar e gerenciar páginas de conversão a partir de templates inteligentes.
- **Responsabilidades:** Solicitar geração assistida por IA, permitir edição do resultado e organizar as páginas de um projeto.
- **Operações disponíveis:** Solicitar geração de landing page; consultar landing page; editar landing page; publicar landing page; arquivar landing page.
- **Regras de negócio:** Toda geração passa pela camada de Inteligência Artificial (LandingPageAgent e CopyAgent), nunca por edição manual "do zero" fora do fluxo assistido. Alterações em uma landing page já publicada são tratadas como alteração crítica e exigem aprovação humana, conforme `04_AI_ORCHESTRATION.md`.

### Google Ads

- **Objetivo:** Gerar campanhas de Google Ads assistidas por IA, sempre sujeitas a aprovação antes de publicação.
- **Responsabilidades:** Estruturar campanha, grupos de anúncios, palavras-chave e anúncios; manter o status de rascunho até aprovação explícita.
- **Operações disponíveis:** Solicitar geração de campanha; consultar rascunho de campanha; editar rascunho; aprovar campanha; publicar campanha; pausar campanha; encerrar campanha.
- **Regras de negócio:** Nenhuma campanha é publicada automaticamente — a publicação só pode ocorrer após a operação explícita de aprovação, nunca como consequência direta da geração. Toda campanha pertence a um projeto.

### Analytics

- **Objetivo:** Coletar e organizar os dados de desempenho de landing pages e campanhas.
- **Responsabilidades:** Registrar snapshots de desempenho e disponibilizar o dado bruto estruturado para interpretação.
- **Operações disponíveis:** Registrar snapshot de desempenho; consultar histórico de desempenho de um artefato; solicitar interpretação de desempenho (aciona o AnalyticsAgent).
- **Regras de negócio:** Este domínio organiza dado, mas não o interpreta — interpretação é responsabilidade do domínio de Inteligência Artificial, conforme separação de responsabilidades definida em `03_ARCHITECTURE.md`.

### SEO

> **Nota de escopo:** este domínio está definido desde já, mas não faz parte do MVP — sua ativação está prevista para a Versão 2.0, conforme `03_ARCHITECTURE.md` e `07_ROADMAP.md`.

- **Objetivo:** Avaliar e recomendar melhorias de SEO para conteúdos e páginas existentes.
- **Responsabilidades:** Acionar o SEOAgent sobre uma landing page ou conteúdo e apresentar recomendações.
- **Operações disponíveis:** Solicitar avaliação de SEO; consultar recomendações; solicitar aplicação de um ajuste recomendado.
- **Regras de negócio:** O SEOAgent nunca aplica alteração diretamente — apenas recomenda. Aplicar uma recomendação sobre uma página já publicada é tratado como alteração crítica e exige aprovação humana.

### Relatórios

- **Objetivo:** Consolidar o desempenho interpretado de um projeto em um período.
- **Responsabilidades:** Gerar relatórios a partir de análises de desempenho e apresentar recomendações de próximos passos.
- **Operações disponíveis:** Solicitar geração de relatório; consultar relatório; consultar histórico de relatórios de um projeto.
- **Regras de negócio:** Todo relatório pertence a um projeto e é construído a partir de snapshots de Analytics já interpretados pelo AnalyticsAgent — nunca a partir de dado bruto direto.

### Biblioteca

- **Objetivo:** Gerenciar os ativos reutilizáveis da Empresa — templates e documentos de referência.
- **Responsabilidades:** Armazenar, organizar e disponibilizar itens para reuso entre projetos e clientes.
- **Operações disponíveis:** Adicionar item à biblioteca; consultar itens; atualizar item; arquivar item.
- **Regras de negócio:** Itens da Biblioteca pertencem à Empresa, não a um projeto específico — é a exceção deliberada à regra de que toda entidade de produção pertence a um projeto, conforme `05_DATABASE.md`.

### Insights

- **Objetivo:** Apresentar ao usuário oportunidades identificadas pela Inteligência Artificial.
- **Responsabilidades:** Registrar e disponibilizar insights gerados por qualquer especialista durante sua execução normal.
- **Operações disponíveis:** Consultar insights de um projeto; aceitar insight; descartar insight.
- **Regras de negócio:** Um insight nunca é executado automaticamente. Aceitar um insight é sempre uma decisão humana explícita, que pode gerar uma nova tarefa ou acionar um novo fluxo — nunca uma ação direta e imediata.

### Inteligência Artificial

- **Objetivo:** Expor, de forma unificada, a capacidade de solicitar trabalho à camada de IA do sistema.
- **Responsabilidades:** Receber a solicitação do usuário, acionar o StrategyAgent e devolver uma resposta consolidada.
- **Operações disponíveis:** Enviar solicitação ao StrategyAgent; consultar status de uma solicitação em andamento; consultar histórico de interações de um projeto.
- **Regras de negócio:** Este é o único domínio pelo qual qualquer capacidade de Inteligência Artificial é acessada. Nenhum agente especialista é exposto individualmente — o detalhamento está na Seção "API da Inteligência Artificial" a seguir.

### Configurações

- **Objetivo:** Gerenciar os parâmetros operacionais da Empresa e do usuário.
- **Responsabilidades:** Manter preferências gerais de funcionamento do sistema.
- **Operações disponíveis:** Consultar configurações; atualizar configurações.
- **Regras de negócio:** Este domínio nunca contém regra de negócio de marketing — apenas parâmetros operacionais, conforme `03_ARCHITECTURE.md`.

---

# Fluxos de Negócio

### Criação de Projeto

O usuário seleciona um Cliente já cadastrado (ou cadastra um novo, via domínio Clientes) e cria um Projeto associado a ele, definindo o Objetivo que vai orientar todo trabalho subsequente. A criação do projeto é o evento fundacional que abre a timeline registrada no domínio de Projetos e que passa a ser referenciada por qualquer artefato gerado a partir dali.

### Geração de Landing Page

A partir de um Projeto com Objetivo definido, o usuário solicita a geração de uma landing page. A solicitação é recebida pelo domínio de Inteligência Artificial, que aciona o StrategyAgent; este consulta o ClientAgent (contexto) e o KnowledgeAgent (templates e referências), aciona o LandingPageAgent para a estrutura e o CopyAgent para os textos, e devolve o resultado consolidado ao domínio de Landing Pages para revisão do usuário.

### Criação de Campanha

A partir de um Projeto com Objetivo definido, o usuário solicita a geração de uma campanha de Google Ads. O domínio de Inteligência Artificial aciona o StrategyAgent, que consulta ClientAgent e KnowledgeAgent, aciona o CopyAgent para os textos de anúncio e o GoogleAdsAgent para estruturar campanha, grupos, palavras-chave e orçamento sugerido. O resultado retorna ao domínio Google Ads como rascunho. A publicação só ocorre depois de uma operação de aprovação explícita, separada da geração.

### Análise de Desempenho

O domínio de Analytics registra snapshots de desempenho de landing pages e campanhas ao longo do tempo. Quando o usuário solicita uma análise, o domínio de Inteligência Artificial aciona o StrategyAgent, que consulta o ClientAgent para contexto e aciona o AnalyticsAgent, que interpreta os snapshots disponíveis (CTR, CPC, conversões, comportamento) e devolve uma análise consolidada.

### Geração de Relatório

O usuário solicita um relatório de um projeto em um determinado período. O StrategyAgent consulta o ClientAgent para contexto, aciona o AnalyticsAgent para interpretar os dados do período e, em seguida, o ReportAgent para consolidar essa interpretação em um relatório com recomendações. O resultado é entregue ao domínio de Relatórios e associado ao projeto correspondente.

### Recomendações da IA

Insights não são necessariamente solicitados pelo usuário — podem surgir como subproduto de outros fluxos (ex.: o AnalyticsAgent identifica uma oportunidade durante uma análise de desempenho já solicitada por outro motivo). Quando isso ocorre, o domínio de Insights registra a oportunidade, associada ao projeto e ao artefato que a originou. O usuário consulta os insights pendentes e decide aceitá-los (o que pode originar uma nova Tarefa ou acionar um novo fluxo) ou descartá-los — nunca são executados de forma automática.

---

# API da Inteligência Artificial

Todo acesso à capacidade de Inteligência Artificial do MarketingAI passa por um único domínio funcional — **Inteligência Artificial** — que representa, na camada de API, o mesmo princípio definido em `04_AI_ORCHESTRATION.md`: **o StrategyAgent é o único ponto de contato com o usuário.**

Isso significa que:

- Não existe operação de API que acione um agente especialista (ClientAgent, KnowledgeAgent, LandingPageAgent, CopyAgent, GoogleAdsAgent, AnalyticsAgent, SEOAgent, ReportAgent, MemoryAgent) diretamente. Toda solicitação passa pelo StrategyAgent, que decide internamente quais especialistas envolver.
- O domínio de Inteligência Artificial recebe a solicitação do usuário (em linguagem natural ou através de uma ação de negócio específica de outro domínio, como "solicitar geração de landing page") e devolve sempre uma resposta única e consolidada — nunca uma resposta fragmentada por especialista.
- A seleção, ordenação e eventual execução em paralelo dos especialistas, descritas em `04_AI_ORCHESTRATION.md`, são inteiramente internas ao domínio de Inteligência Artificial e não são expostas como operações de API independentes.
- Outros domínios funcionais (Landing Pages, Google Ads, Analytics, Relatórios, SEO) expõem operações de negócio próprias (ex.: "solicitar geração de campanha"), mas essas operações, internamente, delegam ao domínio de Inteligência Artificial a execução real — mantendo a experiência do usuário centrada na ação de negócio, não na mecânica de IA por trás dela.

Essa centralização não é apenas uma escolha técnica — é a garantia funcional de que o comportamento da IA permanece coerente, auditável e único em toda a plataforma.

---

# Aprovação Humana

Refletindo diretamente o princípio inquebrável definido em `04_AI_ORCHESTRATION.md`, as seguintes operações **sempre** exigem uma confirmação humana explícita e separada antes de sua execução:

- **Publicar campanha** (domínio Google Ads) — nunca ocorre como consequência automática da geração.
- **Aplicar alteração crítica** em uma landing page ou campanha já publicada (domínios Landing Pages e Google Ads).
- **Arquivar ou excluir** um Cliente, Projeto, Campanha ou Landing Page (domínios Clientes, Projetos, Landing Pages, Google Ads).
- **Aceitar um Insight** que resulte em uma mudança irreversível sobre um artefato já publicado (domínio Insights).

A operação de aprovação é sempre distinta e posterior à operação que produziu o artefato — nunca implícita, nunca combinada em uma única ação. Essa separação existe para que o usuário nunca seja surpreendido por uma ação com efeito real que ele não tenha explicitamente autorizado.

---

# Eventos de Negócio

O sistema gera eventos sempre que um fato relevante de negócio ocorre. Esses eventos não são operações que o usuário aciona diretamente — são registros do que já aconteceu, disponibilizados para que outros módulos internos reajam a eles sem que os domínios precisem conhecer os detalhes internos uns dos outros.

Principais eventos de negócio:

- **Projeto criado** / **Objetivo definido** — consumido pelo Dashboard (para refletir novo trabalho em andamento) e pela Timeline do projeto.
- **Landing page gerada** / **Campanha gerada** — consumido pela Timeline do projeto e pelo domínio de Insights (que pode gerar observações sobre o artefato recém-criado).
- **Campanha aprovada** / **Campanha publicada** — consumido pela Timeline do projeto, pelo domínio de Auditoria (ver `05_DATABASE.md`) e pelo módulo Analytics (que passa a monitorar o artefato publicado).
- **Snapshot de desempenho registrado** — consumido pelo domínio de Relatórios (quando um relatório está em elaboração) e pelo domínio de Insights (para identificar oportunidades).
- **Relatório gerado** — consumido pela Timeline do projeto e pelo Dashboard (para sinalizar novidade ao usuário).
- **Insight gerado** / **Insight aceito** / **Insight descartado** — consumido pela Timeline do projeto e pelo MemoryAgent (para aprendizado de longo prazo, conforme `05_DATABASE.md`).
- **Estado do projeto alterado** — consumido pelo Dashboard e pela Timeline do projeto.

Esses eventos são o mecanismo funcional pelo qual módulos permanecem desacoplados entre si: um domínio nunca precisa chamar outro diretamente para informá-lo de algo — ele apenas torna o fato disponível, e quem precisa reagir, reage.

---

# Versionamento

- **Evolução aditiva é a norma.** Novas capacidades devem, sempre que possível, ser adicionadas como novas operações ou novos domínios, sem alterar o comportamento de operações já existentes.
- **Compatibilidade antes de conveniência.** Uma mudança que altera o comportamento esperado de uma operação existente é tratada como mudança de ruptura e não deve ser feita silenciosamente — precisa de um caminho de transição claro.
- **Versionamento por domínio, não por sistema inteiro.** Diferentes domínios de API podem evoluir em ritmos diferentes; não é necessário versionar toda a plataforma de uma vez quando apenas um domínio muda.
- **Depreciação com aviso, nunca remoção abrupta.** Uma operação a ser descontinuada deve ser sinalizada como depreciada com antecedência suficiente antes de deixar de existir.
- **Documentação como parte da mudança.** Nenhuma evolução de API é considerada completa sem a atualização da documentação funcional correspondente — evitando divergência entre o que o sistema faz e o que está documentado, princípio herdado de `00_PRODUCT_BLUEPRINT.md`.

---

# Segurança

- **Toda operação exige autenticação válida**, sem exceção — não existe operação de negócio acessível sem uma sessão de usuário legítima.
- **Autorização é sempre delimitada por propriedade.** Um usuário só pode operar sobre Clientes, Projetos e artefatos que pertençam à sua Empresa — nunca a dados de fora desse limite.
- **Toda ação relevante é auditável.** Conforme `05_DATABASE.md`, decisões humanas ficam registradas na Timeline do Projeto e execuções de IA ficam registradas no Log IA — nenhuma operação de negócio relevante ocorre sem deixar rastro de quem, quando e por quê.
- **Princípio do menor privilégio.** Cada operação exposta deve ser acessível apenas a quem realmente precisa dela para cumprir sua função dentro da plataforma.
- **Dados de cliente são tratados como ativo crítico em qualquer operação**, com o mesmo padrão de proteção em toda a API, independentemente de qual domínio os expõe — reafirmando o princípio inquebrável de `00_PRODUCT_BLUEPRINT.md`.

---

# Princípios Arquiteturais

Toda API do MarketingAI, presente ou futura, deve seguir:

1. **Foco em ações de negócio.** Operações representam decisões e intenções reais do usuário ou do sistema — nunca manipulação genérica de dados.
2. **Consistência.** Domínios semelhantes se comportam de forma semelhante; um usuário que aprende a operar um domínio já entende, por analogia, como operar os demais.
3. **Simplicidade.** Cada operação faz exatamente uma coisa clara — nenhuma operação deve exigir que o usuário entenda a mecânica interna da IA para utilizá-la.
4. **Previsibilidade.** O comportamento de uma operação não muda de forma inesperada; efeitos colaterais nunca são implícitos.
5. **Rastreabilidade.** Toda operação relevante pode ser associada a quem a solicitou, quando, e a partir de qual contexto (Cliente, Projeto, Objetivo).
6. **Segurança.** Nenhuma operação compromete dados de cliente ou permite acesso além do que é legitimamente necessário.
7. **Escalabilidade.** Os domínios são desenhados para crescer em capacidade (novos canais, novos formatos, múltiplas empresas) sem exigir reestruturação do que já existe, conforme `03_ARCHITECTURE.md` e `05_DATABASE.md`.
8. **Integração entre módulos via eventos de negócio**, não via acoplamento direto — cada domínio permanece responsável apenas pelo seu próprio escopo.
