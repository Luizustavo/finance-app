import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { TransactionForm } from "./_components/transaction-form"

export const metadata: Metadata = {
  title: "Nova Transação",
}

export default async function NewTransactionPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [accounts, creditCards, categories, tags] = await Promise.all([
    prisma.account.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, type: true },
    }),
    prisma.creditCard.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, type: true, parentId: true, color: true },
    }),
    prisma.tag.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true },
    }),
  ])

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Nova Transação</h1>
      <TransactionForm
        accounts={accounts}
        creditCards={creditCards}
        categories={categories}
        tags={tags}
      />
    </div>
  )
}
