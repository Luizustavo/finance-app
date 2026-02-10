"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  updateTransactionSchema,
  type UpdateTransactionInput,
} from "@/lib/schemas/transaction.schema"
import {
  updateTransactionAction,
  deleteTransactionAction,
} from "../actions"

interface TransactionData {
  id: string
  type: "INCOME" | "EXPENSE" | "TRANSFER"
  description: string
  amount: string | number | { toString(): string }
  date: string | Date
  notes: string | null
  categoryId: string
  accountId: string | null
  creditCardId: string | null
}

interface TransactionActionsProps {
  transaction: TransactionData
}

export function TransactionActions({ transaction }: TransactionActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTransactionInput>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      id: transaction.id,
      description: transaction.description,
      amount: String(transaction.amount),
      date: format(new Date(transaction.date), "yyyy-MM-dd"),
      categoryId: transaction.categoryId,
      accountId: transaction.accountId ?? "",
      creditCardId: transaction.creditCardId ?? "",
      notes: transaction.notes ?? "",
      tagIds: [],
    },
  })

  const onSubmit = async (data: UpdateTransactionInput) => {
    setLoading(true)
    try {
      const result = await updateTransactionAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Transação atualizada!")
      setEditOpen(false)
      router.refresh()
    } catch {
      toast.error("Erro ao atualizar")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteTransactionAction({ id: transaction.id })
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Transação excluída")
      setDeleteOpen(false)
    } catch {
      toast.error("Erro ao excluir")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("categoryId")} />
            <input type="hidden" {...register("accountId")} />
            <input type="hidden" {...register("creditCardId")} />

            <div className="space-y-2">
              <Label htmlFor="edit-tx-desc">Descrição</Label>
              <Input id="edit-tx-desc" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tx-amount">Valor</Label>
                <Input
                  id="edit-tx-amount"
                  inputMode="decimal"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tx-date">Data</Label>
                <Input
                  id="edit-tx-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tx-notes">Observações</Label>
              <Textarea
                id="edit-tx-notes"
                rows={2}
                {...register("notes")}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir transação"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </>
  )
}
