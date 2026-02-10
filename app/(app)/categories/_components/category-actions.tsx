"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MoreVertical, Pencil, Power } from "lucide-react"
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
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "@/lib/schemas/category.schema"
import { updateCategoryAction, toggleCategoryAction } from "../actions"

interface CategoryBase {
  id: string
  name: string
  icon: string | null
  color: string | null
  isActive: boolean
}

interface CategoryActionsProps {
  category: CategoryBase
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      icon: category.icon ?? "",
      color: category.color ?? "",
    },
  })

  const onSubmit = async (data: UpdateCategoryInput) => {
    setLoading(true)
    try {
      const result = await updateCategoryAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Categoria atualizada!")
      setEditOpen(false)
    } catch {
      toast.error("Erro ao atualizar categoria")
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    setToggling(true)
    try {
      const result = await toggleCategoryAction({
        id: category.id,
        isActive: !category.isActive,
      })
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      const msg = category.isActive
        ? "Categoria desativada"
        : "Categoria reativada"
      toast.success(msg)
    } catch {
      toast.error("Erro ao alterar status")
    } finally {
      setToggling(false)
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
          <DropdownMenuItem onSelect={handleToggle} disabled={toggling}>
            <Power className="mr-2 h-4 w-4" />
            {category.isActive ? "Desativar" : "Reativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />

            <div className="space-y-2">
              <Label htmlFor="edit-cat-name">Nome</Label>
              <Input id="edit-cat-name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cat-icon">Ícone</Label>
                <Input id="edit-cat-icon" {...register("icon")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-color">Cor</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="h-9 w-12 p-1"
                    defaultValue={category.color ?? "#6366f1"}
                    onChange={(e) =>
                      setValue("color", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Input
                    id="edit-cat-color"
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
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
