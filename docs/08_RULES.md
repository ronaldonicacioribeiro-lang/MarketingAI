# 08 — Regras de Desenvolvimento

**Produto:** MarketingAI
**Documento:** Constituição de Desenvolvimento
**Base:** Todos os documentos de `00` a `07`
**Status:** Fundacional e Soberano para tudo que envolve engenharia

> Este documento é a **Constituição de Desenvolvimento do MarketingAI**. Ele não define tecnologia, framework, linguagem ou exemplo de implementação — define os padrões permanentes de como o projeto é construído, mantido e evoluído, para qualquer pessoa (humana ou IA) que venha a escrever código para este produto. Assim como o `00_PRODUCT_BLUEPRINT.md` governa decisões de produto e o `04_AI_ORCHESTRATION.md` governa o comportamento da IA, este documento governa o **processo de engenharia** — e prevalece sobre qualquer preferência individual, prazo ou pressão de entrega.

---

# Filosofia de Desenvolvimento

- **Qualidade acima de velocidade.** Entregar rápido algo errado custa mais do que entregar no tempo certo algo correto. Nenhuma pressão de prazo justifica reduzir o padrão de qualidade definido neste documento.
- **Simplicidade acima de complexidade.** A solução mais simples que resolve o problema real de hoje é sempre preferível a uma solução mais sofisticada que resolve problemas hipotéticos de amanhã — princípio herdado diretamente de `00_PRODUCT_BLUEPRINT.md`.
- **Documentação sempre atualizada.** Código que diverge da documentação é tratado como defeito, não como detalhe. Se uma implementação muda o comportamento descrito em `03_ARCHITECTURE.md`, `04_AI_ORCHESTRATION.md`, `05_DATABASE.md` ou `06_API.md`, a documentação correspondente deve ser atualizada como parte da mesma entrega — nunca depois, nunca "quando der tempo".
- **Arquitetura orienta a implementação, nunca o contrário.** Nenhuma decisão de código deve forçar uma reinterpretação da arquitetura definida em `03_ARCHITECTURE.md`. Quando a implementação revela que a arquitetura precisa mudar, a mudança é discutida e aprovada conscientemente no documento de arquitetura primeiro — não decidida silenciosamente no código.

---

# Organização do Projeto

- **Módulos** seguem exatamente os domínios funcionais definidos em `03_ARCHITECTURE.md`. Nenhum módulo novo é criado sem que sua responsabilidade esteja primeiro descrita em documentação de arquitetura.
- **Componentes** dentro de um módulo devem refletir uma única responsabilidade reconhecível — se um componente exige um "e" para ser descrito (ex.: "isso faz X e também Y"), é candidato a ser dividido.
- **Documentação** vive exclusivamente na hierarquia numerada de `docs/`, na ordem de precedência já estabelecida em `PROJECT.md`. Nenhuma decisão de produto, arquitetura ou processo é considerada oficial se existir apenas fora dessa hierarquia (conversa, comentário de código, anotação avulsa).
- **Serviços** internos respeitam as fronteiras de domínio definidas em `06_API.md` — um serviço não deve absorver responsabilidade de negócio pertencente a outro domínio.
- **Agentes** de Inteligência Artificial seguem exclusivamente a estrutura, responsabilidades e limites definidos em `04_AI_ORCHESTRATION.md`. Nenhum agente novo é criado, e nenhum agente existente tem sua responsabilidade alterada, sem que isso seja primeiro refletido nesse documento.
- **Recursos compartilhados** (utilitários, referências comuns, ativos reaproveitáveis) só existem quando usados por mais de um módulo de forma comprovada — nunca são criados de forma antecipada "para o caso de precisar depois".

---

# Convenções

- **Nomenclatura reflete o domínio de negócio**, não a implementação técnica. Um artefato deve se chamar pelo que ele é para o produto (ex.: Projeto, Insight, Campanha), na mesma linguagem usada em `05_DATABASE.md` — nunca por um nome técnico genérico que exija tradução mental.
- **Consistência entre documentação e nome real.** Se um módulo, agente ou entidade tem um nome definido em `03_ARCHITECTURE.md`, `04_AI_ORCHESTRATION.md` ou `05_DATABASE.md`, esse é o nome que deve ser usado em toda implementação — sem sinônimos, abreviações não documentadas ou variações.
- **Organização previsível.** Qualquer pessoa nova no projeto deve conseguir prever onde encontrar algo com base na sua responsabilidade de domínio, sem precisar perguntar — a estrutura de pastas reflete a estrutura de módulos, não a conveniência de quem escreveu o código.
- **Padronização acima de preferência pessoal.** Quando existe um padrão já estabelecido no projeto para resolver um tipo de problema, ele deve ser seguido, mesmo que outra abordagem pareça igualmente válida — divergência silenciosa de padrão é tratada como dívida técnica.

---

# Controle de Versão

- **Branches** representam trabalho isolado e têm propósito único e claro — nenhuma branch deve misturar mudanças de domínios ou objetivos não relacionados.
- **Commits** devem ser pequenos, coerentes e descrever o motivo da mudança, não apenas o que mudou — permitindo que o histórico do projeto seja lido como uma narrativa compreensível, no mesmo espírito de rastreabilidade definido em `05_DATABASE.md`.
- **Revisão de código é obrigatória** antes de qualquer integração ao ramo principal do projeto — inclusive para código gerado com apoio de Inteligência Artificial, conforme reforçado na Seção "Uso da Inteligência Artificial".
- **Integração** só ocorre quando a mudança está coerente com a arquitetura vigente, com os testes aplicáveis passando e com a documentação correspondente atualizada — integração é o momento em que qualidade é verificada, não presumida.

---

# Qualidade

Antes de qualquer entrega de funcionalidade, os seguintes critérios mínimos devem estar satisfeitos:

- A funcionalidade está alinhada ao que está descrito em `02_PRD.md`, `03_ARCHITECTURE.md` e, quando aplicável, `04_AI_ORCHESTRATION.md` — nenhuma entrega diverge silenciosamente da documentação oficial.
- A funcionalidade respeita as regras de separação de responsabilidade entre módulos definidas em `03_ARCHITECTURE.md`.
- Nenhuma ação com efeito irreversível ou externo é executada sem o ponto de aprovação humana correspondente, conforme `04_AI_ORCHESTRATION.md` e `06_API.md`.
- A funcionalidade foi validada antes da integração, conforme descrito na Seção "Testes".
- A documentação relevante foi revisada e, se necessário, atualizada.

---

# Definition of Done

Uma funcionalidade só pode ser considerada concluída quando, simultaneamente:

1. **Funciona conforme o objetivo descrito** na documentação de produto correspondente (`01_VISION.md`, `02_PRD.md`).
2. **Respeita a arquitetura vigente** (`03_ARCHITECTURE.md`), sem exceções não documentadas.
3. **Foi validada** por revisão de código e pelos testes aplicáveis, sem pendência conhecida relevante.
4. **Não introduz regressão** em funcionalidade já existente e validada anteriormente.
5. **Está documentada** no nível apropriado — se altera comportamento de produto, arquitetura, dados, API, IA ou processo, o documento correspondente reflete isso.
6. **Foi entregue com o menor escopo necessário** para resolver o problema real, sem funcionalidade especulativa anexada.

Uma funcionalidade que atende parcialmente a esses critérios não é "quase pronta" — é considerada não concluída.

---

# Testes

Toda funcionalidade deve ser validada antes de ser integrada ao restante do sistema. Validar antes da integração existe para que um problema seja identificado no momento mais barato de corrigir — antes de se espalhar para outras partes do produto que passam a depender dele.

Isso é especialmente crítico no MarketingAI por dois motivos específicos do produto:

- **Ações com efeito externo** (publicação de campanha, alteração crítica de conteúdo já publicado) não podem falhar silenciosamente — uma falha nesse ponto tem impacto direto no cliente final atendido pela plataforma.
- **Fluxos de IA envolvem múltiplos especialistas coordenados** (`04_AI_ORCHESTRATION.md`). Um erro em um especialista pode se propagar para a resposta consolidada entregue ao usuário sem que a causa raiz seja óbvia — validar cada etapa antes de integrá-la reduz esse risco.

A ausência de validação antes da integração é tratada como risco de qualidade equivalente a não ter revisão de código.

---

# Segurança

- **Autorização é sempre delimitada por propriedade.** Nenhuma implementação deve permitir acesso a dado ou ação fora do escopo de Empresa, Cliente ou Projeto ao qual o usuário legitimamente pertence, conforme `06_API.md`.
- **Auditoria é obrigatória para toda ação relevante.** Decisões humanas (aprovações, rejeições, exclusões) e execuções de IA devem ser sempre rastreáveis, conforme os mecanismos de Timeline, Log IA e Memória IA definidos em `05_DATABASE.md`.
- **Rastreabilidade não é opcional nem retroativa.** Uma funcionalidade que não permite saber quem fez o quê, quando e por quê, não está pronta para produção — precisa ser corrigida antes da entrega, não depois de um incidente.
- **Proteção de dados de cliente é padrão desde o primeiro protótipo**, nunca uma etapa adicionada "quando o produto for para produção" — reafirmando o princípio inquebrável de `00_PRODUCT_BLUEPRINT.md`.
- **Ações críticas exigem o mesmo padrão de segurança em qualquer camada do sistema** — não existe atalho técnico que contorne a exigência de aprovação humana definida em `04_AI_ORCHESTRATION.md` e `06_API.md`, independentemente de onde a ação é iniciada.

---

# Uso da Inteligência Artificial

O uso de Inteligência Artificial como apoio ao próprio desenvolvimento do MarketingAI — geração de código, sugestões, automação de tarefas de engenharia — segue os mesmos princípios de responsabilidade que o produto exige de si mesmo:

- **Revisão humana é obrigatória.** Nenhuma mudança gerada com apoio de IA é integrada ao projeto sem revisão humana explícita — o mesmo princípio de decisão final humana definido em `00_PRODUCT_BLUEPRINT.md` e `04_AI_ORCHESTRATION.md` se aplica também a quem constrói o produto, não apenas a quem o usa.
- **Preservação da arquitetura é inegociável.** IA usada durante o desenvolvimento deve operar dentro dos limites definidos em `03_ARCHITECTURE.md`, `04_AI_ORCHESTRATION.md` e `05_DATABASE.md` — nunca propor ou introduzir uma estrutura que contorne essas fronteiras sem aprovação consciente e documentada.
- **Respeito à documentação oficial é ponto de partida obrigatório.** Qualquer uso de IA para desenvolver o MarketingAI deve partir da leitura da documentação vigente (`00` a `08`), na mesma lógica já aplicada à criação destes próprios documentos — decisão não fundamentada na documentação oficial não é uma decisão válida.
- **Transparência nas alterações é exigida.** Toda mudança gerada com apoio de IA deve ser identificável como tal e compreensível por revisão humana — nenhuma alteração relevante deve ser "caixa-preta" para quem está revisando, mesmo quando a IA participou de sua criação.

---

# Evolução do Projeto

Novas funcionalidades são incorporadas ao MarketingAI seguindo a mesma ordem de precedência da documentação:

1. A necessidade é primeiro avaliada contra `00_PRODUCT_BLUEPRINT.md` e `07_ROADMAP.md` — ela pertence à visão do produto e ao momento certo de evolução?
2. Se aprovada, a mudança é refletida na documentação de produto e arquitetura relevante (`01`, `02`, `03`, e `04` ou `05` ou `06`, conforme o caso) **antes** de qualquer implementação começar.
3. A implementação segue as regras deste documento (`08`) integralmente — organização, convenções, controle de versão, qualidade, testes e segurança.
4. Nenhuma funcionalidade nova compromete a responsabilidade única de um módulo, agente ou domínio já existente — se a nova necessidade não se encaixa em nenhum limite atual, a decisão correta é rever a arquitetura conscientemente, não forçar o encaixe.

Esse caminho garante que o projeto cresça de forma rastreável: qualquer funcionalidade existente no sistema pode ser explicada por uma decisão documentada, não por um acúmulo de exceções silenciosas.

---

# Princípios Obrigatórios

Os seguintes princípios devem ser respeitados durante toda a vida do projeto, sem exceção:

1. **A documentação de `00` a `08` é a autoridade final.** Nenhuma decisão de engenharia contraria o que está escrito nela sem que a documentação seja primeiro revisada conscientemente.
2. **Qualidade nunca é negociada por prazo.**
3. **Simplicidade é a escolha padrão.** Complexidade só é aceita quando comprovadamente necessária, nunca como antecipação especulativa.
4. **Toda ação relevante é rastreável até sua origem** — humana ou de IA.
5. **Nenhuma ação irreversível ou com efeito externo ocorre sem aprovação humana.**
6. **Responsabilidade única é respeitada em todo módulo, componente, serviço e agente.**
7. **Dado de cliente é tratado como ativo crítico em qualquer etapa do desenvolvimento.**
8. **Documentação e sistema nunca divergem** — quando divergem, isso é tratado como defeito a ser corrigido, não como detalhe a ser ignorado.
9. **A arquitetura evolui por decisão consciente, nunca por acidente de implementação.**
