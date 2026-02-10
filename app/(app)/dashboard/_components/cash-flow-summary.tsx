"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CashFlowSummaryProps {
  totalBalance: number
  totalIncome: number
  receivedIncome: number
  totalExpense: number
  paidExpense: number
}

export function CashFlowSummary({
  totalBalance,
  totalIncome,
  receivedIncome,
  totalExpense,
  paidExpense,
}: CashFlowSummaryProps) {
  const pendingIncome = totalIncome - receivedIncome
  const pendingExpense = totalExpense - paidExpense
  const projectedBalance = totalIncome - totalExpense
  const actualBalance = receivedIncome - paidExpense
  const incomeCoversExpenses = totalIncome >= totalExpense

  const incomeProgress =
    totalIncome > 0 ? Math.round((receivedIncome / totalIncome) * 100) : 0
  const expenseProgress =
    totalExpense > 0 ? Math.round((paidExpense / totalExpense) * 100) : 0

  return (
    <div className="grid gap-3">
      {/* Saldo previsto vs atual */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Saldo Previsto
              </p>
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p
              className={cn(
                "mt-1 text-lg font-bold",
                projectedBalance >= 0 ? "text-emerald-600" : "text-red-600"
              )}
            >
              {formatCurrency(projectedBalance)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Receitas − Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Saldo Atual
              </p>
              <CircleDollarSign className="h-3.5 w-3.5 text-primary" />
            </div>
            <p
              className={cn(
                "mt-1 text-lg font-bold",
                actualBalance >= 0 ? "text-emerald-600" : "text-red-600"
              )}
            >
              {formatCurrency(actualBalance)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Recebido − Pago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert if income doesn't cover expenses */}
      {!incomeCoversExpenses && totalExpense > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-700 dark:text-red-300">
            Despesas previstas excedem receitas em{" "}
            <strong>{formatCurrency(totalExpense - totalIncome)}</strong>
          </p>
        </div>
      )}

      {/* Receitas: previsto → recebido → a receber */}
      <Card>
        <CardContent className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-medium">Receitas</p>
            </div>
            <p className="text-sm font-semibold text-emerald-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${incomeProgress}%` }}
            />
          </div>

          <div className="mt-1.5 flex justify-between text-[10px]">
            <span className="text-emerald-600">
              Recebido: {formatCurrency(receivedIncome)}
            </span>
            <span className="text-muted-foreground">
              A receber: {formatCurrency(pendingIncome)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Despesas: previsto → pago → a pagar */}
      <Card>
        <CardContent className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm font-medium">Despesas</p>
            </div>
            <p className="text-sm font-semibold text-red-600">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{ width: `${expenseProgress}%` }}
            />
          </div>

          <div className="mt-1.5 flex justify-between text-[10px]">
            <span className="text-red-600">
              Pago: {formatCurrency(paidExpense)}
            </span>
            <span className="text-muted-foreground">
              A pagar: {formatCurrency(pendingExpense)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
