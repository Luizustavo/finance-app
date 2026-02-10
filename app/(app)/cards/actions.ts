"use server"

import { prisma } from "@/lib/db/prisma"
import { authActionClient } from "@/lib/safe-action"
import {
  createCreditCardSchema,
  updateCreditCardSchema,
  toggleCreditCardSchema,
} from "@/lib/schemas/credit-card.schema"
import { revalidatePath } from "next/cache"

export const createCreditCardAction = authActionClient
  .schema(createCreditCardSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, creditLimit, closingDay, dueDay } = parsedInput

    await prisma.creditCard.create({
      data: {
        userId: ctx.userId,
        name,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        closingDay,
        dueDay,
      },
    })

    revalidatePath("/cards")
    return { success: true }
  })

export const updateCreditCardAction = authActionClient
  .schema(updateCreditCardSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, name, creditLimit, closingDay, dueDay } = parsedInput

    const card = await prisma.creditCard.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!card) throw new Error("Cartão não encontrado")

    await prisma.creditCard.update({
      where: { id },
      data: {
        name,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        closingDay,
        dueDay,
      },
    })

    revalidatePath("/cards")
    return { success: true }
  })

export const toggleCreditCardAction = authActionClient
  .schema(toggleCreditCardSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, isActive } = parsedInput

    const card = await prisma.creditCard.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!card) throw new Error("Cartão não encontrado")

    await prisma.creditCard.update({
      where: { id },
      data: { isActive },
    })

    revalidatePath("/cards")
    return { success: true }
  })
