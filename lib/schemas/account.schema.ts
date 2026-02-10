import { z } from "zod"

// ─── Account ────────────────────────────────────────────
export const createAccountSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  type: z.enum(["CHECKING", "INVESTMENT"], {
    error: "Selecione o tipo da conta",
  }),
  initialBalance: z
    .string()
    .regex(/^-?\d+([.,]\d{1,2})?$/, "Valor inválido")
    .transform((v) => v.replace(",", ".")),
})

export type CreateAccountInput = z.infer<typeof createAccountSchema>

export const updateAccountSchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  type: z.enum(["CHECKING", "INVESTMENT"], {
    error: "Selecione o tipo da conta",
  }),
})

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>

export const toggleAccountSchema = z.object({
  id: z.string().cuid(),
  isActive: z.boolean(),
})

export type ToggleAccountInput = z.infer<typeof toggleAccountSchema>
