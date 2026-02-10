"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface BalanceSummaryProps {
  totalBalance: number
  income: number
  expense: number
}

export function BalanceSummary({
  totalBalance,
  income,
  expense,
}: BalanceSummaryProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${totalBalance >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {formatCurrency(totalBalance)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Saldo de todas as contas
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-emerald-600">
              {formatCurrency(income)}
            </p>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(expense)}
            </p>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
