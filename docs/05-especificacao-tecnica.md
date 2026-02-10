# Especificação Técnica — Finance App

> **Etapa 5 do fluxo de desenvolvimento**
> Data: Fevereiro/2026

---

## 1. Stack Tecnológico

### 1.1 Decisões de Stack

| Camada         | Tecnologia                | Versão   | Justificativa                                                  |
| -------------- | ------------------------- | -------- | -------------------------------------------------------------- |
| **Framework**  | Next.js (App Router)      | 16.x     | Já configurado; SSR, API Routes, RSC                           |
| **Linguagem**  | TypeScript                | 5.x      | Type-safety end-to-end                                         |
| **Runtime**    | React                     | 19.x     | Server Components, Suspense, Transitions                      |
| **Estilização**| Tailwind CSS              | 4.x      | Já configurado; utility-first, mobile-first                    |
| **UI Library** | shadcn/ui                 | latest   | Componentes acessíveis, customizáveis, sem lock-in             |
| **ORM**        | Prisma                    | 6.x      | Type-safe queries, migrations, studio                          |
| **Banco**      | PostgreSQL                | 16.x     | ACID, JSON support, performance                                |
| **Auth**       | NextAuth.js (Auth.js)     | 5.x      | Integrado ao Next.js, Credentials + OAuth ready                |
| **Validação**  | Zod                       | 3.x      | Schema validation compartilhado (form ↔ API)                   |
| **Forms**      | React Hook Form           | 7.x      | Performance, validação com Zod resolver                        |
| **Gráficos**   | Recharts                  | 2.x      | Leve, responsivo, boa integração React                         |
| **Ícones**     | Lucide React              | latest   | Ícones consistentes, tree-shakeable                            |
| **Datas**      | date-fns                  | 4.x      | Leve, imutável, locale pt-BR                                   |
| **Estado**     | Nuqs                      | 2.x      | URL state para filtros; React state para o resto               |
| **PWA**        | next-pwa / Serwist        | latest   | Service worker, cache, installable                             |
| **WhatsApp**   | Evolution API (self-host) | latest   | Gratuita, self-hosted, API REST                                |
| **Deploy**     | Vercel                    | —        | Zero-config para Next.js, edge functions                       |
| **DB Hosting** | Supabase / Neon           | —        | PostgreSQL gerenciado, free tier generoso                      |

### 1.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    iPhone (Safari/PWA)                    │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Next.js App (Client)                    │ │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │ │
│  │  │ shadcn/ui│ │ Recharts │ │  React Hook Form  │   │ │
│  │  │components│ │  charts  │ │  + Zod validation │   │ │
│  │  └──────────┘ └──────────┘ └───────────────────┘   │ │
│  └─────────────────────┬───────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │ HTTPS
┌────────────────────────┼─────────────────────────────────┐
│                   Vercel Edge                             │
│  ┌─────────────────────┴───────────────────────────────┐ │
│  │             Next.js App (Server)                     │ │
│  │                                                      │ │
│  │  ┌──────────────┐  ┌─────────────┐  ┌────────────┐ │ │
│  │  │ Server       │  │  Server     │  │  Auth.js   │ │ │
│  │  │ Actions      │  │  Components │  │  (Session) │ │ │
│  │  └──────┬───────┘  └──────┬──────┘  └─────┬──────┘ │ │
│  │         │                 │                │        │ │
│  │  ┌──────┴─────────────────┴────────────────┴──────┐ │ │
│  │  │            Service Layer (lib/services/)       │ │ │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐   │ │ │
│  │  │  │ Zod      │ │ Business │ │ Error        │   │ │ │
│  │  │  │ Schemas  │ │ Logic    │ │ Handling     │   │ │ │
│  │  │  └──────────┘ └──────────┘ └──────────────┘   │ │ │
│  │  └────────────────────┬───────────────────────────┘ │ │
│  │                       │                              │ │
│  │  ┌────────────────────┴───────────────────────────┐ │ │
│  │  │          Prisma ORM (lib/db/)                   │ │ │
│  │  └────────────────────┬───────────────────────────┘ │ │
│  └───────────────────────┼─────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────┘
                           │ TCP/SSL
              ┌────────────┴────────────┐
              │   PostgreSQL (Neon)      │
              │   ┌──────────────────┐  │
              │   │  finance_app_db  │  │
              │   └──────────────────┘  │
              └─────────────────────────┘

              ┌─────────────────────────┐
              │  Evolution API (VPS)    │
              │  WhatsApp Alerts        │
              └─────────────────────────┘
```

---

## 2. Padrão Arquitetural

### 2.1 Server Actions (em vez de API Routes)

O Next.js 16 com App Router favorece **Server Actions** sobre API Routes tradicionais para mutations. Usaremos:

| Operação           | Abordagem                  | Motivo                                          |
| ------------------ | -------------------------- | ----------------------------------------------- |
| **Mutations**      | Server Actions             | Colocalizado, type-safe, progressive enhancement|
| **Queries (SSR)**  | Server Components + Prisma | Dados carregados no servidor, zero JS client     |
| **Queries (CSR)**  | Server Actions + SWR/React Query | Para dados que precisam de refresh client-side |
| **File Upload**    | API Route (POST)           | Necessário para multipart/form-data              |
| **Webhooks**       | API Route                  | Endpoints externos (WhatsApp callback)           |

### 2.2 Estrutura de Camadas

```
Request Flow:

UI Component (Client/Server)
  → Server Action / Server Component
    → Service Layer (business logic + validation)
      → Prisma (data access)
        → PostgreSQL
```

**Regras:**
- **Componentes** nunca acessam Prisma diretamente
- **Server Actions** validam input (Zod) e delegam ao **Service**
- **Services** contêm regras de negócio e acessam Prisma
- **Prisma Client** é singleton (`lib/db/prisma.ts`)

---

## 3. Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// ENUMS
// ============================================================

enum AccountType {
  CHECKING
  INVESTMENT
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

enum CategoryType {
  INCOME
  EXPENSE
}

enum Frequency {
  MONTHLY
  YEARLY
}

enum AlertType {
  BUDGET_WARNING
  BUDGET_EXCEEDED
  GOAL_MILESTONE
}

enum AlertChannel {
  WHATSAPP
  IN_APP
}

enum FileFormat {
  CSV
  OFX
  PDF
}

// ============================================================
// MODELS
// ============================================================

model User {
  id             String   @id @default(cuid())
  name           String
  email          String   @unique
  passwordHash   String   @map("password_hash")
  phoneWhatsapp  String?  @map("phone_whatsapp")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  accounts          Account[]
  creditCards       CreditCard[]
  categories        Category[]
  tags              Tag[]
  transactions      Transaction[]
  recurrences       Recurrence[]
  installmentPlans  InstallmentPlan[]
  monthlyBalances   MonthlyBalance[]
  budgets           Budget[]
  investments       Investment[]
  savingsGoals      SavingsGoal[]
  alertConfigs      AlertConfig[]
  alertLogs         AlertLog[]

  @@map("users")
}

model Account {
  id             String      @id @default(cuid())
  userId         String      @map("user_id")
  name           String
  type           AccountType
  initialBalance Decimal     @default(0) @map("initial_balance") @db.Decimal(12, 2)
  isActive       Boolean     @default(true) @map("is_active")
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  recurrences  Recurrence[]
  investments  Investment[]

  @@map("accounts")
}

model CreditCard {
  id          String  @id @default(cuid())
  userId      String  @map("user_id")
  name        String
  creditLimit Decimal? @map("credit_limit") @db.Decimal(12, 2)
  closingDay  Int     @map("closing_day")
  dueDay      Int     @map("due_day")
  isActive    Boolean @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user             User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions     Transaction[]
  invoices         CreditCardInvoice[]
  recurrences      Recurrence[]
  installmentPlans InstallmentPlan[]

  @@map("credit_cards")
}

model Category {
  id        String       @id @default(cuid())
  userId    String       @map("user_id")
  parentId  String?      @map("parent_id")
  name      String
  type      CategoryType
  icon      String?
  color     String?
  isActive  Boolean      @default(true) @map("is_active")
  createdAt DateTime     @default(now()) @map("created_at")

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent           Category?         @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children         Category[]        @relation("CategoryHierarchy")
  transactions     Transaction[]
  recurrences      Recurrence[]
  installmentPlans InstallmentPlan[]
  budgets          Budget[]

  @@map("categories")
}

model Tag {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  name      String
  color     String?
  createdAt DateTime @default(now()) @map("created_at")

  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions TransactionTag[]

  @@unique([userId, name])
  @@map("tags")
}

model Transaction {
  id                String          @id @default(cuid())
  userId            String          @map("user_id")
  accountId         String?         @map("account_id")
  creditCardId      String?         @map("credit_card_id")
  invoiceId         String?         @map("invoice_id")
  categoryId        String          @map("category_id")
  installmentPlanId String?         @map("installment_plan_id")
  recurrenceId      String?         @map("recurrence_id")
  type              TransactionType
  description       String
  amount            Decimal         @db.Decimal(12, 2)
  date              DateTime        @db.Date
  installmentNumber Int?            @map("installment_number")
  notes             String?
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  account          Account?          @relation(fields: [accountId], references: [id])
  creditCard       CreditCard?       @relation(fields: [creditCardId], references: [id])
  invoice          CreditCardInvoice? @relation(fields: [invoiceId], references: [id])
  category         Category          @relation(fields: [categoryId], references: [id])
  installmentPlan  InstallmentPlan?  @relation(fields: [installmentPlanId], references: [id])
  recurrence       Recurrence?       @relation(fields: [recurrenceId], references: [id])
  tags             TransactionTag[]

  @@index([userId, date])
  @@index([userId, categoryId, date])
  @@index([accountId, date])
  @@index([creditCardId, invoiceId])
  @@index([installmentPlanId])
  @@map("transactions")
}

model TransactionTag {
  transactionId String @map("transaction_id")
  tagId         String @map("tag_id")

  transaction Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  tag         Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([transactionId, tagId])
  @@map("transaction_tags")
}

model Recurrence {
  id           String          @id @default(cuid())
  userId       String          @map("user_id")
  categoryId   String          @map("category_id")
  accountId    String?         @map("account_id")
  creditCardId String?         @map("credit_card_id")
  description  String
  type         TransactionType
  amount       Decimal         @db.Decimal(12, 2)
  frequency    Frequency
  dayOfMonth   Int             @map("day_of_month")
  startDate    DateTime        @map("start_date") @db.Date
  endDate      DateTime?       @map("end_date") @db.Date
  isActive     Boolean         @default(true) @map("is_active")
  createdAt    DateTime        @default(now()) @map("created_at")
  updatedAt    DateTime        @updatedAt @map("updated_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category     Category      @relation(fields: [categoryId], references: [id])
  account      Account?      @relation(fields: [accountId], references: [id])
  creditCard   CreditCard?   @relation(fields: [creditCardId], references: [id])
  transactions Transaction[]

  @@index([userId, isActive])
  @@map("recurrences")
}

model InstallmentPlan {
  id                String   @id @default(cuid())
  userId            String   @map("user_id")
  creditCardId      String?  @map("credit_card_id")
  categoryId        String   @map("category_id")
  description       String
  totalAmount       Decimal  @map("total_amount") @db.Decimal(12, 2)
  totalInstallments Int      @map("total_installments")
  installmentAmount Decimal  @map("installment_amount") @db.Decimal(12, 2)
  startDate         DateTime @map("start_date") @db.Date
  createdAt         DateTime @default(now()) @map("created_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  creditCard   CreditCard?   @relation(fields: [creditCardId], references: [id])
  category     Category      @relation(fields: [categoryId], references: [id])
  transactions Transaction[]

  @@map("installment_plans")
}

model MonthlyBalance {
  id                   String  @id @default(cuid())
  userId               String  @map("user_id")
  year                 Int
  month                Int
  previousBalance      Decimal @map("previous_balance") @db.Decimal(12, 2)
  totalIncome          Decimal @map("total_income") @db.Decimal(12, 2)
  totalExpenses        Decimal @map("total_expenses") @db.Decimal(12, 2)
  monthlyDelta         Decimal @map("monthly_delta") @db.Decimal(12, 2)
  carryForwardBalance  Decimal @map("carry_forward_balance") @db.Decimal(12, 2)
  isClosed             Boolean @default(false) @map("is_closed")
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, year, month])
  @@map("monthly_balances")
}

model Budget {
  id                    String   @id @default(cuid())
  userId                String   @map("user_id")
  categoryId            String   @map("category_id")
  year                  Int
  month                 Int
  limitAmount           Decimal  @map("limit_amount") @db.Decimal(12, 2)
  alertThresholdPercent Int      @default(80) @map("alert_threshold_percent")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id])

  @@unique([userId, categoryId, year, month])
  @@map("budgets")
}

model CreditCardInvoice {
  id           String    @id @default(cuid())
  creditCardId String    @map("credit_card_id")
  year         Int
  month        Int
  totalAmount  Decimal   @map("total_amount") @db.Decimal(12, 2)
  dueDate      DateTime  @map("due_date") @db.Date
  isPaid       Boolean   @default(false) @map("is_paid")
  paymentDate  DateTime? @map("payment_date") @db.Date
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  creditCard   CreditCard      @relation(fields: [creditCardId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  imports      InvoiceImport[]

  @@unique([creditCardId, year, month])
  @@map("credit_card_invoices")
}

model InvoiceImport {
  id            String     @id @default(cuid())
  invoiceId     String     @map("invoice_id")
  fileName      String     @map("file_name")
  fileFormat    FileFormat @map("file_format")
  itemsImported Int        @map("items_imported")
  importedAt    DateTime   @default(now()) @map("imported_at")

  invoice CreditCardInvoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@map("invoice_imports")
}

model Investment {
  id             String   @id @default(cuid())
  userId         String   @map("user_id")
  accountId      String?  @map("account_id")
  assetType      String   @map("asset_type")
  description    String?
  amountInvested Decimal  @map("amount_invested") @db.Decimal(12, 2)
  quantity       Decimal? @db.Decimal(18, 8)
  date           DateTime @db.Date
  notes          String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  account Account? @relation(fields: [accountId], references: [id])

  @@map("investments")
}

model SavingsGoal {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  name          String
  description   String?
  targetAmount  Decimal   @map("target_amount") @db.Decimal(12, 2)
  currentAmount Decimal   @default(0) @map("current_amount") @db.Decimal(12, 2)
  deadline      DateTime? @db.Date
  isAchieved    Boolean   @default(false) @map("is_achieved")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("savings_goals")
}

model AlertConfig {
  id                String       @id @default(cuid())
  userId            String       @map("user_id")
  type              AlertType
  channel           AlertChannel
  thresholdPercent  Int          @map("threshold_percent")
  isActive          Boolean      @default(true) @map("is_active")
  createdAt         DateTime     @default(now()) @map("created_at")

  user User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs AlertLog[]

  @@map("alert_configs")
}

model AlertLog {
  id            String   @id @default(cuid())
  alertConfigId String   @map("alert_config_id")
  userId        String   @map("user_id")
  message       String
  isRead        Boolean  @default(false) @map("is_read")
  sentAt        DateTime @default(now()) @map("sent_at")

  alertConfig AlertConfig @relation(fields: [alertConfigId], references: [id], onDelete: Cascade)
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@map("alert_logs")
}
```

---

## 4. Server Actions — Contratos

Todas as mutations são Server Actions. Cada action segue o padrão:

```typescript
// Padrão de Server Action
"use server"

import { z } from "zod"
import { actionClient } from "@/lib/safe-action"

export const createTransaction = actionClient
  .schema(createTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    // ctx.userId vem do middleware de auth
    return transactionService.create(ctx.userId, parsedInput)
  })
```

### 4.1 Auth Actions

```
Arquivo: app/(auth)/actions.ts

signUp(input: SignUpInput)          → { user }
signIn(input: SignInInput)          → { session }
signOut()                           → void
requestPasswordReset(email)         → { message }
resetPassword(token, newPassword)   → { message }
```

**Schemas:**
```typescript
const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
})

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

### 4.2 Account Actions

```
Arquivo: app/(app)/accounts/actions.ts

createAccount(input)      → { account }
updateAccount(id, input)  → { account }
toggleAccount(id)         → { account }    // ativa/desativa
```

**Schema:**
```typescript
const accountSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.nativeEnum(AccountType),
  initialBalance: z.number().transform(v => new Decimal(v)),
})
```

### 4.3 Credit Card Actions

```
Arquivo: app/(app)/credit-cards/actions.ts

createCreditCard(input)      → { creditCard }
updateCreditCard(id, input)  → { creditCard }
toggleCreditCard(id)         → { creditCard }
```

**Schema:**
```typescript
const creditCardSchema = z.object({
  name: z.string().min(1).max(50),
  creditLimit: z.number().positive().optional(),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
})
```

### 4.4 Category Actions

```
Arquivo: app/(app)/categories/actions.ts

createCategory(input)      → { category }
updateCategory(id, input)  → { category }
toggleCategory(id)         → { category }
```

**Schema:**
```typescript
const categorySchema = z.object({
  parentId: z.string().cuid().optional(),
  name: z.string().min(1).max(50),
  type: z.nativeEnum(CategoryType),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})
```

### 4.5 Tag Actions

```
Arquivo: app/(app)/tags/actions.ts

createTag(input)    → { tag }
updateTag(id, input)→ { tag }
deleteTag(id)       → void
```

### 4.6 Transaction Actions (Core)

```
Arquivo: app/(app)/transactions/actions.ts

createTransaction(input)       → { transaction }
updateTransaction(id, input)   → { transaction }
deleteTransaction(id)          → void
```

**Schema:**
```typescript
const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  description: z.string().min(1).max(200),
  amount: z.number().positive(),
  date: z.coerce.date(),
  categoryId: z.string().cuid(),
  accountId: z.string().cuid().optional(),
  creditCardId: z.string().cuid().optional(),
  installmentPlanId: z.string().cuid().optional(),
  installmentNumber: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
  tagIds: z.array(z.string().cuid()).optional(),
}).refine(
  d => (d.accountId && !d.creditCardId) || (!d.accountId && d.creditCardId),
  { message: "Informe conta OU cartão, não ambos" }
)
```

**Regras de negócio no Service:**
- Se `creditCardId` preenchido → associar à fatura do mês correspondente (`invoiceId`)
- Se `installmentPlanId` → validar `installmentNumber` ≤ `totalInstallments`
- Após criar/editar/excluir → recalcular `MonthlyBalance` do mês afetado (se não fechado)

### 4.7 Recurrence Actions

```
Arquivo: app/(app)/recurrences/actions.ts

createRecurrence(input)        → { recurrence, generatedTransactions[] }
updateRecurrence(id, input)    → { recurrence }
toggleRecurrence(id)           → { recurrence }
deleteRecurrence(id)           → void
generateMonthlyTransactions()  → { count }    // cron/manual: gera transações do mês
```

**Schema:**
```typescript
const recurrenceSchema = z.object({
  description: z.string().min(1).max(200),
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive(),
  categoryId: z.string().cuid(),
  accountId: z.string().cuid().optional(),
  creditCardId: z.string().cuid().optional(),
  frequency: z.nativeEnum(Frequency),
  dayOfMonth: z.number().int().min(1).max(31),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
})
```

### 4.8 Installment Plan Actions

```
Arquivo: app/(app)/installments/actions.ts

createInstallmentPlan(input)  → { plan, transactions[] }
deleteInstallmentPlan(id)     → void    // exclui plano + parcelas futuras não pagas
```

**Schema:**
```typescript
const installmentPlanSchema = z.object({
  description: z.string().min(1).max(200),
  totalAmount: z.number().positive(),
  totalInstallments: z.number().int().min(2).max(48),
  categoryId: z.string().cuid(),
  creditCardId: z.string().cuid().optional(),
  startDate: z.coerce.date(),
})
// installmentAmount = totalAmount / totalInstallments (calculado no service)
```

### 4.9 Monthly Balance Actions

```
Arquivo: app/(app)/dashboard/actions.ts

recalculateMonthlyBalance(year, month)  → { balance }
closeMonth(year, month)                 → { balance }
reopenMonth(year, month)                → { balance }
```

### 4.10 Budget Actions

```
Arquivo: app/(app)/budgets/actions.ts

createBudget(input)      → { budget }
updateBudget(id, input)  → { budget }
deleteBudget(id)         → void
```

**Schema:**
```typescript
const budgetSchema = z.object({
  categoryId: z.string().cuid(),
  year: z.number().int().min(2020).max(2100),
  month: z.number().int().min(1).max(12),
  limitAmount: z.number().positive(),
  alertThresholdPercent: z.number().int().min(1).max(100).default(80),
})
```

### 4.11 Credit Card Invoice Actions

```
Arquivo: app/(app)/invoices/actions.ts

markInvoiceAsPaid(id, paymentDate)  → { invoice }
reopenInvoice(id)                   → { invoice }
```

### 4.12 Invoice Import Actions

```
Arquivo: app/(app)/invoices/import/actions.ts

// Este usa API Route (multipart upload), não Server Action
// POST /api/invoices/import
importInvoice(file, creditCardId, year, month)  → { import, transactions[] }
```

### 4.13 Investment Actions

```
Arquivo: app/(app)/investments/actions.ts

createInvestment(input)      → { investment }
updateInvestment(id, input)  → { investment }
deleteInvestment(id)         → void
```

### 4.14 Savings Goal Actions

```
Arquivo: app/(app)/goals/actions.ts

createGoal(input)              → { goal }
updateGoal(id, input)          → { goal }
addContribution(id, amount)    → { goal }
deleteGoal(id)                 → void
```

### 4.15 Alert Actions

```
Arquivo: app/(app)/alerts/actions.ts

createAlertConfig(input)      → { config }
updateAlertConfig(id, input)  → { config }
toggleAlertConfig(id)         → { config }
markAlertAsRead(id)           → void
markAllAlertsAsRead()         → void
```

---

## 5. Queries — Data Fetching (Server Components)

Queries são feitas diretamente nos Server Components via service layer.

### 5.1 Dashboard Queries

```typescript
// lib/services/dashboard.service.ts

getMonthlyOverview(userId, year, month)
→ {
    previousBalance: Decimal
    totalIncome: Decimal
    totalExpenses: Decimal
    monthlyDelta: Decimal
    carryForwardBalance: Decimal
    isClosed: boolean
    expensesByCategory: { category, amount, percentage }[]
    creditCardSummary: { card, invoiceAmount, limit, usagePercent }[]
  }

getMonthlyEvolution(userId, months: 6)
→ { year, month, income, expenses, balance }[]
```

### 5.2 Transaction Queries

```typescript
// lib/services/transaction.service.ts

getTransactions(userId, filters: {
  year: number
  month: number
  categoryId?: string
  accountId?: string
  creditCardId?: string
  tagIds?: string[]
  type?: TransactionType
  search?: string
  page?: number
  pageSize?: number   // default: 50
})
→ {
    transactions: Transaction[]
    runningBalance: Decimal[]     // saldo acumulado por transação
    total: number
    page: number
    pageSize: number
  }
```

### 5.3 Account Queries

```typescript
// lib/services/account.service.ts

getAccounts(userId)
→ {
    accounts: (Account & { currentBalance: Decimal })[]
    totalBalance: Decimal
  }

getAccountDetail(userId, accountId)
→ Account & { currentBalance: Decimal, recentTransactions: Transaction[] }
```

### 5.4 Credit Card Queries

```typescript
// lib/services/credit-card.service.ts

getCreditCards(userId)
→ {
    cards: (CreditCard & {
      currentInvoiceAmount: Decimal
      usagePercent: number
    })[]
    totalInvoices: Decimal
  }

getInvoiceDetail(userId, creditCardId, year, month)
→ CreditCardInvoice & { transactions: Transaction[] }
```

### 5.5 Recurrence Queries

```typescript
// lib/services/recurrence.service.ts

getRecurrences(userId, activeOnly?: boolean)
→ {
    recurrences: Recurrence[]
    totalMonthlyFixed: Decimal
  }
```

### 5.6 Installment Queries

```typescript
// lib/services/installment.service.ts

getInstallmentPlans(userId, activeOnly?: boolean)
→ {
    plans: (InstallmentPlan & {
      paidInstallments: number
      remainingAmount: Decimal
    })[]
    totalPendingAmount: Decimal
  }
```

### 5.7 Budget Queries

```typescript
// lib/services/budget.service.ts

getBudgets(userId, year, month)
→ {
    budgets: (Budget & {
      spent: Decimal
      remaining: Decimal
      usagePercent: number
      status: 'ok' | 'warning' | 'exceeded'
    })[]
  }
```

---

## 6. API Routes (Endpoints REST)

Apenas para cenários onde Server Actions não se encaixam.

### 6.1 File Upload — Importação de Fatura

```
POST /api/invoices/import
Content-Type: multipart/form-data

Body:
  file: File (CSV/OFX)
  creditCardId: string
  year: number
  month: number

Response 200:
{
  importId: string
  itemsImported: number
  transactions: TransactionPreview[]
}

Response 400: { error: "Formato não suportado" }
Response 409: { error: "Fatura já importada" }
```

### 6.2 WhatsApp Webhook

```
POST /api/webhooks/whatsapp
(Recebe callbacks da Evolution API)

GET /api/cron/check-budgets
(Verifica budgets e envia alertas — chamado por Vercel Cron)

GET /api/cron/generate-recurrences
(Gera transações recorrentes do mês — chamado por Vercel Cron)
```

---

## 7. Estrutura de Pastas

```
finance-app/
├── app/
│   ├── (auth)/                          # Grupo: telas de auth (sem bottom nav)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   ├── actions.ts                   # Server Actions de auth
│   │   └── layout.tsx                   # Layout sem bottom nav
│   │
│   ├── (app)/                           # Grupo: app autenticado (com bottom nav)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # US-401..407 — Painel mensal
│   │   │   ├── actions.ts
│   │   │   ├── _components/
│   │   │   │   ├── monthly-summary.tsx
│   │   │   │   ├── category-chart.tsx
│   │   │   │   ├── evolution-chart.tsx
│   │   │   │   ├── credit-card-summary.tsx
│   │   │   │   └── month-navigator.tsx
│   │   │   └── loading.tsx              # Skeleton
│   │   │
│   │   ├── transactions/
│   │   │   ├── page.tsx                 # US-305..307 — Lista de transações
│   │   │   ├── new/
│   │   │   │   └── page.tsx             # US-301..304 — Nova transação
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             # Detalhe
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx         # US-308 — Editar transação
│   │   │   ├── actions.ts
│   │   │   ├── _components/
│   │   │   │   ├── transaction-list.tsx
│   │   │   │   ├── transaction-form.tsx
│   │   │   │   ├── transaction-filters.tsx
│   │   │   │   └── transaction-card.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── accounts/
│   │   │   ├── page.tsx                 # US-202 — Lista de contas
│   │   │   ├── new/
│   │   │   │   └── page.tsx             # US-201 — Nova conta
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx             # US-203 — Detalhe/editar
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       ├── account-list.tsx
│   │   │       └── account-form.tsx
│   │   │
│   │   ├── credit-cards/
│   │   │   ├── page.tsx                 # US-206 — Lista de cartões
│   │   │   ├── new/
│   │   │   │   └── page.tsx             # US-205 — Novo cartão
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             # US-207 — Detalhe/editar
│   │   │   │   └── invoices/
│   │   │   │       ├── page.tsx         # US-601 — Faturas do cartão
│   │   │   │       ├── [invoiceId]/
│   │   │   │       │   └── page.tsx     # Detalhe da fatura
│   │   │   │       └── import/
│   │   │   │           └── page.tsx     # US-604..605 — Importar fatura
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       ├── credit-card-list.tsx
│   │   │       ├── credit-card-form.tsx
│   │   │       ├── invoice-detail.tsx
│   │   │       └── invoice-import-form.tsx
│   │   │
│   │   ├── recurrences/
│   │   │   ├── page.tsx                 # US-502 — Lista de recorrências
│   │   │   ├── new/
│   │   │   │   └── page.tsx             # US-501 — Nova recorrência
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx             # US-503 — Editar
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       ├── recurrence-list.tsx
│   │   │       └── recurrence-form.tsx
│   │   │
│   │   ├── installments/
│   │   │   ├── page.tsx                 # US-507 — Lista de parcelamentos
│   │   │   ├── new/
│   │   │   │   └── page.tsx             # US-506 — Novo parcelamento
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       ├── installment-list.tsx
│   │   │       └── installment-form.tsx
│   │   │
│   │   ├── budgets/
│   │   │   ├── page.tsx                 # US-702 — Visão orçamentos
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       ├── budget-list.tsx
│   │   │       └── budget-form.tsx
│   │   │
│   │   ├── goals/
│   │   │   ├── page.tsx                 # US-803 — Metas
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       ├── goal-list.tsx
│   │   │       └── goal-form.tsx
│   │   │
│   │   ├── investments/
│   │   │   ├── page.tsx                 # US-806 — Investimentos
│   │   │   ├── actions.ts
│   │   │   └── _components/
│   │   │       └── investment-list.tsx
│   │   │
│   │   ├── categories/
│   │   │   ├── page.tsx                 # US-T01 — Gerenciar categorias
│   │   │   └── actions.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── page.tsx                 # US-105, US-706 — Perfil e config alertas
│   │   │   └── actions.ts
│   │   │
│   │   └── layout.tsx                   # Layout com bottom nav + auth guard
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts             # Auth.js catch-all
│   │   ├── invoices/
│   │   │   └── import/
│   │   │       └── route.ts             # POST — Upload de fatura
│   │   ├── cron/
│   │   │   ├── check-budgets/
│   │   │   │   └── route.ts             # GET — Vercel Cron
│   │   │   └── generate-recurrences/
│   │   │       └── route.ts             # GET — Vercel Cron
│   │   └── webhooks/
│   │       └── whatsapp/
│   │           └── route.ts             # POST — Evolution API callback
│   │
│   ├── manifest.ts                      # PWA manifest (Next.js metadata)
│   ├── globals.css
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Redirect → /dashboard ou /login
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx                    # Bottom sheet (mobile)
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── bottom-nav.tsx                   # Navegação inferior mobile
│   ├── month-picker.tsx                 # Seletor de mês (shared)
│   ├── currency-input.tsx               # Input de valor monetário
│   ├── category-select.tsx              # Select de categoria com ícone
│   └── confirm-dialog.tsx               # Dialog de confirmação
│
├── lib/
│   ├── db/
│   │   └── prisma.ts                    # Prisma Client singleton
│   ├── services/
│   │   ├── account.service.ts
│   │   ├── credit-card.service.ts
│   │   ├── transaction.service.ts
│   │   ├── recurrence.service.ts
│   │   ├── installment.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── budget.service.ts
│   │   ├── invoice.service.ts
│   │   ├── invoice-import.service.ts
│   │   ├── investment.service.ts
│   │   ├── savings-goal.service.ts
│   │   ├── alert.service.ts
│   │   └── whatsapp.service.ts
│   ├── schemas/                         # Zod schemas (compartilhados)
│   │   ├── auth.schema.ts
│   │   ├── account.schema.ts
│   │   ├── credit-card.schema.ts
│   │   ├── transaction.schema.ts
│   │   ├── recurrence.schema.ts
│   │   ├── installment.schema.ts
│   │   ├── budget.schema.ts
│   │   ├── category.schema.ts
│   │   ├── tag.schema.ts
│   │   ├── investment.schema.ts
│   │   └── savings-goal.schema.ts
│   ├── auth.ts                          # Auth.js config
│   ├── safe-action.ts                   # next-safe-action client setup
│   ├── utils.ts                         # Helpers (cn, formatCurrency, etc.)
│   └── constants.ts                     # Constantes (PAGE_SIZE, etc.)
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                          # Seed: categorias padrão
│   └── migrations/
│
├── public/
│   ├── icons/                           # PWA icons (192, 512)
│   └── screenshots/                     # PWA screenshots
│
├── docs/
│   ├── 01-modelagem-dados.md
│   ├── 02-features-user-stories.md
│   └── 05-especificacao-tecnica.md
│
├── .env.local                           # Variáveis locais (não commitada)
├── .env.example                         # Template de variáveis
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 8. Autenticação

### 8.1 Auth.js (NextAuth v5)

```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.userId = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.userId as string
      return session
    },
  },
})
```

### 8.2 Middleware de Auth

```typescript
// middleware.ts
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/(app)/:path*",    // Protege todas as rotas do app
    "/api/:path*",       // Protege APIs (exceto auth)
  ],
}
```

### 8.3 Helper para Server Actions

```typescript
// lib/safe-action.ts
import { createSafeActionClient } from "next-safe-action"
import { auth } from "@/lib/auth"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    return e.message
  },
}).use(async ({ next }) => {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Não autenticado")
  return next({ ctx: { userId: session.user.id } })
})
```

---

## 9. PWA Configuration

```typescript
// app/manifest.ts
import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finance App",
    short_name: "Finance",
    description: "Controle financeiro pessoal",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
```

---

## 10. Vercel Cron Jobs

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/generate-recurrences",
      "schedule": "0 6 1 * *"
    },
    {
      "path": "/api/cron/check-budgets",
      "schedule": "0 20 * * *"
    }
  ]
}
```

| Cron Job                 | Schedule        | Descrição                                              |
| ------------------------ | --------------- | ------------------------------------------------------ |
| generate-recurrences     | 06:00 dia 1/mês | Gera transações do mês para todas as recorrências ativas|
| check-budgets            | 20:00 diário    | Verifica orçamentos e envia alertas (in-app + WhatsApp) |

---

## 11. Variáveis de Ambiente

```bash
# .env.example

# ---- Database ----
DATABASE_URL="postgresql://user:pass@host:5432/finance_app?sslmode=require"

# ---- Auth ----
AUTH_SECRET="gerar-com-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# ---- WhatsApp (Evolution API) ----
EVOLUTION_API_URL="https://evolution.seudominio.com"
EVOLUTION_API_KEY="sua-api-key"
EVOLUTION_INSTANCE="finance-alerts"

# ---- Vercel Cron ----
CRON_SECRET="secret-para-validar-cron-requests"
```

---

## 12. Seed de Dados Iniciais

```typescript
// prisma/seed.ts
// Executado após migrate: npx prisma db seed

const defaultCategories = [
  // INCOME
  { name: "Salário", type: "INCOME", icon: "banknote", color: "#22c55e" },
  { name: "Outros", type: "INCOME", icon: "plus-circle", color: "#6366f1" },

  // EXPENSE
  {
    name: "Moradia", type: "EXPENSE", icon: "home", color: "#f59e0b",
    children: [
      { name: "Financiamento", icon: "landmark" },
      { name: "Condomínio", icon: "building-2" },
      { name: "Internet", icon: "wifi" },
      { name: "Garagem", icon: "car" },
    ]
  },
  {
    name: "Transporte", type: "EXPENSE", icon: "car", color: "#ef4444",
    children: [
      { name: "Gasolina", icon: "fuel" },
      { name: "IPVA", icon: "file-text" },
    ]
  },
  {
    name: "Pessoal", type: "EXPENSE", icon: "user", color: "#8b5cf6",
    children: [
      { name: "Barbeiro", icon: "scissors" },
      { name: "Celular", icon: "smartphone" },
    ]
  },
  {
    name: "Família", type: "EXPENSE", icon: "heart", color: "#ec4899",
    children: [
      { name: "Pix Mãe", icon: "send" },
    ]
  },
  {
    name: "Impostos", type: "EXPENSE", icon: "receipt", color: "#f97316",
    children: [
      { name: "DAS", icon: "file-text" },
    ]
  },
  {
    name: "Cartão de Crédito", type: "EXPENSE", icon: "credit-card", color: "#06b6d4",
    children: [
      { name: "Nubank", icon: "credit-card" },
      { name: "Inter", icon: "credit-card" },
      { name: "Leroy", icon: "credit-card" },
    ]
  },
  { name: "Outros", type: "EXPENSE", icon: "more-horizontal", color: "#94a3b8" },
]
```

---

## 13. Decisões Técnicas & Trade-offs

### 13.1 Por que Server Actions e não API Routes?

| Critério        | Server Actions          | API Routes            |
| --------------- | ----------------------- | --------------------- |
| Type-safety     | End-to-end automático   | Manual (tipos duplicados) |
| Boilerplate     | Mínimo                  | Request/Response parsing |
| Progressive Enh.| Forms funcionam sem JS  | Não                   |
| Caching         | `revalidatePath/Tag`    | Manual                |
| When to use     | Mutations do app        | Upload, Webhooks, Cron|

### 13.2 Por que Prisma e não Drizzle?

- **Prisma Studio** para inspecionar dados durante desenvolvimento
- **Prisma Migrate** com histórico de migrations
- Schema declarativo mais legível para este tamanho de projeto
- O projeto não terá queries SQL complexas que justifiquem Drizzle

### 13.3 Por que shadcn/ui?

- Componentes são copiados para o projeto (sem dependência externa)
- Acessíveis (Radix UI primitives)
- Totalmente customizáveis com Tailwind
- Sheet (bottom sheet) essencial para UX mobile

### 13.4 Saldo: Calculado vs Armazenado

- **Saldo de conta** → Calculado (`initialBalance + SUM(transactions)`)
- **Saldo acumulado na listagem** → Calculado em runtime (window function)
- **MonthlyBalance** → Snapshot armazenado (performance + histórico)
- Trade-off: recalcular ao editar/excluir transação de mês ainda aberto

### 13.5 Estratégia de Cache

```
revalidatePath("/dashboard")          → ao criar/editar/excluir transação
revalidatePath("/transactions")       → ao criar/editar/excluir transação
revalidatePath("/credit-cards")       → ao alterar fatura/cartão
revalidatePath("/recurrences")        → ao alterar recorrência
```

### 13.6 Import de Fatura: Formatos

| Formato | Parser               | Prioridade |
| ------- | -------------------- | ---------- |
| CSV     | csv-parse (custom)   | Alta       |
| OFX     | ofx-js               | Média      |
| PDF     | Futuro (OCR)         | Backlog    |

---

## 14. Checklist de Setup (Sprint 1)

```
[ ] 1.  Instalar dependências (prisma, auth, shadcn, zod, react-hook-form, etc.)
[ ] 2.  Configurar Prisma + PostgreSQL (Neon)
[ ] 3.  Rodar prisma migrate dev (schema inicial)
[ ] 4.  Configurar Auth.js (Credentials provider)
[ ] 5.  Configurar shadcn/ui (init + componentes base)
[ ] 6.  Criar layout (app) com bottom nav
[ ] 7.  Criar layout (auth) sem nav
[ ] 8.  Configurar PWA (manifest.ts + icons)
[ ] 9.  Criar middleware de auth
[ ] 10. Configurar safe-action client
[ ] 11. Criar Prisma singleton
[ ] 12. Criar seed de categorias
[ ] 13. Configurar .env.example
[ ] 14. Configurar vercel.json (crons)
[ ] 15. Deploy inicial (Vercel)
```

---

> **Próximo passo:** Etapa 6 — Desenvolvimento (Sprint 1: Setup + Auth + Perfil)
