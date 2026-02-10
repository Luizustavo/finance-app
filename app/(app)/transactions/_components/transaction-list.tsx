"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn, formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransactionActions } from "./transaction-actions"
import { togglePaidAction } from "../actions"
import { toast } from "sonner"
import { Check } from "lucide-react"

interface TransactionItem {
  id: string
  type: "INCOME" | "EXPENSE" | "TRANSFER"
  description: string
  amount: string | number | { toString(): string }
  date: string | Date
  notes: string | null
  isPaid: boolean
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
  const [isPending, startTransition] = useTransition()
  const [optimisticPaid, setOptimisticPaid] = useState(tx.isPaid)

  const handleTogglePaid = () => {
    const newValue = !optimisticPaid
    setOptimisticPaid(newValue)
    startTransition(async () => {
      const result = await togglePaidAction({ id: tx.id, isPaid: newValue })
      if (!result?.data?.success) {
        setOptimisticPaid(!newValue)
        toast.error("Erro ao atualizar status")
      }
    })
  }

  return (
    <Card className={cn(optimisticPaid && "opacity-60")}>
      <CardContent className="flex items-center gap-3 py-3">
        <button
          type="button"
          onClick={handleTogglePaid}
          disabled={isPending}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            optimisticPaid
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-muted-foreground/30 hover:border-muted-foreground/60"
          )}
          aria-label={optimisticPaid ? "Marcar como pendente" : "Marcar como pago"}
        >
          {optimisticPaid && <Check className="h-3 w-3" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: tx.category.color ?? "#6b7280" }}
            />
            <p className={cn("text-sm font-medium truncate", optimisticPaid && "line-through text-muted-foreground")}>
              {tx.description}
            </p>
          </div>
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
