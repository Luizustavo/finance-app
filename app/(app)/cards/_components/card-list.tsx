"use client"

import { formatCurrency, cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard as CreditCardIcon } from "lucide-react"
import { CardActions } from "./card-actions"

interface CreditCardItem {
  id: string
  name: string
  creditLimit: number | null
  closingDay: number
  dueDay: number
  isActive: boolean
  invoiceAmount: number
  isPaid: boolean
  usagePercent: number | null
}

interface CardListProps {
  cards: CreditCardItem[]
}

export function CardList({ cards }: CardListProps) {
  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <Card
          key={card.id}
          className={cn(!card.isActive && "opacity-50")}
        >
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                <CreditCardIcon className="h-5 w-5 text-violet-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{card.name}</p>
                  {!card.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inativo
                    </Badge>
                  )}
                  {card.isPaid && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500 text-emerald-500 text-xs"
                    >
                      Paga
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fecha dia {card.closingDay} · Vence dia {card.dueDay}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold tabular-nums text-red-500">
                  {formatCurrency(card.invoiceAmount)}
                </p>
                {card.creditLimit && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    de {formatCurrency(card.creditLimit)}
                  </p>
                )}
              </div>

              <CardActions card={card} />
            </div>

            {card.usagePercent !== null && (
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      card.usagePercent < 70
                        ? "bg-emerald-500"
                        : card.usagePercent < 90
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    )}
                    style={{
                      width: `${Math.min(card.usagePercent, 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
                  {card.usagePercent}% utilizado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
