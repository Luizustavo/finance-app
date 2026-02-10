"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createCreditCardSchema,
  type CreateCreditCardInput,
} from "@/lib/schemas/credit-card.schema"
import { createCreditCardAction } from "../actions"

export function CreateCardDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCreditCardInput>({
    resolver: zodResolver(createCreditCardSchema),
    defaultValues: {
      name: "",
      creditLimit: "",
      closingDay: undefined,
      dueDay: undefined,
    },
  })

  const onSubmit = async (data: CreateCreditCardInput) => {
    setLoading(true)
    try {
      const result = await createCreditCardAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Cartão criado com sucesso!")
      reset()
      setOpen(false)
    } catch {
      toast.error("Erro ao criar cartão")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Novo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">Nome</Label>
            <Input
              id="card-name"
              placeholder="Ex: Nubank, Inter, Leroy"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">
              Limite <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="creditLimit"
              inputMode="decimal"
              placeholder="5000,00"
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
              <Label htmlFor="closingDay">Dia de fechamento</Label>
              <Input
                id="closingDay"
                type="number"
                inputMode="numeric"
                min={1}
                max={31}
                placeholder="Ex: 15"
                {...register("closingDay", { valueAsNumber: true })}
              />
              {errors.closingDay && (
                <p className="text-sm text-destructive">
                  {errors.closingDay.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDay">Dia de vencimento</Label>
              <Input
                id="dueDay"
                type="number"
                inputMode="numeric"
                min={1}
                max={31}
                placeholder="Ex: 25"
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
            Criar cartão
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
