import { z } from "zod"

// ─── Sign Up ────────────────────────────────────────────
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome muito longo"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(72, "Senha muito longa"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

// ─── Sign In ────────────────────────────────────────────
export const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export type SignInInput = z.infer<typeof signInSchema>

// ─── Forgot Password ───────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// ─── Reset Password ────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(72, "Senha muito longa"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Senhas não coincidem",
    path: ["confirmNewPassword"],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

// ─── Update Profile ────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  phoneWhatsapp: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Número inválido. Ex: +5511999999999")
    .or(z.literal(""))
    .optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ─── Change Password ───────────────────────────────────
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "Nova senha deve ter pelo menos 8 caracteres")
      .max(72, "Senha muito longa"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Senhas não coincidem",
    path: ["confirmNewPassword"],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
