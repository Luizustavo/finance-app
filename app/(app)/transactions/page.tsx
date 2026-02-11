import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { startOfMonth, endOfMonth, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TransactionList } from "./_components/transaction-list"
import { MonthNavigator } from "./_components/month-navigator"
import { TransactionFilters } from "./_components/transaction-filters"
import { ArrowLeftRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Transações",
}

interface TransactionsPageProps {
  searchParams: Promise<{
    month?: string
    year?: string
    type?: string
    categoryId?: string
    accountId?: string
    creditCardId?: string
    tagId?: string
    status?: string
    q?: string
  }>
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const params = await searchParams
  const now = new Date()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1
  const year = params.year ? parseInt(params.year) : now.getFullYear()

  const dateRef = new Date(year, month - 1, 1)
  const monthStart = startOfMonth(dateRef)
  const monthEnd = endOfMonth(dateRef)

  // Build where clause
  const where: Record<string, unknown> = {
    userId: session.user.id,
    date: {
      gte: monthStart,
      lte: monthEnd,
    },
  }

  if (params.type) where.type = params.type
  if (params.categoryId) where.categoryId = params.categoryId
  if (params.accountId) where.accountId = params.accountId
  if (params.creditCardId) where.creditCardId = params.creditCardId
  if (params.q) {
    where.OR = [
      { description: { contains: params.q, mode: "insensitive" } },
      { notes: { contains: params.q, mode: "insensitive" } },
    ]
  }
  if (params.tagId) {
    where.tags = { some: { tagId: params.tagId } }
  }
  if (params.status === "paid") where.isPaid = true
  if (params.status === "pending") where.isPaid = false

  const [transactions, accounts, creditCards, categories, tags] =
    await Promise.all([
      prisma.transaction.findMany({
        where: where as any,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        include: {
          category: { select: { id: true, name: true, color: true } },
          account: { select: { id: true, name: true } },
          creditCard: { select: { id: true, name: true } },
          tags: {
            include: { tag: { select: { id: true, name: true, color: true } } },
          },
        },
      }),
      prisma.account.findMany({
        where: { userId: session.user.id, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.creditCard.findMany({
        where: { userId: session.user.id, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.category.findMany({
        where: { userId: session.user.id, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, type: true },
      }),
      prisma.tag.findMany({
        where: { userId: session.user.id },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ])

  // Calculate totals (planned vs actual)
  const totals = transactions.reduce(
    (acc, tx) => {
      const amount = Number(tx.amount)
      if (tx.type === "INCOME") {
        acc.totalIncome += amount
        if (tx.isPaid) acc.receivedIncome += amount
      } else if (tx.type === "EXPENSE") {
        acc.totalExpense += amount
        if (tx.isPaid) acc.paidExpense += amount
      }
      return acc
    },
    { totalIncome: 0, totalExpense: 0, receivedIncome: 0, paidExpense: 0 }
  )
  const projectedBalance = totals.totalIncome - totals.totalExpense
  const pendingExpense = totals.totalExpense - totals.paidExpense
  const pendingIncome = totals.totalIncome - totals.receivedIncome

  const monthLabel = format(dateRef, "MMMM yyyy", { locale: ptBR })

  // Serialize Decimal/Date for client components
  const serializedTransactions = transactions.map((tx) => ({
    ...tx,
    amount: Number(tx.amount),
    date: tx.date.toISOString(),
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  }))

  return (
    <div className="px-4 py-6">
      <MonthNavigator month={month} year={year} label={monthLabel} />

      {/* Summary cards */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">Receitas</p>
          <p className="text-sm font-semibold text-green-500">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totals.totalIncome)}
          </p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">Despesas</p>
          <p className="text-sm font-semibold text-red-500">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totals.totalExpense)}
          </p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">Saldo Prev.</p>
          <p
            className={`text-sm font-semibold ${projectedBalance >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(projectedBalance)}
          </p>
        </div>
      </div>

      {/* Paid / Pending summary */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950 p-2.5 text-center">
          <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Recebido / Pago</p>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.receivedIncome)}
            {" / "}
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.paidExpense)}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 p-2.5 text-center">
          <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400">A receber / A pagar</p>
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pendingIncome)}
            {" / "}
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pendingExpense)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        accounts={accounts}
        creditCards={creditCards}
        categories={categories}
        tags={tags}
        currentFilters={params}
        month={month}
        year={year}
      />

      {/* Transaction list */}
      {transactions.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <ArrowLeftRight className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma transação neste mês
          </p>
        </div>
      ) : (
        <TransactionList transactions={serializedTransactions} />
      )}
    </div>
  )
}
