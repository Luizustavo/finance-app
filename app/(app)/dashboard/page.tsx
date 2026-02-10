import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { startOfMonth, endOfMonth } from "date-fns"
import { DashboardHeader } from "./_components/dashboard-header"
import { CashFlowSummary } from "./_components/cash-flow-summary"
import { RecentTransactions } from "./_components/recent-transactions"
import { AccountBalances } from "./_components/account-balances"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [transactions, accounts, recentTransactions] = await Promise.all([
    // Current month transactions with isPaid
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: monthStart, lte: monthEnd },
      },
      select: { type: true, amount: true, isPaid: true },
    }),
    // All active accounts with their transaction totals
    prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        transactions: {
          select: { type: true, amount: true, isPaid: true },
        },
      },
    }),
    // Last 5 transactions
    prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 5,
      include: {
        category: { select: { id: true, name: true, color: true } },
        account: { select: { id: true, name: true } },
        creditCard: { select: { id: true, name: true } },
      },
    }),
  ])

  // Calculate month totals (planned vs actual)
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

  // Calculate account balances (only PAID transactions count for real balance)
  const accountBalances = accounts.map((account) => {
    const balance = account.transactions.reduce((sum, tx) => {
      if (!tx.isPaid) return sum
      const amount = Number(tx.amount)
      if (tx.type === "INCOME") return sum + amount
      if (tx.type === "EXPENSE") return sum - amount
      if (tx.type === "TRANSFER") return sum - amount
      return sum
    }, 0)

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance,
    }
  })

  const totalBalance = accountBalances.reduce((sum, a) => sum + a.balance, 0)

  // Serialize for client components
  const serializedRecent = recentTransactions.map((tx) => ({
    ...tx,
    amount: Number(tx.amount),
    date: tx.date.toISOString(),
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  }))

  return (
    <div className="px-4 py-6">
      <DashboardHeader userName={session.user.name ?? "Usuário"} />

      <CashFlowSummary
        totalBalance={totalBalance}
        totalIncome={totals.totalIncome}
        receivedIncome={totals.receivedIncome}
        totalExpense={totals.totalExpense}
        paidExpense={totals.paidExpense}
      />

      <AccountBalances accounts={accountBalances} />

      <RecentTransactions transactions={serializedRecent} />
    </div>
  )
}
