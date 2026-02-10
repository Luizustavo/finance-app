import { z } from "zod"

// ─── Tag ────────────────────────────────────────────────
export const createTagSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(30, "Nome muito longo"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .optional()
    .or(z.literal("")),
})

export type CreateTagInput = z.infer<typeof createTagSchema>

export const updateTagSchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(30, "Nome muito longo"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .optional()
    .or(z.literal("")),
})

export type UpdateTagInput = z.infer<typeof updateTagSchema>

export const deleteTagSchema = z.object({
  id: z.string().cuid(),
})

export type DeleteTagInput = z.infer<typeof deleteTagSchema>
