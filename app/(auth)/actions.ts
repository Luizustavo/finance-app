"use server"

import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { actionClient } from "@/lib/safe-action"
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
} from "@/lib/schemas/auth.schema"
import { redirect } from "next/navigation"
import { seedCategoriesForUser } from "@/prisma/seed"

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const { name, email, password } = parsedInput

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("Este e-mail já está cadastrado")
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    // Seed default categories for the new user
    await seedCategoriesForUser(user.id)

    // Sign in the user after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  })

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      return { success: true }
    } catch {
      throw new Error("E-mail ou senha inválidos")
    }
  })

export const signOutAction = async () => {
  await signOut({ redirect: false })
  redirect("/login")
}

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput

    // Check if user exists (don't reveal if they don't)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (user) {
      // TODO: Send password reset email
      console.log(`Password reset requested for: ${email}`)
    }

    return {
      success: true,
      message: "Se o e-mail existir, enviaremos um link de redefinição.",
    }
  })
