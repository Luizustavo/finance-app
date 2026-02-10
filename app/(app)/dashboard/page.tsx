import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "./_components/dashboard-header"
import { BalanceSummary } from "./_components/balance-summary"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="px-4 py-6">
      <DashboardHeader userName={session.user.name ?? "Usuário"} />
      <BalanceSummary />
    </div>
  )
}
