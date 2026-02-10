"use server"

import { prisma } from "@/lib/db/prisma"
import { authActionClient } from "@/lib/safe-action"
import {
  createTagSchema,
  updateTagSchema,
  deleteTagSchema,
} from "@/lib/schemas/tag.schema"
import { revalidatePath } from "next/cache"

export const createTagAction = authActionClient
  .schema(createTagSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, color } = parsedInput

    const exists = await prisma.tag.findFirst({
      where: { userId: ctx.userId, name: { equals: name, mode: "insensitive" } },
    })
    if (exists) throw new Error("Já existe uma tag com este nome")

    await prisma.tag.create({
      data: {
        userId: ctx.userId,
        name,
        color: color || null,
      },
    })

    revalidatePath("/tags")
    return { success: true }
  })

export const updateTagAction = authActionClient
  .schema(updateTagSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, name, color } = parsedInput

    const tag = await prisma.tag.findFirst({
      where: { id, userId: ctx.userId },
    })
    if (!tag) throw new Error("Tag não encontrada")

    await prisma.tag.update({
      where: { id },
      data: {
        name,
        color: color || null,
      },
    })

    revalidatePath("/tags")
    return { success: true }
  })

export const deleteTagAction = authActionClient
  .schema(deleteTagSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput

    const tag = await prisma.tag.findFirst({
      where: { id, userId: ctx.userId },
    })
    if (!tag) throw new Error("Tag não encontrada")

    await prisma.tag.delete({ where: { id } })

    revalidatePath("/tags")
    return { success: true }
  })
