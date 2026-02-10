import { z } from "zod"

// ─── Create Transaction ─────────────────────────────────
export const createTransactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], {
      error: "Selecione o tipo",
    }),
    description: z
      .string()
      .min(2, "Descrição deve ter pelo menos 2 caracteres")
      .max(100, "Descrição muito longa"),
    amount: z
      .string()
      .min(1, "Informe o valor")
      .regex(/^\d+([.,]\d{1,2})?$/, "Valor inválido"),
    date: z.string().min(1, "Informe a data"),
    categoryId: z.string().min(1, "Selecione a categoria"),
    accountId: z.string().optional().or(z.literal("")),
    creditCardId: z.string().optional().or(z.literal("")),
    // Transfer: destination account
    destinationAccountId: z.string().optional().or(z.literal("")),
    notes: z.string().max(500).optional().or(z.literal("")),
    tagIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "TRANSFER") {
        return !!data.accountId && !!data.destinationAccountId
      }
      return !!data.accountId || !!data.creditCardId
    },
    {
      message: "Selecione uma conta ou cartão",
      path: ["accountId"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "TRANSFER") {
        return data.accountId !== data.destinationAccountId
      }
      return true
    },
    {
      message: "Conta de origem e destino devem ser diferentes",
      path: ["destinationAccountId"],
    }
  )

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

// ─── Update Transaction ─────────────────────────────────
export const updateTransactionSchema = z.object({
  id: z.string().cuid(),
  description: z
    .string()
    .min(2, "Descrição deve ter pelo menos 2 caracteres")
    .max(100, "Descrição muito longa"),
  amount: z
    .string()
    .min(1, "Informe o valor")
    .regex(/^\d+([.,]\d{1,2})?$/, "Valor inválido"),
  date: z.string().min(1, "Informe a data"),
  categoryId: z.string().min(1, "Selecione a categoria"),
  accountId: z.string().optional().or(z.literal("")),
  creditCardId: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  tagIds: z.array(z.string()).optional(),
})

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>

// ─── Delete Transaction ─────────────────────────────────
export const deleteTransactionSchema = z.object({
  id: z.string().cuid(),
})

export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>
