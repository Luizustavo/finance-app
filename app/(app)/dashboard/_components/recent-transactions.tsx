"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeftRight } from "lucide-react"

interface RecentTransaction {
  id: string
  type: "INCOME" | "EXPENSE" | "TRANSFER"
  description: string
  amount: number
  date: string
  category: { id: string; name: string; color: string | null }
  account: { id: string; name: string } | null
  creditCard: { id: string; name: string } | null
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card className="mt-4 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <ArrowLeftRight className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma transação registrada ainda
          </p>
          <Link
            href="/transactions/new"
            className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Adicionar transação
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Últimas transações
        </h2>
        <Link
          href="/transactions"
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </div>
      <div className="grid gap-2">
        {transactions.map((tx) => (
          <Card key={tx.id} className="py-3">
            <CardContent className="flex items-center justify-between px-4 py-0">
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tx.category.color ?? "#6b7280" }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.category.name}
                    {tx.account && ` · ${tx.account.name}`}
                    {tx.creditCard && ` · ${tx.creditCard.name}`}
                  </p>
                </div>
              </div>
              <div className="ml-2 text-right">
                <p
                  className={`text-sm font-semibold whitespace-nowrap ${
                    tx.type === "INCOME"
                      ? "text-emerald-600"
                      : tx.type === "EXPENSE"
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                >
                  {tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : ""}
                  {formatCurrency(tx.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(tx.date)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
