"use client"

import { formatCurrency, cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Landmark, TrendingUp } from "lucide-react"
import { AccountActions } from "./account-actions"

interface Account {
  id: string
  name: string
  type: "CHECKING" | "INVESTMENT"
  initialBalance: number
  balance: number
  isActive: boolean
}

interface AccountListProps {
  accounts: Account[]
}

const typeLabels: Record<string, string> = {
  CHECKING: "Corrente",
  INVESTMENT: "Investimento",
}

const typeIcons: Record<string, React.ElementType> = {
  CHECKING: Landmark,
  INVESTMENT: TrendingUp,
}

export function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="space-y-3">
      {accounts.map((account) => {
        const Icon = typeIcons[account.type] ?? Landmark
        return (
          <Card
            key={account.id}
            className={cn(!account.isActive && "opacity-50")}
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{account.name}</p>
                  {!account.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inativa
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {typeLabels[account.type]}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold tabular-nums",
                    account.balance >= 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  )}
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>

              <AccountActions account={account} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
