"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"
import { authActionClient } from "@/lib/safe-action"
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/schemas/auth.schema"
import { revalidatePath } from "next/cache"

export const updateProfileAction = authActionClient
  .schema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name, phoneWhatsapp } = parsedInput

    await prisma.user.update({
      where: { id: ctx.userId },
      data: {
        name,
        phoneWhatsapp: phoneWhatsapp || null,
      },
    })

    revalidatePath("/settings")
    return { success: true }
  })

export const changePasswordAction = authActionClient
  .schema(changePasswordSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { currentPassword, newPassword } = parsedInput

    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
    })

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)

    if (!isValid) {
      throw new Error("Senha atual incorreta")
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: ctx.userId },
      data: { passwordHash },
    })

    return { success: true }
  })
