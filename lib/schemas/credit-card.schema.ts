import { z } from "zod"

// ─── Credit Card ────────────────────────────────────────
export const createCreditCardSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  creditLimit: z
    .string()
    .regex(/^\d+([.,]\d{1,2})?$/, "Valor inválido")
    .transform((v) => v.replace(",", "."))
    .optional()
    .or(z.literal("")),
  closingDay: z
    .number()
    .int()
    .min(1, "Dia deve ser entre 1 e 31")
    .max(31, "Dia deve ser entre 1 e 31"),
  dueDay: z
    .number()
    .int()
    .min(1, "Dia deve ser entre 1 e 31")
    .max(31, "Dia deve ser entre 1 e 31"),
})

export type CreateCreditCardInput = z.infer<typeof createCreditCardSchema>

export const updateCreditCardSchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  creditLimit: z
    .string()
    .regex(/^\d+([.,]\d{1,2})?$/, "Valor inválido")
    .transform((v) => v.replace(",", "."))
    .optional()
    .or(z.literal("")),
  closingDay: z
    .number()
    .int()
    .min(1, "Dia deve ser entre 1 e 31")
    .max(31, "Dia deve ser entre 1 e 31"),
  dueDay: z
    .number()
    .int()
    .min(1, "Dia deve ser entre 1 e 31")
    .max(31, "Dia deve ser entre 1 e 31"),
})

export type UpdateCreditCardInput = z.infer<typeof updateCreditCardSchema>

export const toggleCreditCardSchema = z.object({
  id: z.string().cuid(),
  isActive: z.boolean(),
})

export type ToggleCreditCardInput = z.infer<typeof toggleCreditCardSchema>
