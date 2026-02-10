"use client"

import { getMonthName } from "@/lib/utils"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const now = new Date()
  const greeting = getGreeting()
  const firstName = userName.split(" ")[0]

  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground">
        {greeting}, {firstName}
      </p>
      <h1 className="text-2xl font-bold">
        {getMonthName(now.getMonth())} {now.getFullYear()}
      </h1>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}
