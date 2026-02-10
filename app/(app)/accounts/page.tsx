import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { AccountList } from "./_components/account-list"
import { CreateAccountDialog } from "./_components/create-account-dialog"
import { formatCurrency } from "@/lib/utils"
import { Wallet } from "lucide-react"

export const metadata: Metadata = {
  title: "Contas",
}

export default async function AccountsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      transactions: {
        select: { amount: true, type: true },
      },
    },
  })

  const accountsWithBalance = accounts.map((account) => {
    const balance = account.transactions.reduce((acc, t) => {
      const amount = Number(t.amount)
      if (t.type === "INCOME") return acc + amount
      if (t.type === "EXPENSE") return acc - amount
      return acc
    }, Number(account.initialBalance))

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      initialBalance: Number(account.initialBalance),
      balance,
      isActive: account.isActive,
      createdAt: account.createdAt,
    }
  })

  const totalBalance = accountsWithBalance
    .filter((a) => a.isActive)
    .reduce((acc, a) => acc + a.balance, 0)

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contas</h1>
          <p className="text-sm text-muted-foreground">
            Saldo total:{" "}
            <span
              className={
                totalBalance >= 0 ? "text-emerald-500" : "text-red-500"
              }
            >
              {formatCurrency(totalBalance)}
            </span>
          </p>
        </div>
        <CreateAccountDialog />
      </div>

      {accountsWithBalance.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma conta cadastrada
          </p>
          <p className="text-xs text-muted-foreground">
            Adicione sua primeira conta para começar
          </p>
        </div>
      ) : (
        <AccountList accounts={accountsWithBalance} />
      )}
    </div>
  )
}
