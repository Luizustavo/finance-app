"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn, formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransactionActions } from "./transaction-actions"

interface TransactionItem {
  id: string
  type: "INCOME" | "EXPENSE" | "TRANSFER"
  description: string
  amount: string | number | { toString(): string }
  date: string | Date
  notes: string | null
  categoryId: string
  accountId: string | null
  creditCardId: string | null
  category: { id: string; name: string; color: string | null }
  account: { id: string; name: string } | null
  creditCard: { id: string; name: string } | null
  tags: { tag: { id: string; name: string; color: string | null } }[]
}

interface TransactionListProps {
  transactions: TransactionItem[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  // Group by date
  const grouped = transactions.reduce(
    (acc, tx) => {
      const dateKey = format(new Date(tx.date), "yyyy-MM-dd")
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(tx)
      return acc
    },
    {} as Record<string, TransactionItem[]>
  )

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="mt-4 space-y-4">
      {sortedDates.map((dateKey) => {
        const dayTransactions = grouped[dateKey]
        const dateObj = new Date(dateKey + "T12:00:00")
        const dayLabel = format(dateObj, "dd 'de' MMMM", { locale: ptBR })
        const weekDay = format(dateObj, "EEEE", { locale: ptBR })

        return (
          <div key={dateKey}>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-sm font-medium capitalize">{dayLabel}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {weekDay}
              </p>
            </div>
            <div className="space-y-2">
              {dayTransactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TransactionCard({ transaction: tx }: { transaction: TransactionItem }) {
  const amount = Number(tx.amount)

  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3">
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: tx.category.color ?? "#6b7280" }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{tx.description}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs text-muted-foreground">
              {tx.category.name}
            </p>
            {tx.account && (
              <p className="text-xs text-muted-foreground">
                · {tx.account.name}
              </p>
            )}
            {tx.creditCard && (
              <p className="text-xs text-muted-foreground">
                · {tx.creditCard.name}
              </p>
            )}
          </div>
          {tx.tags.length > 0 && (
            <div className="mt-1 flex gap-1 flex-wrap">
              {tx.tags.map(({ tag }) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                  style={
                    tag.color
                      ? { backgroundColor: tag.color, color: "#fff" }
                      : undefined
                  }
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p
            className={cn(
              "text-sm font-semibold",
              tx.type === "INCOME" && "text-green-600",
              tx.type === "EXPENSE" && "text-red-600",
              tx.type === "TRANSFER" && "text-blue-600"
            )}
          >
            {tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : ""}
            {formatCurrency(amount)}
          </p>
        </div>
        <TransactionActions transaction={tx} />
      </CardContent>
    </Card>
  )
}
