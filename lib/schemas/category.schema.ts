import { z } from "zod"

// ─── Category ───────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  type: z.enum(["INCOME", "EXPENSE"], {
    error: "Selecione o tipo",
  }),
  parentId: z.string().cuid().optional().or(z.literal("")),
  icon: z.string().max(30).optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .optional()
    .or(z.literal("")),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  icon: z.string().max(30).optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .optional()
    .or(z.literal("")),
})

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

export const toggleCategorySchema = z.object({
  id: z.string().cuid(),
  isActive: z.boolean(),
})

export type ToggleCategoryInput = z.infer<typeof toggleCategorySchema>
