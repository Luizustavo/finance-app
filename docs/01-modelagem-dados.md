# Modelagem de Dados — Finance App

> **Etapa 1 do fluxo de desenvolvimento**
> Data: Fevereiro/2026

---

## 1. Visão Geral

App web mobile-first para controle financeiro pessoal, substituindo planilha atual.
Controle mensal de receitas, despesas, cartões de crédito, parcelamentos, orçamentos e metas de economia.

---

## 2. Entidades e Atributos

### 2.1 `USER` — Usuário

| Campo           | Tipo      | Obrigatório | Descrição                              |
| --------------- | --------- | ----------- | -------------------------------------- |
| id              | UUID (PK) | Sim         | Identificador único                    |
| name            | String    | Sim         | Nome do usuário                        |
| email           | String    | Sim         | E-mail (login)                         |
| phone_whatsapp  | String    | Não         | Telefone WhatsApp para alertas         |
| created_at      | Timestamp | Sim         | Data de criação                        |
| updated_at      | Timestamp | Sim         | Data de atualização                    |

---

### 2.2 `ACCOUNT` — Conta Bancária

Representa contas correntes e contas de investimento.

| Campo           | Tipo      | Obrigatório | Descrição                                    |
| --------------- | --------- | ----------- | -------------------------------------------- |
| id              | UUID (PK) | Sim         | Identificador único                          |
| user_id         | UUID (FK) | Sim         | → `USER.id`                                  |
| name            | String    | Sim         | Nome da conta (ex: "Conta Principal")        |
| type            | Enum      | Sim         | `CHECKING` \| `INVESTMENT`                   |
| initial_balance | Decimal   | Sim         | Saldo inicial ao cadastrar a conta           |
| is_active       | Boolean   | Sim         | Se a conta está ativa                        |
| created_at      | Timestamp | Sim         |                                              |
| updated_at      | Timestamp | Sim         |                                              |

> **Nota:** O saldo atual é **calculado** (initial_balance + soma das transações), não armazenado.

---

### 2.3 `CREDIT_CARD` — Cartão de Crédito

Seus 3 cartões: Nubank (crédito), Inter e Leroy.

| Campo        | Tipo      | Obrigatório | Descrição                                 |
| ------------ | --------- | ----------- | ----------------------------------------- |
| id           | UUID (PK) | Sim         | Identificador único                       |
| user_id      | UUID (FK) | Sim         | → `USER.id`                               |
| name         | String    | Sim         | Nome do cartão (ex: "Nubank")             |
| credit_limit | Decimal   | Não         | Limite de crédito                         |
| closing_day  | Int       | Sim         | Dia de fechamento da fatura (1-31)        |
| due_day      | Int       | Sim         | Dia de vencimento da fatura (1-31)        |
| is_active    | Boolean   | Sim         | Se o cartão está ativo                    |
| created_at   | Timestamp | Sim         |                                           |
| updated_at   | Timestamp | Sim         |                                           |

---

### 2.4 `CATEGORY` — Categoria

Categorias hierárquicas (com possibilidade de subcategorias).

| Campo      | Tipo      | Obrigatório | Descrição                                          |
| ---------- | --------- | ----------- | -------------------------------------------------- |
| id         | UUID (PK) | Sim         | Identificador único                                |
| user_id    | UUID (FK) | Sim         | → `USER.id`                                        |
| parent_id  | UUID (FK) | Não         | → `CATEGORY.id` (auto-referência para subcategoria)|
| name       | String    | Sim         | Nome da categoria                                  |
| type       | Enum      | Sim         | `INCOME` \| `EXPENSE`                              |
| icon       | String    | Não         | Ícone para exibição no app                         |
| color      | String    | Não         | Cor hex para exibição                              |
| is_active  | Boolean   | Sim         | Se está ativa                                      |
| created_at | Timestamp | Sim         |                                                    |

**Categorias iniciais sugeridas (seed):**

```
INCOME (Receitas)
├── Salário
└── Outros

EXPENSE (Despesas)
├── Moradia
│   ├── Financiamento
│   ├── Condomínio
│   ├── Internet
│   └── Garagem
├── Transporte
│   ├── Gasolina
│   └── IPVA
├── Pessoal
│   ├── Barbeiro
│   └── Celular
├── Família
│   └── Pix Mãe
├── Impostos
│   └── DAS
├── Cartão de Crédito
│   ├── Nubank
│   ├── Inter
│   └── Leroy
└── Outros
```

---

### 2.5 `TAG` — Tags

Tags livres para marcar transações (ex: "viagem", "trabalho", "urgente").

| Campo      | Tipo      | Obrigatório | Descrição               |
| ---------- | --------- | ----------- | ----------------------- |
| id         | UUID (PK) | Sim         | Identificador único     |
| user_id    | UUID (FK) | Sim         | → `USER.id`             |
| name       | String    | Sim         | Nome da tag             |
| color      | String    | Não         | Cor hex                 |
| created_at | Timestamp | Sim         |                         |

---

### 2.6 `TRANSACTION` — Transação

Entidade central do sistema. Cada linha da sua planilha é uma transação.

| Campo               | Tipo      | Obrigatório | Descrição                                                |
| ------------------- | --------- | ----------- | -------------------------------------------------------- |
| id                  | UUID (PK) | Sim         | Identificador único                                      |
| user_id             | UUID (FK) | Sim         | → `USER.id`                                              |
| account_id          | UUID (FK) | Não*        | → `ACCOUNT.id` (transações de conta corrente)            |
| credit_card_id      | UUID (FK) | Não*        | → `CREDIT_CARD.id` (compras no cartão)                   |
| invoice_id          | UUID (FK) | Não         | → `CREDIT_CARD_INVOICE.id` (fatura na qual a compra cai) |
| category_id         | UUID (FK) | Sim         | → `CATEGORY.id`                                          |
| installment_plan_id | UUID (FK) | Não         | → `INSTALLMENT_PLAN.id` (se é parcela)                   |
| recurrence_id       | UUID (FK) | Não         | → `RECURRENCE.id` (se gerada por recorrência)            |
| type                | Enum      | Sim         | `INCOME` \| `EXPENSE` \| `TRANSFER`                     |
| description         | String    | Sim         | Descrição da transação                                   |
| amount              | Decimal   | Sim         | Valor (sempre positivo, tipo define sinal)               |
| date                | Date      | Sim         | Data da transação                                        |
| installment_number  | Int       | Não         | Nº da parcela (ex: 2 de 5)                               |
| notes               | Text      | Não         | Observações livres                                       |
| created_at          | Timestamp | Sim         |                                                          |
| updated_at          | Timestamp | Sim         |                                                          |

> **\*** Uma transação deve ter `account_id` **ou** `credit_card_id` preenchido (constraint de aplicação).
>
> **Nota sobre `amount`:** Valores são sempre armazenados como positivos. O campo `type` determina se é entrada ou saída nos cálculos.
>
> **Dia da semana:** Calculado a partir do `date`, não armazenado.
>
> **Saldo acumulado:** Calculado em runtime, não armazenado.

---

### 2.7 `TRANSACTION_TAG` — Relação N:N Transação ↔ Tag

| Campo          | Tipo      | Obrigatório | Descrição           |
| -------------- | --------- | ----------- | ------------------- |
| transaction_id | UUID (FK) | Sim         | → `TRANSACTION.id`  |
| tag_id         | UUID (FK) | Sim         | → `TAG.id`          |

> PK composta: (`transaction_id`, `tag_id`)

---

### 2.8 `RECURRENCE` — Recorrência

Modela despesas/receitas fixas que se repetem (Salário, DAS, Condomínio, Pix Mãe, etc.)

| Campo          | Tipo      | Obrigatório | Descrição                               |
| -------------- | --------- | ----------- | --------------------------------------- |
| id             | UUID (PK) | Sim         | Identificador único                     |
| user_id        | UUID (FK) | Sim         | → `USER.id`                             |
| category_id    | UUID (FK) | Sim         | → `CATEGORY.id`                         |
| account_id     | UUID (FK) | Não         | → `ACCOUNT.id` (se débito em conta)     |
| credit_card_id | UUID (FK) | Não         | → `CREDIT_CARD.id` (se no cartão)       |
| description    | String    | Sim         | Descrição                               |
| type           | Enum      | Sim         | `INCOME` \| `EXPENSE`                   |
| amount         | Decimal   | Sim         | Valor fixo                              |
| frequency      | Enum      | Sim         | `MONTHLY` \| `YEARLY`                   |
| day_of_month   | Int       | Sim         | Dia do mês (ex: 10 para salário)        |
| start_date     | Date      | Sim         | Data de início                          |
| end_date       | Date      | Não         | Data de fim (null = indefinido)          |
| is_active      | Boolean   | Sim         | Se está ativa                           |
| created_at     | Timestamp | Sim         |                                         |
| updated_at     | Timestamp | Sim         |                                         |

**Recorrências do seu cenário:**

| Descrição      | Tipo    | Valor       | Dia | Frequência |
| -------------- | ------- | ----------- | --- | ---------- |
| Salário        | INCOME  | R$ 7.390,00 | 10  | MONTHLY    |
| Internet       | EXPENSE | R$ 99,99    | —   | MONTHLY    |
| Barbeiro       | EXPENSE | R$ 150,00   | —   | MONTHLY    |
| Garagem        | EXPENSE | R$ 150,00   | —   | MONTHLY    |
| Condomínio     | EXPENSE | R$ 350,00   | —   | MONTHLY    |
| Financiamento  | EXPENSE | R$ 2.350,00 | —   | MONTHLY    |
| Pix Mãe        | EXPENSE | R$ 500,00   | —   | MONTHLY    |
| DAS            | EXPENSE | R$ 443,41   | —   | MONTHLY    |

---

### 2.9 `INSTALLMENT_PLAN` — Plano de Parcelamento

Modela compras parceladas (ex: IPVA 5x, compras no cartão em X parcelas).

| Campo              | Tipo      | Obrigatório | Descrição                                  |
| ------------------ | --------- | ----------- | ------------------------------------------ |
| id                 | UUID (PK) | Sim         | Identificador único                        |
| user_id            | UUID (FK) | Sim         | → `USER.id`                                |
| credit_card_id     | UUID (FK) | Não         | → `CREDIT_CARD.id` (se parcelado no cartão)|
| category_id        | UUID (FK) | Sim         | → `CATEGORY.id`                            |
| description        | String    | Sim         | Descrição (ex: "IPVA 2025")                |
| total_amount       | Decimal   | Sim         | Valor total da compra                      |
| total_installments | Int       | Sim         | Quantidade de parcelas                     |
| installment_amount | Decimal   | Sim         | Valor de cada parcela                      |
| start_date         | Date      | Sim         | Data da primeira parcela                   |
| created_at         | Timestamp | Sim         |                                            |

> Cada parcela gera uma `TRANSACTION` com `installment_plan_id` preenchido e `installment_number` indicando qual parcela é (1/5, 2/5, etc).

---

### 2.10 `MONTHLY_BALANCE` — Fechamento Mensal

Snapshot mensal que replica a lógica da sua planilha.

| Campo                 | Tipo      | Obrigatório | Descrição                                                      |
| --------------------- | --------- | ----------- | -------------------------------------------------------------- |
| id                    | UUID (PK) | Sim         | Identificador único                                            |
| user_id               | UUID (FK) | Sim         | → `USER.id`                                                    |
| year                  | Int       | Sim         | Ano (ex: 2026)                                                 |
| month                 | Int       | Sim         | Mês (1-12)                                                     |
| previous_balance      | Decimal   | Sim         | Saldo anterior (= carry_forward do mês anterior)               |
| total_income          | Decimal   | Sim         | Soma das entradas do mês                                       |
| total_expenses        | Decimal   | Sim         | Soma das saídas do mês                                         |
| monthly_delta         | Decimal   | Sim         | Entradas − Saídas (sobra/déficit do mês = total para investir) |
| carry_forward_balance | Decimal   | Sim         | Saldo a transportar = previous_balance + monthly_delta         |
| is_closed             | Boolean   | Sim         | Se o mês foi "fechado" (valores congelados)                    |
| created_at            | Timestamp | Sim         |                                                                |
| updated_at            | Timestamp | Sim         |                                                                |

> **Unique constraint:** (`user_id`, `year`, `month`)

**Fórmulas:**
```
monthly_delta          = total_income - total_expenses
carry_forward_balance  = previous_balance + monthly_delta
total_para_investir    = monthly_delta (quando positivo)
```

**Fluxo:**
1. Mês corrente pode ser recalculado a qualquer momento (is_closed = false)
2. Ao "fechar" o mês, os valores são congelados (is_closed = true)
3. O `carry_forward_balance` do mês fechado vira o `previous_balance` do próximo mês

---

### 2.11 `BUDGET` — Orçamento por Categoria

Limite de gastos por categoria/mês (ex: máximo R$ 500 em gasolina).

| Campo                   | Tipo      | Obrigatório | Descrição                                          |
| ----------------------- | --------- | ----------- | -------------------------------------------------- |
| id                      | UUID (PK) | Sim         | Identificador único                                |
| user_id                 | UUID (FK) | Sim         | → `USER.id`                                        |
| category_id             | UUID (FK) | Sim         | → `CATEGORY.id`                                    |
| year                    | Int       | Sim         | Ano                                                |
| month                   | Int       | Sim         | Mês                                                |
| limit_amount            | Decimal   | Sim         | Valor limite (teto)                                |
| alert_threshold_percent | Int       | Sim         | % para disparar alerta (ex: 80 = avisa com 80%)   |
| created_at              | Timestamp | Sim         |                                                    |
| updated_at              | Timestamp | Sim         |                                                    |

> **Unique constraint:** (`user_id`, `category_id`, `year`, `month`)

---

### 2.12 `CREDIT_CARD_INVOICE` — Fatura do Cartão

Gerencia faturas mensais de cada cartão de crédito.

| Campo          | Tipo      | Obrigatório | Descrição                       |
| -------------- | --------- | ----------- | ------------------------------- |
| id             | UUID (PK) | Sim         | Identificador único             |
| credit_card_id | UUID (FK) | Sim         | → `CREDIT_CARD.id`              |
| year           | Int       | Sim         | Ano                             |
| month          | Int       | Sim         | Mês de referência               |
| total_amount   | Decimal   | Sim         | Valor total da fatura           |
| due_date       | Date      | Sim         | Data de vencimento              |
| is_paid        | Boolean   | Sim         | Se foi paga                     |
| payment_date   | Date      | Não         | Data do pagamento (se paga)     |
| created_at     | Timestamp | Sim         |                                 |
| updated_at     | Timestamp | Sim         |                                 |

> **Unique constraint:** (`credit_card_id`, `year`, `month`)
>
> Transações vinculadas ao cartão são associadas à fatura correspondente via `TRANSACTION.invoice_id`.

---

### 2.13 `INVOICE_IMPORT` — Importação de Fatura

Registro de importações de fatura (CSV/OFX exportados do banco).

| Campo          | Tipo      | Obrigatório | Descrição                          |
| -------------- | --------- | ----------- | ---------------------------------- |
| id             | UUID (PK) | Sim         | Identificador único                |
| invoice_id     | UUID (FK) | Sim         | → `CREDIT_CARD_INVOICE.id`         |
| file_name      | String    | Sim         | Nome do arquivo importado          |
| file_format    | Enum      | Sim         | `CSV` \| `OFX` \| `PDF`           |
| items_imported | Int       | Sim         | Quantidade de itens importados     |
| imported_at    | Timestamp | Sim         | Data/hora da importação            |

---

### 2.14 `INVESTMENT` — Investimentos

Tracking de investimentos (BTC e futuros).

| Campo           | Tipo      | Obrigatório | Descrição                        |
| --------------- | --------- | ----------- | -------------------------------- |
| id              | UUID (PK) | Sim         | Identificador único              |
| user_id         | UUID (FK) | Sim         | → `USER.id`                      |
| account_id      | UUID (FK) | Não         | → `ACCOUNT.id` (conta investimento)|
| asset_type      | String    | Sim         | Tipo de ativo (ex: "BTC")        |
| description     | String    | Não         | Descrição                        |
| amount_invested | Decimal   | Sim         | Valor investido em R$            |
| quantity        | Decimal   | Não         | Quantidade do ativo              |
| date            | Date      | Sim         | Data do investimento             |
| notes           | Text      | Não         | Observações                      |
| created_at      | Timestamp | Sim         |                                  |
| updated_at      | Timestamp | Sim         |                                  |

---

### 2.15 `SAVINGS_GOAL` — Meta de Economia

Metas de economia/investimento para tracking.

| Campo          | Tipo      | Obrigatório | Descrição                              |
| -------------- | --------- | ----------- | -------------------------------------- |
| id             | UUID (PK) | Sim         | Identificador único                    |
| user_id        | UUID (FK) | Sim         | → `USER.id`                            |
| name           | String    | Sim         | Nome da meta (ex: "Reserva emergência")|
| description    | Text      | Não         | Detalhes                               |
| target_amount  | Decimal   | Sim         | Valor alvo                             |
| current_amount | Decimal   | Sim         | Valor acumulado até agora              |
| deadline       | Date      | Não         | Prazo (opcional)                        |
| is_achieved    | Boolean   | Sim         | Se atingiu a meta                      |
| created_at     | Timestamp | Sim         |                                        |
| updated_at     | Timestamp | Sim         |                                        |

---

### 2.16 `ALERT_CONFIG` — Configuração de Alertas

Define regras de alertas (in-app e WhatsApp).

| Campo             | Tipo      | Obrigatório | Descrição                                            |
| ----------------- | --------- | ----------- | ---------------------------------------------------- |
| id                | UUID (PK) | Sim         | Identificador único                                  |
| user_id           | UUID (FK) | Sim         | → `USER.id`                                          |
| type              | Enum      | Sim         | `BUDGET_WARNING` \| `BUDGET_EXCEEDED` \| `GOAL_MILESTONE` |
| channel           | Enum      | Sim         | `WHATSAPP` \| `IN_APP`                               |
| threshold_percent | Int       | Sim         | % que dispara o alerta (ex: 80)                      |
| is_active         | Boolean   | Sim         | Se o alerta está ativo                               |
| created_at        | Timestamp | Sim         |                                                      |

---

### 2.17 `ALERT_LOG` — Histórico de Alertas

Registro de alertas enviados.

| Campo           | Tipo      | Obrigatório | Descrição                     |
| --------------- | --------- | ----------- | ----------------------------- |
| id              | UUID (PK) | Sim         | Identificador único           |
| alert_config_id | UUID (FK) | Sim         | → `ALERT_CONFIG.id`           |
| user_id         | UUID (FK) | Sim         | → `USER.id`                   |
| message         | String    | Sim         | Texto do alerta enviado       |
| is_read         | Boolean   | Sim         | Se foi lido (in-app)          |
| sent_at         | Timestamp | Sim         | Quando foi enviado            |

---

## 3. Relacionamentos

| Origem                | →  Destino             | Cardinalidade | Descrição                                              |
| --------------------- | ---------------------- | ------------- | ------------------------------------------------------ |
| USER                  | → ACCOUNT              | 1:N           | Usuário possui N contas                                |
| USER                  | → CREDIT_CARD          | 1:N           | Usuário possui N cartões                               |
| USER                  | → CATEGORY             | 1:N           | Usuário cria N categorias                              |
| USER                  | → TAG                  | 1:N           | Usuário cria N tags                                    |
| USER                  | → TRANSACTION          | 1:N           | Usuário registra N transações                          |
| USER                  | → RECURRENCE           | 1:N           | Usuário configura N recorrências                       |
| USER                  | → INSTALLMENT_PLAN     | 1:N           | Usuário cria N parcelamentos                           |
| USER                  | → MONTHLY_BALANCE      | 1:N           | Usuário tem N fechamentos mensais                      |
| USER                  | → BUDGET               | 1:N           | Usuário define N orçamentos                            |
| USER                  | → INVESTMENT           | 1:N           | Usuário possui N investimentos                         |
| USER                  | → SAVINGS_GOAL         | 1:N           | Usuário define N metas                                 |
| USER                  | → ALERT_CONFIG         | 1:N           | Usuário configura N alertas                            |
| ACCOUNT               | → TRANSACTION          | 1:N           | Conta tem N transações                                 |
| CREDIT_CARD           | → TRANSACTION          | 1:N           | Cartão tem N transações                                |
| CREDIT_CARD           | → CREDIT_CARD_INVOICE  | 1:N           | Cartão gera N faturas                                  |
| CREDIT_CARD           | → INSTALLMENT_PLAN     | 1:N           | Cartão tem N parcelamentos                             |
| CREDIT_CARD_INVOICE   | → TRANSACTION          | 1:N           | Fatura contém N transações                             |
| CREDIT_CARD_INVOICE   | → INVOICE_IMPORT       | 1:N           | Fatura pode ter N importações                          |
| CATEGORY              | → TRANSACTION          | 1:N           | Categoria classifica N transações                      |
| CATEGORY              | → CATEGORY             | 1:N           | Categoria tem N subcategorias (auto-referência)        |
| CATEGORY              | → BUDGET               | 1:N           | Categoria tem N orçamentos (por mês)                   |
| RECURRENCE            | → TRANSACTION          | 1:N           | Recorrência gera N transações                          |
| INSTALLMENT_PLAN      | → TRANSACTION          | 1:N           | Parcelamento gera N transações (parcelas)              |
| TRANSACTION           | ↔ TAG                  | N:N           | Transação pode ter N tags (via TRANSACTION_TAG)        |
| ALERT_CONFIG          | → ALERT_LOG            | 1:N           | Configuração gera N alertas                            |

---

## 4. Regras de Negócio no Modelo

### 4.1 Transações
- `amount` é sempre positivo; `type` define o sinal
- Deve ter `account_id` OU `credit_card_id` preenchido (nunca ambos, nunca nenhum)
- Dia da semana é **derivado** de `date` (não armazenado)
- Saldo acumulado é **calculado** em runtime (não armazenado)
- Transação de cartão de crédito deve referenciar a `invoice_id` da fatura correspondente

### 4.2 Fechamento Mensal
- `monthly_delta = total_income - total_expenses`
- `carry_forward_balance = previous_balance + monthly_delta`
- `previous_balance` do mês N = `carry_forward_balance` do mês N-1
- Enquanto `is_closed = false`, valores são recalculados dinamicamente
- Ao fechar (`is_closed = true`), valores são congelados

### 4.3 Parcelamentos
- Cada `INSTALLMENT_PLAN` gera N transações (uma por parcela)
- `installment_number` identifica qual parcela (1, 2, ..., N)
- As parcelas caem nas faturas dos cartões mês a mês

### 4.4 Recorrências
- Geram transações automaticamente a cada período (MONTHLY/YEARLY)
- `end_date = null` significa recorrência indefinida
- O sistema cria transações pendentes com base nas recorrências ativas

### 4.5 Orçamento & Alertas
- Budget define teto por Categoria/Mês
- Quando gasto atinge `alert_threshold_percent`, alerta é disparado
- Alertas podem ser enviados via WhatsApp (API) ou notificação in-app

### 4.6 Importação de Fatura
- Suporte a CSV e OFX (formatos mais comuns dos bancos)
- Itens importados geram transações vinculadas à fatura
- Registro de importação mantém rastreabilidade

---

## 5. Índices Recomendados

| Tabela            | Colunas                              | Tipo   | Justificativa                           |
| ----------------- | ------------------------------------ | ------ | --------------------------------------- |
| TRANSACTION       | (user_id, date)                      | INDEX  | Listagem mensal de transações           |
| TRANSACTION       | (user_id, category_id, date)         | INDEX  | Relatórios por categoria                |
| TRANSACTION       | (account_id, date)                   | INDEX  | Extrato por conta                       |
| TRANSACTION       | (credit_card_id, invoice_id)         | INDEX  | Transações por fatura do cartão         |
| TRANSACTION       | (installment_plan_id)                | INDEX  | Listar parcelas de um parcelamento      |
| MONTHLY_BALANCE   | (user_id, year, month)               | UNIQUE | Um registro por mês                     |
| BUDGET            | (user_id, category_id, year, month)  | UNIQUE | Um orçamento por categoria/mês          |
| CREDIT_CARD_INVOICE | (credit_card_id, year, month)      | UNIQUE | Uma fatura por cartão/mês               |
| RECURRENCE        | (user_id, is_active)                 | INDEX  | Listar recorrências ativas              |

---

## 6. Mapeamento: Planilha → Modelo

Como seus dados atuais se encaixam no modelo:

```
Planilha                    →  Modelo
─────────────────────────────────────────────────────────
Saldo anterior R$ 247,32   →  MONTHLY_BALANCE.previous_balance
Entradas R$ 9.016,52       →  MONTHLY_BALANCE.total_income
Saídas R$ (9.089,80)       →  MONTHLY_BALANCE.total_expenses
Total p/ investir R$ 320,60→  MONTHLY_BALANCE.monthly_delta (quando > 0)
Saldo a transportar         →  MONTHLY_BALANCE.carry_forward_balance

Salário R$ 7.390,00         →  TRANSACTION (type=INCOME, recurrence_id=X)
Nubank R$ 2.607,38          →  CREDIT_CARD_INVOICE.total_amount (Nubank)
Inter R$ 1.668,46           →  CREDIT_CARD_INVOICE.total_amount (Inter)
Internet R$ 99,99           →  TRANSACTION (type=EXPENSE, recurrence_id=X)
Barbeiro R$ 150,00          →  TRANSACTION (type=EXPENSE, recurrence_id=X)
Leroy R$ 380,81             →  CREDIT_CARD_INVOICE.total_amount (Leroy)
Garagem R$ 150,00           →  TRANSACTION (type=EXPENSE, recurrence_id=X)
Condomínio R$ 350,00        →  TRANSACTION (type=EXPENSE, recurrence_id=X)
Financiamento R$ 2.350,00   →  TRANSACTION (type=EXPENSE, recurrence_id=X)
Pix Mãe R$ 500,00           →  TRANSACTION (type=EXPENSE, recurrence_id=X)
DAS R$ 443,41               →  TRANSACTION (type=EXPENSE, recurrence_id=X)
Celular Neide R$ 250,00     →  TRANSACTION (type=EXPENSE)
Gasolina R$ 400,00          →  TRANSACTION (type=EXPENSE)
IPVA 2/5 R$ 139,75          →  TRANSACTION (type=EXPENSE, installment_plan_id=X, installment_number=2)
Celular Kennedy R$ 979,20   →  TRANSACTION (type=EXPENSE)
```

---

## 7. Considerações para Próximas Etapas

### Para Features & User Stories (Etapa 2):
- **CRUD** de todas as entidades
- **Dashboard mensal** (espelhando a planilha)
- **Gestão de faturas** com importação
- **Alertas de orçamento** via WhatsApp (API Twilio ou similar)
- **Metas de economia** com tracking visual

### Para Arquitetura (Etapa 5):
- **Banco:** PostgreSQL (recomendado para os tipos de dados e queries)
- **ORM:** Prisma (já que está em Next.js)
- **APIs WhatsApp:** Twilio WhatsApp Business API ou Evolution API (self-hosted)
- **Import de faturas:** Parser de CSV/OFX no backend

---

> **Próximo passo:** Etapa 2 — Definição de Features & User Stories
