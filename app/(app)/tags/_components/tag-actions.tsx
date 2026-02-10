"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  updateTagSchema,
  type UpdateTagInput,
} from "@/lib/schemas/tag.schema"
import { updateTagAction, deleteTagAction } from "../actions"

interface TagItem {
  id: string
  name: string
  color: string | null
  _count: { transactions: number }
}

interface TagActionsProps {
  tag: TagItem
}

export function TagActions({ tag }: TagActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateTagInput>({
    resolver: zodResolver(updateTagSchema),
    defaultValues: {
      id: tag.id,
      name: tag.name,
      color: tag.color ?? "",
    },
  })

  const onSubmit = async (data: UpdateTagInput) => {
    setLoading(true)
    try {
      const result = await updateTagAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Tag atualizada!")
      setEditOpen(false)
    } catch {
      toast.error("Erro ao atualizar tag")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteTagAction({ id: tag.id })
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Tag excluída")
      setDeleteOpen(false)
    } catch {
      toast.error("Erro ao excluir tag")
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tag</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />

            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Nome</Label>
              <Input id="edit-tag-name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tag-color">Cor</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="h-9 w-12 p-1"
                  defaultValue={tag.color ?? "#6366f1"}
                  onChange={(e) =>
                    setValue("color", e.target.value, { shouldValidate: true })
                  }
                />
                <Input
                  id="edit-tag-color"
                  {...register("color")}
                  className="flex-1"
                />
              </div>
              {errors.color && (
                <p className="text-sm text-destructive">
                  {errors.color.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir tag"
        description={
          tag._count.transactions > 0
            ? `Esta tag está associada a ${tag._count.transactions} transação(ões). A exclusão removerá a associação, mas não apagará as transações.`
            : "Tem certeza que deseja excluir esta tag?"
        }
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </>
  )
}
