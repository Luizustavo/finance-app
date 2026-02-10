"use server"

import { prisma } from "@/lib/db/prisma"
import { authActionClient } from "@/lib/safe-action"
import {
  createCategorySchema,
  updateCategorySchema,
  toggleCategorySchema,
} from "@/lib/schemas/category.schema"
import { revalidatePath } from "next/cache"

export const createCategoryAction = authActionClient
  .schema(createCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, type, parentId, icon, color } = parsedInput

    // If creating a subcategory, inherit type from parent
    if (parentId) {
      const parent = await prisma.category.findFirst({
        where: { id: parentId, userId: ctx.userId },
      })
      if (!parent) throw new Error("Categoria pai não encontrada")
    }

    await prisma.category.create({
      data: {
        userId: ctx.userId,
        name,
        type,
        parentId: parentId || null,
        icon: icon || null,
        color: color || null,
      },
    })

    revalidatePath("/categories")
    revalidatePath("/settings")
    return { success: true }
  })

export const updateCategoryAction = authActionClient
  .schema(updateCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, name, icon, color } = parsedInput

    const category = await prisma.category.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!category) throw new Error("Categoria não encontrada")

    await prisma.category.update({
      where: { id },
      data: {
        name,
        icon: icon || null,
        color: color || null,
      },
    })

    revalidatePath("/categories")
    revalidatePath("/settings")
    return { success: true }
  })

export const toggleCategoryAction = authActionClient
  .schema(toggleCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, isActive } = parsedInput

    const category = await prisma.category.findFirst({
      where: { id, userId: ctx.userId },
      include: { _count: { select: { transactions: true } } },
    })

    if (!category) throw new Error("Categoria não encontrada")

    // Also toggle children if deactivating a parent
    if (!isActive) {
      await prisma.category.updateMany({
        where: { parentId: id, userId: ctx.userId },
        data: { isActive: false },
      })
    }

    await prisma.category.update({
      where: { id },
      data: { isActive },
    })

    revalidatePath("/categories")
    revalidatePath("/settings")
    return { success: true }
  })
