"use server"

import { prisma } from "@/lib/db/prisma"
import { authActionClient } from "@/lib/safe-action"
import {
  createAccountSchema,
  updateAccountSchema,
  toggleAccountSchema,
} from "@/lib/schemas/account.schema"
import { revalidatePath } from "next/cache"

export const createAccountAction = authActionClient
  .schema(createAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, type, initialBalance } = parsedInput

    await prisma.account.create({
      data: {
        userId: ctx.userId,
        name,
        type,
        initialBalance: parseFloat(initialBalance),
      },
    })

    revalidatePath("/accounts")
    return { success: true }
  })

export const updateAccountAction = authActionClient
  .schema(updateAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, name, type } = parsedInput

    const account = await prisma.account.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!account) throw new Error("Conta não encontrada")

    await prisma.account.update({
      where: { id },
      data: { name, type },
    })

    revalidatePath("/accounts")
    return { success: true }
  })

export const toggleAccountAction = authActionClient
  .schema(toggleAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, isActive } = parsedInput

    const account = await prisma.account.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!account) throw new Error("Conta não encontrada")

    await prisma.account.update({
      where: { id },
      data: { isActive },
    })

    revalidatePath("/accounts")
    return { success: true }
  })
