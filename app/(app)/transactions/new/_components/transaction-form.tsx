"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  createTransactionSchema,
  type CreateTransactionInput,
} from "@/lib/schemas/transaction.schema"
import { createTransactionAction } from "@/app/(app)/transactions/actions"

type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER"

interface TransactionFormProps {
  accounts: { id: string; name: string; type: string }[]
  creditCards: { id: string; name: string }[]
  categories: {
    id: string
    name: string
    type: string
    parentId: string | null
    color: string | null
  }[]
  tags: { id: string; name: string; color: string | null }[]
  // For edit mode
  defaultValues?: CreateTransactionInput & { id?: string }
  mode?: "create" | "edit"
}

export function TransactionForm({
  accounts,
  creditCards,
  categories,
  tags,
  defaultValues,
  mode = "create",
}: TransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [txType, setTxType] = useState<TransactionType>(
    (defaultValues?.type as TransactionType) ?? "EXPENSE"
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultValues?.tagIds ?? []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: txType,
      description: defaultValues?.description ?? "",
      amount: defaultValues?.amount ?? "",
      date: defaultValues?.date ?? format(new Date(), "yyyy-MM-dd"),
      categoryId: defaultValues?.categoryId ?? "",
      accountId: defaultValues?.accountId ?? "",
      creditCardId: defaultValues?.creditCardId ?? "",
      destinationAccountId: defaultValues?.destinationAccountId ?? "",
      notes: defaultValues?.notes ?? "",
      tagIds: defaultValues?.tagIds ?? [],
    },
  })

  const watchAccountId = watch("accountId")
  const watchCreditCardId = watch("creditCardId")

  // Filter categories by type
  const filteredCategories = categories.filter((c) => {
    if (txType === "INCOME") return c.type === "INCOME"
    if (txType === "EXPENSE") return c.type === "EXPENSE"
    return true // TRANSFER shows all
  })

  // Group categories: parents then children
  const parentCategories = filteredCategories.filter((c) => !c.parentId)
  const childCategories = filteredCategories.filter((c) => c.parentId)

  const handleTypeChange = (type: TransactionType) => {
    setTxType(type)
    setValue("type", type, { shouldValidate: true })
    setValue("categoryId", "")
    setValue("creditCardId", "")
    if (type !== "EXPENSE") {
      setValue("creditCardId", "")
    }
    if (type === "TRANSFER") {
      setValue("creditCardId", "")
    }
  }

  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]
    setSelectedTags(updated)
    setValue("tagIds", updated)
  }

  const onSubmit = async (data: CreateTransactionInput) => {
    setLoading(true)
    try {
      const result = await createTransactionAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Transação criada!")
      reset()
      setSelectedTags([])
      router.push("/transactions")
    } catch {
      toast.error("Erro ao criar transação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Type selector */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("EXPENSE")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
            txType === "EXPENSE"
              ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
              : "hover:bg-muted"
          )}
        >
          <ArrowDownCircle className="h-5 w-5" />
          Despesa
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("INCOME")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
            txType === "INCOME"
              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "hover:bg-muted"
          )}
        >
          <ArrowUpCircle className="h-5 w-5" />
          Receita
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("TRANSFER")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors",
            txType === "TRANSFER"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
              : "hover:bg-muted"
          )}
        >
          <ArrowLeftRight className="h-5 w-5" />
          Transferência
        </button>
      </div>
      <input type="hidden" {...register("type")} />

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          inputMode="decimal"
          placeholder="0,00"
          className="text-2xl font-bold h-14"
          {...register("amount")}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Supermercado, Salário, PIX..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          onValueChange={(v) =>
            setValue("categoryId", v, { shouldValidate: true })
          }
          defaultValue={defaultValues?.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {parentCategories.map((cat) => {
              const children = childCategories.filter(
                (c) => c.parentId === cat.id
              )
              return (
                <div key={cat.id}>
                  <SelectItem value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: cat.color ?? "#6b7280",
                        }}
                      />
                      {cat.name}
                    </span>
                  </SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      <span className="flex items-center gap-2 pl-4">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              child.color ?? cat.color ?? "#6b7280",
                          }}
                        />
                        {child.name}
                      </span>
                    </SelectItem>
                  ))}
                </div>
              )
            })}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Account (income, expense, transfer source) */}
      {txType !== "EXPENSE" || !watchCreditCardId ? (
        <div className="space-y-2">
          <Label>
            {txType === "TRANSFER" ? "Conta de origem" : "Conta"}
          </Label>
          <Select
            onValueChange={(v) => {
              setValue("accountId", v, { shouldValidate: true })
              if (v) setValue("creditCardId", "")
            }}
            defaultValue={defaultValues?.accountId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a conta" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-destructive">
              {errors.accountId.message}
            </p>
          )}
        </div>
      ) : null}

      {/* Credit Card (expense only) */}
      {txType === "EXPENSE" && !watchAccountId && (
        <div className="space-y-2">
          <Label>Cartão de crédito</Label>
          <Select
            onValueChange={(v) => {
              setValue("creditCardId", v, { shouldValidate: true })
              if (v) setValue("accountId", "")
            }}
            defaultValue={defaultValues?.creditCardId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cartão" />
            </SelectTrigger>
            <SelectContent>
              {creditCards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Payment method toggle for EXPENSE */}
      {txType === "EXPENSE" && (
        <p className="text-xs text-muted-foreground -mt-3">
          {watchAccountId
            ? "Pagando com conta bancária"
            : watchCreditCardId
              ? "Pagando com cartão de crédito"
              : "Selecione conta ou cartão acima"}
          {(watchAccountId || watchCreditCardId) && (
            <button
              type="button"
              className="ml-2 text-primary underline"
              onClick={() => {
                setValue("accountId", "")
                setValue("creditCardId", "")
              }}
            >
              trocar
            </button>
          )}
        </p>
      )}

      {/* Destination account (transfer only) */}
      {txType === "TRANSFER" && (
        <div className="space-y-2">
          <Label>Conta de destino</Label>
          <Select
            onValueChange={(v) =>
              setValue("destinationAccountId", v, { shouldValidate: true })
            }
            defaultValue={defaultValues?.destinationAccountId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a conta destino" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.destinationAccountId && (
            <p className="text-sm text-destructive">
              {errors.destinationAccountId.message}
            </p>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <Label>
            Tags <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  selectedTags.includes(tag.id) ? "default" : "outline"
                }
                className="cursor-pointer transition-colors"
                style={
                  selectedTags.includes(tag.id)
                    ? { backgroundColor: tag.color ?? undefined }
                    : undefined
                }
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Observações{" "}
          <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Notas adicionais..."
          rows={2}
          {...register("notes")}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className={cn(
          "w-full",
          txType === "INCOME" && "bg-green-600 hover:bg-green-700",
          txType === "EXPENSE" && "bg-red-600 hover:bg-red-700",
          txType === "TRANSFER" && "bg-blue-600 hover:bg-blue-700"
        )}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "edit" ? "Salvar alterações" : "Criar transação"}
      </Button>
    </form>
  )
}
