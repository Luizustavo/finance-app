"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Landmark, Wallet, PiggyBank, TrendingUp } from "lucide-react"

interface AccountBalance {
  id: string
  name: string
  type: string
  balance: number
}

interface AccountBalancesProps {
  accounts: AccountBalance[]
}

const ACCOUNT_ICONS: Record<string, typeof Wallet> = {
  CHECKING: Wallet,
  SAVINGS: PiggyBank,
  INVESTMENT: TrendingUp,
  CASH: Landmark,
}

export function AccountBalances({ accounts }: AccountBalancesProps) {
  if (accounts.length === 0) {
    return (
      <Card className="mt-4 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <Wallet className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Cadastre suas contas para acompanhar os saldos
          </p>
          <Link
            href="/accounts"
            className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Adicionar conta
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Contas</h2>
        <Link
          href="/accounts"
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </div>
      <div className="grid gap-2">
        {accounts.map((account) => {
          const Icon = ACCOUNT_ICONS[account.type] ?? Wallet
          return (
            <Card key={account.id} className="py-3">
              <CardContent className="flex items-center justify-between px-4 py-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">{account.name}</span>
                </div>
                <span
                  className={`text-sm font-semibold ${account.balance >= 0 ? "text-emerald-500" : "text-red-500"}`}
                >
                  {formatCurrency(account.balance)}
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
