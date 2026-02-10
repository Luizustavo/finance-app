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
  updateCreditCardSchema,
  type UpdateCreditCardInput,
} from "@/lib/schemas/credit-card.schema"
import { updateCreditCardAction, toggleCreditCardAction } from "../actions"

interface CreditCardItem {
  id: string
  name: string
  creditLimit: number | null
  closingDay: number
  dueDay: number
  isActive: boolean
}

interface CardActionsProps {
  card: CreditCardItem
}

export function CardActions({ card }: CardActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCreditCardInput>({
    resolver: zodResolver(updateCreditCardSchema),
    defaultValues: {
      id: card.id,
      name: card.name,
      creditLimit: card.creditLimit?.toString() ?? "",
      closingDay: card.closingDay,
      dueDay: card.dueDay,
    },
  })

  const onSubmit = async (data: UpdateCreditCardInput) => {
    setLoading(true)
    try {
      const result = await updateCreditCardAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Cartão atualizado!")
      setEditOpen(false)
    } catch {
      toast.error("Erro ao atualizar cartão")
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    setToggling(true)
    try {
      const result = await toggleCreditCardAction({
        id: card.id,
        isActive: !card.isActive,
      })
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success(
        card.isActive ? "Cartão desativado" : "Cartão reativado"
      )
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
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleToggle} disabled={toggling}>
            <Power className="mr-2 h-4 w-4" />
            {card.isActive ? "Desativar" : "Reativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cartão</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />

            <div className="space-y-2">
              <Label htmlFor="edit-card-name">Nome</Label>
              <Input id="edit-card-name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-creditLimit">Limite</Label>
              <Input
                id="edit-creditLimit"
                inputMode="decimal"
                {...register("creditLimit")}
              />
              {errors.creditLimit && (
                <p className="text-sm text-destructive">
                  {errors.creditLimit.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-closingDay">Dia fechamento</Label>
                <Input
                  id="edit-closingDay"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={31}
                  {...register("closingDay", { valueAsNumber: true })}
                />
                {errors.closingDay && (
                  <p className="text-sm text-destructive">
                    {errors.closingDay.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDay">Dia vencimento</Label>
                <Input
                  id="edit-dueDay"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={31}
                  {...register("dueDay", { valueAsNumber: true })}
                />
                {errors.dueDay && (
                  <p className="text-sm text-destructive">
                    {errors.dueDay.message}
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
