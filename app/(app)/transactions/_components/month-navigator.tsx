"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MonthNavigatorProps {
  month: number
  year: number
  label: string
}

export function MonthNavigator({ month, year, label }: MonthNavigatorProps) {
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/transactions?month=${prevMonth}&year=${prevYear}`}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
      </Button>
      <h1 className="text-lg font-semibold capitalize">{label}</h1>
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/transactions?month=${nextMonth}&year=${nextYear}`}>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  )
}
