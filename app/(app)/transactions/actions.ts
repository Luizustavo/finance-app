"use server"

import { prisma } from "@/lib/db/prisma"
import { authActionClient } from "@/lib/safe-action"
import {
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
  togglePaidSchema,
} from "@/lib/schemas/transaction.schema"
import { revalidatePath } from "next/cache"
import { Prisma } from "@/app/generated/prisma/client"

// ─── Create Transaction ─────────────────────────────────
export const createTransactionAction = authActionClient
  .schema(createTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      type,
      description,
      amount,
      date,
      categoryId,
      accountId,
      creditCardId,
      destinationAccountId,
      notes,
      tagIds,
    } = parsedInput

    const parsedAmount = new Prisma.Decimal(amount.replace(",", "."))
    const parsedDate = new Date(date)

    // Handle transfers: create 2 linked transactions
    if (type === "TRANSFER" && accountId && destinationAccountId) {
      const [outTx] = await prisma.$transaction([
        // Outgoing from source
        prisma.transaction.create({
          data: {
            userId: ctx.userId,
            type: "TRANSFER",
            description: `${description} (saída)`,
            amount: parsedAmount,
            date: parsedDate,
            categoryId,
            accountId,
            notes: notes || null,
          },
        }),
        // Incoming to destination
        prisma.transaction.create({
          data: {
            userId: ctx.userId,
            type: "TRANSFER",
            description: `${description} (entrada)`,
            amount: parsedAmount,
            date: parsedDate,
            categoryId,
            accountId: destinationAccountId,
            notes: notes || null,
          },
        }),
      ])

      // Add tags to outgoing transaction
      if (tagIds && tagIds.length > 0) {
        await prisma.transactionTag.createMany({
          data: tagIds.map((tagId) => ({
            transactionId: outTx.id,
            tagId,
          })),
        })
      }

      revalidatePath("/transactions")
      revalidatePath("/accounts")
      revalidatePath("/dashboard")
      return { success: true }
    }

    // Regular income/expense
    const tx = await prisma.transaction.create({
      data: {
        userId: ctx.userId,
        type,
        description,
        amount: parsedAmount,
        date: parsedDate,
        categoryId,
        accountId: accountId || null,
        creditCardId: creditCardId || null,
        notes: notes || null,
      },
    })

    // Attach tags
    if (tagIds && tagIds.length > 0) {
      await prisma.transactionTag.createMany({
        data: tagIds.map((tagId) => ({
          transactionId: tx.id,
          tagId,
        })),
      })
    }

    revalidatePath("/transactions")
    revalidatePath("/accounts")
    revalidatePath("/cards")
    revalidatePath("/dashboard")
    return { success: true }
  })

// ─── Update Transaction ─────────────────────────────────
export const updateTransactionAction = authActionClient
  .schema(updateTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      id,
      description,
      amount,
      date,
      categoryId,
      accountId,
      creditCardId,
      notes,
      tagIds,
    } = parsedInput

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: ctx.userId },
    })
    if (!existing) throw new Error("Transação não encontrada")

    const parsedAmount = new Prisma.Decimal(amount.replace(",", "."))
    const parsedDate = new Date(date)

    await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount: parsedAmount,
        date: parsedDate,
        categoryId,
        accountId: accountId || null,
        creditCardId: creditCardId || null,
        notes: notes || null,
      },
    })

    // Re-sync tags
    if (tagIds) {
      await prisma.transactionTag.deleteMany({
        where: { transactionId: id },
      })
      if (tagIds.length > 0) {
        await prisma.transactionTag.createMany({
          data: tagIds.map((tagId) => ({
            transactionId: id,
            tagId,
          })),
        })
      }
    }

    revalidatePath("/transactions")
    revalidatePath("/accounts")
    revalidatePath("/cards")
    revalidatePath("/dashboard")
    return { success: true }
  })

// ─── Delete Transaction ─────────────────────────────────
export const deleteTransactionAction = authActionClient
  .schema(deleteTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: ctx.userId },
    })
    if (!existing) throw new Error("Transação não encontrada")

    await prisma.transaction.delete({ where: { id } })

    revalidatePath("/transactions")
    revalidatePath("/accounts")
    revalidatePath("/cards")
    revalidatePath("/dashboard")
    return { success: true }
  })

// ─── Toggle Paid ────────────────────────────────────────
export const togglePaidAction = authActionClient
  .schema(togglePaidSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, isPaid } = parsedInput

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: ctx.userId },
    })
    if (!existing) throw new Error("Transação não encontrada")

    await prisma.transaction.update({
      where: { id },
      data: {
        isPaid,
        paidAt: isPaid ? new Date() : null,
      },
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { success: true }
  })
