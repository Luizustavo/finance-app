import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { CardList } from "./_components/card-list"
import { CreateCardDialog } from "./_components/create-card-dialog"
import { formatCurrency } from "@/lib/utils"
import { CreditCard as CreditCardIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Cartões",
}

export default async function CardsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const creditCards = await prisma.creditCard.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      invoices: {
        where: { year: currentYear, month: currentMonth },
        select: { totalAmount: true, isPaid: true },
      },
      transactions: {
        where: {
          invoiceId: null,
          date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
        select: { amount: true },
      },
    },
  })

  const cardsWithInvoice = creditCards.map((card) => {
    const invoiceAmount = card.invoices[0]
      ? Number(card.invoices[0].totalAmount)
      : card.transactions.reduce((acc, t) => acc + Number(t.amount), 0)

    const isPaid = card.invoices[0]?.isPaid ?? false
    const limit = card.creditLimit ? Number(card.creditLimit) : null
    const usagePercent = limit ? Math.round((invoiceAmount / limit) * 100) : null

    return {
      id: card.id,
      name: card.name,
      creditLimit: limit,
      closingDay: card.closingDay,
      dueDay: card.dueDay,
      isActive: card.isActive,
      invoiceAmount,
      isPaid,
      usagePercent,
    }
  })

  const totalInvoices = cardsWithInvoice
    .filter((c) => c.isActive && !c.isPaid)
    .reduce((acc, c) => acc + c.invoiceAmount, 0)

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cartões</h1>
          {totalInvoices > 0 && (
            <p className="text-sm text-muted-foreground">
              Faturas abertas:{" "}
              <span className="text-red-500">
                {formatCurrency(totalInvoices)}
              </span>
            </p>
          )}
        </div>
        <CreateCardDialog />
      </div>

      {cardsWithInvoice.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <CreditCardIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhum cartão cadastrado
          </p>
          <p className="text-xs text-muted-foreground">
            Adicione seu primeiro cartão de crédito
          </p>
        </div>
      ) : (
        <CardList cards={cardsWithInvoice} />
      )}
    </div>
  )
}
