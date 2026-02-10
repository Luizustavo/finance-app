# Features & User Stories — Finance App

> **Etapa 2 do fluxo de desenvolvimento**
> Data: Fevereiro/2026

---

## 1. Épicos

O sistema está organizado em **8 épicos**, priorizados por valor de entrega:

| #  | Épico                        | Prioridade | Fase |
| -- | ---------------------------- | ---------- | ---- |
| E1 | Autenticação & Perfil        | Alta       | MVP  |
| E2 | Contas & Cartões             | Alta       | MVP  |
| E3 | Transações                   | Alta       | MVP  |
| E4 | Painel Mensal (Dashboard)    | Alta       | MVP  |
| E5 | Recorrências & Parcelamentos | Alta       | MVP  |
| E6 | Faturas de Cartão            | Média      | v1.1 |
| E7 | Orçamentos & Alertas         | Média      | v1.1 |
| E8 | Metas & Investimentos        | Baixa      | v1.2 |

---

## 2. Features & User Stories por Épico

---

### E1 — Autenticação & Perfil

**Objetivo:** Permitir acesso seguro ao app e configuração de dados pessoais.

#### Feature 1.1: Cadastro e Login

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-101 | Como **usuário**, quero **me cadastrar com e-mail e senha** para **ter minha conta no app**. | - Validação de e-mail único<br>- Senha com mínimo 8 caracteres<br>- Confirmação de senha<br>- Feedback de erro inline | Alta |
| US-102 | Como **usuário**, quero **fazer login com e-mail e senha** para **acessar meus dados financeiros**. | - Campo de e-mail e senha<br>- Mensagem de erro para credenciais inválidas<br>- Redirecionamento para dashboard após login<br>- Sessão persistente (não deslogar ao fechar o app) | Alta |
| US-103 | Como **usuário**, quero **recuperar minha senha** para **acessar minha conta caso eu a esqueça**. | - Envio de link de redefinição por e-mail<br>- Link expira em 1h<br>- Confirmação visual de envio | Média |
| US-104 | Como **usuário**, quero **fazer logout** para **proteger meus dados quando não estiver usando o app**. | - Botão de logout no menu de perfil<br>- Limpeza de sessão<br>- Redirecionamento para tela de login | Alta |

#### Feature 1.2: Perfil do Usuário

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-105 | Como **usuário**, quero **editar meu nome e número de WhatsApp** para **manter meus dados atualizados e receber alertas**. | - Campos editáveis: nome, WhatsApp<br>- Validação de formato de telefone<br>- Feedback de sucesso ao salvar | Média |
| US-106 | Como **usuário**, quero **alterar minha senha** para **manter minha conta segura**. | - Exige senha atual para confirmar<br>- Nova senha com mínimo 8 caracteres<br>- Confirmação de nova senha | Baixa |

---

### E2 — Contas & Cartões

**Objetivo:** Cadastrar e gerenciar contas bancárias e cartões de crédito.

#### Feature 2.1: Gestão de Contas Bancárias

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-201 | Como **usuário**, quero **cadastrar uma conta bancária** (nome, tipo, saldo inicial) para **controlar meu dinheiro em diferentes contas**. | - Campos: nome, tipo (Corrente/Investimento), saldo inicial<br>- Saldo inicial pode ser 0 ou negativo<br>- Conta criada como ativa por padrão | Alta |
| US-202 | Como **usuário**, quero **ver a lista das minhas contas** com o **saldo atual de cada uma** para **ter visão geral do meu patrimônio**. | - Lista com nome, tipo e saldo atual calculado<br>- Saldo atualizado em tempo real<br>- Indicador visual para saldo negativo (vermelho) | Alta |
| US-203 | Como **usuário**, quero **editar os dados de uma conta** para **corrigir informações ou renomear**. | - Campos editáveis: nome, tipo<br>- Saldo inicial não editável após criação (integridade)<br>- Feedback de sucesso | Média |
| US-204 | Como **usuário**, quero **desativar uma conta** (sem excluir) para **não poluir minha visão sem perder o histórico**. | - Toggle ativa/inativa<br>- Conta inativa não aparece nas listagens principais<br>- Transações históricas preservadas<br>- Opção de reativar | Baixa |

#### Feature 2.2: Gestão de Cartões de Crédito

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-205 | Como **usuário**, quero **cadastrar um cartão de crédito** (nome, limite, dia de fechamento, dia de vencimento) para **controlar minhas faturas**. | - Campos: nome, limite (opcional), dia fechamento (1-31), dia vencimento (1-31)<br>- Cartão criado como ativo por padrão | Alta |
| US-206 | Como **usuário**, quero **ver meus cartões** com o **total da fatura aberta** para **saber quanto devo em cada um**. | - Lista com nome, limite, fatura aberta<br>- Barra de uso do limite (%) com indicador visual<br>- Destaque quando próximo do limite | Alta |
| US-207 | Como **usuário**, quero **editar os dados de um cartão** para **ajustar limite ou datas de fechamento/vencimento**. | - Todos os campos editáveis<br>- Validação de datas (1-31) | Média |
| US-208 | Como **usuário**, quero **desativar um cartão** para **parar de usá-lo sem perder o histórico de faturas**. | - Toggle ativa/inativo<br>- Cartão inativo oculto das listagens principais<br>- Faturas históricas preservadas | Baixa |

---

### E3 — Transações

**Objetivo:** Registrar, visualizar e gerenciar todas as movimentações financeiras.

#### Feature 3.1: Registro de Transações

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-301 | Como **usuário**, quero **registrar uma entrada (receita)** informando **valor, data, categoria, conta e descrição** para **controlar o que recebo**. | - Campos: valor, data (default=hoje), categoria (filtrada por INCOME), conta, descrição<br>- Valor aceita decimais (centavos)<br>- Teclado numérico abre automaticamente no mobile<br>- Feedback de sucesso com opção de "adicionar outra" | Alta |
| US-302 | Como **usuário**, quero **registrar uma saída (despesa)** informando **valor, data, categoria, conta ou cartão e descrição** para **controlar o que gasto**. | - Campos: valor, data, categoria (filtrada por EXPENSE), conta OU cartão, descrição<br>- Se cartão selecionado, associar à fatura do mês correspondente<br>- Tags opcionais<br>- Notas opcionais | Alta |
| US-303 | Como **usuário**, quero **registrar uma transferência entre contas** para **controlar movimentações internas**. | - Campos: valor, data, conta origem, conta destino, descrição<br>- Gera 2 transações (saída na origem, entrada no destino)<br>- Ambas vinculadas para rastreabilidade | Média |
| US-304 | Como **usuário**, quero **adicionar tags a uma transação** para **classificá-la com labels extras** (ex: "viagem", "trabalho"). | - Autocomplete de tags existentes<br>- Criar nova tag inline<br>- Múltiplas tags por transação<br>- Tags visíveis na listagem | Média |

#### Feature 3.2: Listagem e Filtros

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-305 | Como **usuário**, quero **ver todas as transações do mês corrente** em uma **lista ordenada por data** para **acompanhar meu fluxo de caixa**. | - Listagem com: data, dia da semana, descrição, categoria (ícone+cor), valor, saldo acumulado<br>- Entradas em verde, saídas em vermelho<br>- Scroll infinito ou paginação<br>- Mês/ano selecionável (navegar entre meses) | Alta |
| US-306 | Como **usuário**, quero **filtrar transações por categoria, tag, conta/cartão e tipo** para **encontrar lançamentos específicos**. | - Filtros combinados (AND)<br>- Filtro por: tipo (entrada/saída), categoria, tag, conta, cartão<br>- Limpar filtros com um toque<br>- Contador de resultados | Alta |
| US-307 | Como **usuário**, quero **buscar transações por descrição** para **localizar rapidamente um lançamento**. | - Campo de busca com pesquisa em tempo real<br>- Busca na descrição e notas<br>- Highlights no texto encontrado | Média |

#### Feature 3.3: Edição e Exclusão

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-308 | Como **usuário**, quero **editar uma transação** para **corrigir valor, data, categoria ou descrição**. | - Todos os campos editáveis<br>- Se transação de recorrência, perguntar: "editar só esta ou todas as futuras?"<br>- Recalcular saldos afetados<br>- Feedback de sucesso | Alta |
| US-309 | Como **usuário**, quero **excluir uma transação** para **remover lançamentos incorretos**. | - Confirmação antes de excluir ("Tem certeza?")<br>- Se parcela, perguntar: "excluir só esta parcela ou todo o parcelamento?"<br>- Recalcular saldos afetados | Alta |

---

### E4 — Painel Mensal (Dashboard)

**Objetivo:** Visão consolidada mensal, espelhando a estrutura da planilha.

#### Feature 4.1: Resumo Mensal

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-401 | Como **usuário**, quero **ver o painel do mês corrente** com **saldo anterior, total de entradas, total de saídas e saldo a transportar** para **ter a visão geral do meu mês** (igual à planilha). | - Cards com: Saldo anterior, Entradas, Saídas, Saldo a transportar<br>- Valores coloridos (verde positivo, vermelho negativo)<br>- Cálculo automático e em tempo real<br>- Navegação entre meses (< Fev 2026 >) | Alta |
| US-402 | Como **usuário**, quero **ver o "Total para investir"** (sobra do mês) **em destaque** para **saber quanto posso economizar**. | - Exibido quando `monthly_delta > 0`<br>- Destaque visual diferenciado<br>- Se negativo, mostrar "Mês deficitário" com valor | Alta |
| US-403 | Como **usuário**, quero **navegar entre meses** para **comparar e revisar meses anteriores**. | - Swipe horizontal ou setas < ><br>- Meses futuros mostram projeção (recorrências + parcelas)<br>- Indicador visual de mês fechado vs aberto | Alta |
| US-404 | Como **usuário**, quero **fechar o mês** para **congelar os valores e transportar o saldo para o próximo mês**. | - Botão "Fechar mês" com confirmação<br>- Ao fechar: congela valores, cria MONTHLY_BALANCE, transporta saldo<br>- Mês fechado exibe badge "Fechado"<br>- Possibilidade de reabrir (com aviso) | Média |

#### Feature 4.2: Gráficos e Indicadores

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-405 | Como **usuário**, quero **ver um gráfico de despesas por categoria** (pizza/donut) para **entender onde estou gastando mais**. | - Gráfico donut/pizza com as categorias de despesa<br>- Cores das categorias definidas no cadastro<br>- Valores absolutos e percentuais<br>- Toque na fatia mostra detalhe | Alta |
| US-406 | Como **usuário**, quero **ver a evolução mensal** (entradas vs saídas) **dos últimos 6 meses** para **identificar tendências**. | - Gráfico de barras agrupadas (entradas vs saídas)<br>- Linha de saldo sobreposta<br>- Últimos 6 meses visíveis<br>- Scroll horizontal para ver mais | Média |
| US-407 | Como **usuário**, quero **ver os gastos por cartão de crédito no mês** para **saber o peso de cada cartão**. | - Cards ou barras: Nubank, Inter, Leroy<br>- Valor da fatura aberta de cada um<br>- % do limite utilizado<br>- Toque leva para detalhe da fatura | Média |

---

### E5 — Recorrências & Parcelamentos

**Objetivo:** Automatizar lançamentos repetitivos e controlar compras parceladas.

#### Feature 5.1: Gestão de Recorrências

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-501 | Como **usuário**, quero **cadastrar uma despesa/receita recorrente** (valor, dia, categoria, frequência) para **que o app lance automaticamente todo mês**. | - Campos: descrição, valor, tipo (entrada/saída), categoria, conta/cartão, dia do mês, frequência (mensal/anual), data início, data fim (opcional)<br>- Preview de "próximos 3 lançamentos" antes de confirmar | Alta |
| US-502 | Como **usuário**, quero **ver a lista das minhas recorrências ativas** para **saber o que tenho de fixo todo mês**. | - Lista com: descrição, valor, dia, frequência, conta/cartão<br>- Total de custos fixos mensais somado no topo<br>- Indicador de próximo lançamento | Alta |
| US-503 | Como **usuário**, quero **editar uma recorrência** para **ajustar valor ou outras informações**. | - Todos os campos editáveis<br>- Opção: "alterar a partir de agora" (transações geradas anteriormente não mudam)<br>- Preview do impacto | Média |
| US-504 | Como **usuário**, quero **desativar/excluir uma recorrência** para **parar de gerar lançamentos futuros**. | - Desativar: para de gerar novos lançamentos, mantém histórico<br>- Excluir: confirmação com aviso "transações já geradas serão mantidas"<br>- Opção de definir data de fim em vez de desativar | Média |
| US-505 | Como **usuário**, quero que o app **gere automaticamente as transações das recorrências ativas** no início de cada mês para **não precisar lançar manualmente**. | - Transações geradas com status pendente/confirmado<br>- Notificação: "X transações recorrentes lançadas para este mês"<br>- Possibilidade de revisar e confirmar os lançamentos gerados | Alta |

#### Feature 5.2: Gestão de Parcelamentos

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-506 | Como **usuário**, quero **registrar uma compra parcelada** (valor total, nº de parcelas, cartão, categoria) para **que o app distribua as parcelas nos meses seguintes**. | - Campos: descrição, valor total, nº parcelas, cartão, categoria, data da primeira parcela<br>- Valor por parcela calculado automaticamente<br>- Preview de todas as parcelas (mês a mês) antes de confirmar<br>- Cada parcela gera uma TRANSACTION vinculada à fatura do cartão | Alta |
| US-507 | Como **usuário**, quero **ver todos os meus parcelamentos em andamento** com **parcelas restantes e valor total pendente** para **saber meus compromissos futuros**. | - Lista com: descrição, parcela atual/total (ex: 2/5), valor parcela, valor restante<br>- Barra de progresso visual<br>- Total de compromissos futuros somado no topo<br>- Ordenar por término mais próximo | Alta |
| US-508 | Como **usuário**, quero **ver as parcelas futuras projetadas nos meses seguintes** para **planejar meu orçamento**. | - Na visão por mês futuro, mostrar parcelas que cairão<br>- Projeção de gastos fixos + parcelas para os próximos N meses | Média |

---

### E6 — Faturas de Cartão de Crédito

**Objetivo:** Controlar faturas mensais com possibilidade de importação automática.

#### Feature 6.1: Gestão de Faturas

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-601 | Como **usuário**, quero **ver a fatura de cada cartão mês a mês** com **todas as transações que compõem a fatura** para **conferir os gastos do cartão**. | - Seleção de cartão e mês<br>- Lista de transações da fatura (data, descrição, valor, parcela se houver)<br>- Total da fatura no topo<br>- Status: Aberta / Fechada / Paga<br>- Data de vencimento visível | Alta |
| US-602 | Como **usuário**, quero **marcar uma fatura como paga** (informando data de pagamento) para **controlar quais faturas já quitei**. | - Botão "Marcar como paga"<br>- Campo de data de pagamento (default=hoje)<br>- Gera transação de saída na conta corrente (pagamento da fatura)<br>- Status atualiza para "Paga" | Alta |
| US-603 | Como **usuário**, quero **ver o resumo de faturas de todos os cartões** para **saber meu total de dívida em cartões**. | - Cards com: cartão, fatura atual, status, vencimento<br>- Total geral de faturas abertas<br>- Destaque para faturas vencidas e não pagas | Média |

#### Feature 6.2: Importação de Fatura

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-604 | Como **usuário**, quero **importar a fatura do cartão via arquivo CSV** para **não digitar cada transação manualmente**. | - Upload de arquivo CSV<br>- Preview dos itens detectados antes de confirmar<br>- Mapeamento de colunas (data, descrição, valor)<br>- Associação automática à fatura do mês correspondente<br>- Feedback: "X transações importadas com sucesso" | Alta |
| US-605 | Como **usuário**, quero **importar fatura via arquivo OFX** para **ter uma opção adicional de importação**. | - Upload de arquivo OFX<br>- Parsing automático do formato<br>- Mesma experiência do CSV (preview → confirm) | Média |
| US-606 | Como **usuário**, quero que o app **sugira a categoria automaticamente** para transações importadas (com base no histórico) para **acelerar a categorização**. | - Match por descrição com transações anteriores<br>- Sugestão exibida, usuário confirma ou altera<br>- Aprendizado: quanto mais usa, melhor a sugestão | Baixa |
| US-607 | Como **usuário**, quero **ver o histórico de importações** para **rastrear o que já importei e evitar duplicatas**. | - Lista: nome do arquivo, data, nº itens, fatura associada<br>- Aviso se detectar possível duplicata ao importar novamente | Baixa |

---

### E7 — Orçamentos & Alertas

**Objetivo:** Definir limites de gastos por categoria e receber avisos quando estiver perto de estourar.

#### Feature 7.1: Orçamento por Categoria

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-701 | Como **usuário**, quero **definir um orçamento mensal por categoria** (ex: máx R$ 500 em Gasolina) para **controlar meus gastos**. | - Seleção de categoria (somente EXPENSE)<br>- Valor limite<br>- % de alerta (default=80%)<br>- Opção de replicar para meses futuros<br>- Unique por categoria/mês | Alta |
| US-702 | Como **usuário**, quero **ver quanto já gastei vs. o orçamento de cada categoria** no mês corrente para **saber se estou dentro do teto**. | - Barra de progresso: gasto / limite<br>- Cores: verde (< 70%), amarelo (70-90%), vermelho (> 90%)<br>- Valor gasto / valor limite + % utilizado<br>- Ordenado por % consumido (mais crítico primeiro) | Alta |
| US-703 | Como **usuário**, quero **editar ou remover um orçamento** para **ajustar meus limites conforme necessário**. | - Edição inline ou tela dedicada<br>- Remoção com confirmação<br>- Opção de alterar a partir do mês atual ou de um mês específico | Média |

#### Feature 7.2: Alertas

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-704 | Como **usuário**, quero **receber uma notificação no app** quando atingir o % de alerta do orçamento de uma categoria para **agir antes de estourar**. | - Notificação in-app (badge/toast) quando gasto atinge threshold<br>- Mensagem: "Gasolina: você atingiu 80% do orçamento (R$ 400/R$ 500)"<br>- Toque leva para detalhe da categoria<br>- Histórico de alertas acessível | Alta |
| US-705 | Como **usuário**, quero **receber um alerta via WhatsApp** quando estiver perto de estourar o orçamento para **ser avisado mesmo fora do app**. | - Integração com API WhatsApp (Twilio/Evolution)<br>- Mensagem formatada com categoria, valor gasto, limite<br>- Configurável: ativar/desativar por categoria<br>- Respeitando limite de mensagens (máx 1 por dia por categoria) | Média |
| US-706 | Como **usuário**, quero **configurar quais alertas quero receber e por qual canal** (in-app e/ou WhatsApp) para **personalizar minhas notificações**. | - Tela de configuração de alertas<br>- Tipos: alerta de orçamento, orçamento estourado, meta atingida<br>- Canais: in-app, WhatsApp<br>- Toggle por tipo+canal<br>- % personalizável por alerta | Média |

---

### E8 — Metas & Investimentos

**Objetivo:** Tracking de metas de economia e investimentos (BTC).

#### Feature 8.1: Metas de Economia

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-801 | Como **usuário**, quero **criar uma meta de economia** (nome, valor alvo, prazo) para **ter um objetivo financeiro claro**. | - Campos: nome, descrição (opcional), valor alvo, prazo (opcional)<br>- Valor atual começa em 0<br>- Múltiplas metas simultâneas | Média |
| US-802 | Como **usuário**, quero **registrar aportes em uma meta** para **acompanhar meu progresso até o objetivo**. | - Botão "Adicionar aporte" com valor e data<br>- Atualiza `current_amount`<br>- Se atingir `target_amount`, marcar como achieved | Média |
| US-803 | Como **usuário**, quero **ver o progresso de cada meta** com **barra de progresso e projeção de quando vou atingir** para **me manter motivado**. | - Barra de progresso visual (% atingido)<br>- Valor acumulado / valor alvo<br>- Se prazo definido: projeção se está no ritmo<br>- Badge "Meta atingida!" quando completar | Média |
| US-804 | Como **usuário**, quero que o **"Total para investir" do mês** possa ser **vinculado a uma meta** para **direcionar automaticamente a sobra**. | - Ao fechar o mês, sugerir "Direcionar sobra de R$ X para meta Y?"<br>- Seleção de meta destino<br>- Aporte automático ou manual | Baixa |

#### Feature 8.2: Investimentos

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-805 | Como **usuário**, quero **registrar um investimento** (tipo de ativo, valor, quantidade, data) para **controlar onde estou investindo**. | - Campos: tipo ativo (BTC, etc.), valor em R$, quantidade, data, notas<br>- Vinculação opcional a conta de investimento | Média |
| US-806 | Como **usuário**, quero **ver o total investido e o histórico de aportes** para **acompanhar minha carteira de investimentos**. | - Total investido agrupado por tipo de ativo<br>- Histórico cronológico de aportes<br>- Filtro por tipo de ativo | Média |

---

## 3. Features Transversais (Cross-cutting)

Funcionalidades que permeiam todo o sistema.

#### Feature T.1: Categorias & Tags

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-T01 | Como **usuário**, quero **gerenciar minhas categorias** (criar, editar, desativar) com **ícone e cor customizáveis** para **organizar meus lançamentos do meu jeito**. | - CRUD de categorias<br>- Seleção de ícone (galeria predefinida)<br>- Picker de cor<br>- Categorias pai/filho (subcategorias)<br>- Categorias padrão pré-criadas (seed)<br>- Não permitir excluir categoria com transações (apenas desativar) | Alta |
| US-T02 | Como **usuário**, quero **gerenciar minhas tags** (criar, editar, excluir) para **ter labels personalizadas nas transações**. | - CRUD de tags<br>- Cor personalizável<br>- Excluir tag remove apenas vínculo (transações mantidas) | Média |

#### Feature T.2: Navegação & UX Mobile

| ID     | User Story | Critérios de Aceite | Prioridade |
| ------ | ---------- | ------------------- | ---------- |
| US-T03 | Como **usuário**, quero **navegar pelo app com uma barra inferior (bottom nav)** com acesso rápido a **Dashboard, Transações, Adicionar (+), Cartões e Menu** para **usar o app facilmente com uma mão no celular**. | - Bottom navigation bar com 5 itens<br>- Botão central "+" em destaque (FAB) para nova transação<br>- Ícones claros e labels curtos<br>- Feedback tátil ao tocar | Alta |
| US-T04 | Como **usuário**, quero que o app seja **rápido e responsivo** com **transições suaves** para **ter experiência nativa no meu iPhone**. | - Skeleton loading nos cards<br>- Animações de transição entre telas<br>- Pull-to-refresh na listagem<br>- Haptic feedback nos botões (quando suportado)<br>- PWA com ícone na home screen | Alta |
| US-T05 | Como **usuário**, quero **adicionar o app na tela inicial do meu iPhone** (PWA) para **acessar como se fosse um app nativo**. | - Manifest.json configurado<br>- Ícone e splash screen<br>- Funciona offline para leitura (cache)<br>- Status bar estilizada | Alta |

---

## 4. Roadmap de Entrega

### MVP — Versão 1.0 (Épicos E1-E5)

O MVP foca em **substituir a planilha** com todas as funcionalidades essenciais:

```
Sprint 1 (2 semanas): Setup + Auth + Perfil
├── Configuração do projeto (DB, Auth, PWA)
├── US-101 a US-106 (Cadastro, Login, Perfil)
└── US-T03, US-T04, US-T05 (Navegação, PWA)

Sprint 2 (2 semanas): Contas, Cartões & Categorias
├── US-201 a US-208 (Contas e Cartões)
└── US-T01, US-T02 (Categorias e Tags)

Sprint 3 (2 semanas): Transações
├── US-301 a US-304 (Registro de transações)
├── US-305 a US-307 (Listagem e filtros)
└── US-308, US-309 (Edição e exclusão)

Sprint 4 (2 semanas): Dashboard & Recorrências
├── US-401 a US-404 (Painel mensal)
├── US-405 (Gráfico por categoria)
├── US-501 a US-505 (Recorrências)
└── US-506 a US-508 (Parcelamentos)
```

### v1.1 — Faturas & Orçamentos (Épicos E6-E7)

```
Sprint 5 (2 semanas): Faturas de Cartão
├── US-601 a US-603 (Gestão de faturas)
├── US-604, US-605 (Importação CSV/OFX)
└── US-406, US-407 (Gráficos evolução e cartões)

Sprint 6 (2 semanas): Orçamentos & Alertas
├── US-701 a US-703 (Orçamento por categoria)
├── US-704 (Alertas in-app)
├── US-705, US-706 (Alertas WhatsApp + config)
└── US-606, US-607 (Auto-categorização + histórico import)
```

### v1.2 — Metas & Investimentos (Épico E8)

```
Sprint 7 (2 semanas): Metas & Investimentos
├── US-801 a US-804 (Metas de economia)
└── US-805, US-806 (Investimentos)
```

---

## 5. Métricas de Sucesso

| Métrica                        | Meta                                       |
| ------------------------------ | ------------------------------------------ |
| Tempo para lançar transação    | < 15 segundos (do toque ao salvar)         |
| Adoção do app vs planilha      | 100% migração em 1 mês após MVP            |
| Transações duplicadas          | 0% com detecção de duplicatas              |
| Tempo de carregamento          | < 2s no dashboard (3G)                     |
| Cobertura de custos fixos      | 100% dos recorrentes cadastrados           |

---

## 6. Fora de Escopo (Backlog Futuro)

Itens intencionalmente deixados para versões futuras:

- Múltiplos usuários / família compartilhada
- Conexão direta com Open Banking (Pluggy, Belvo)
- Relatórios avançados exportáveis (PDF)
- Integração com corretoras de investimentos (preço BTC em tempo real)
- App nativo (React Native / Flutter) — avaliar se PWA atende bem
- Modo escuro (pode entrar antes se for simples)
- Backup/export de dados (CSV/JSON)
- Funcionalidade offline com sync

---

> **Próximo passo:** Etapa 3 — Wireframes de Baixa Fidelidade (papel/Excalidraw)
