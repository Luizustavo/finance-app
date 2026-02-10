import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-16">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  )
}
