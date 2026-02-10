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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createAccountSchema,
  type CreateAccountInput,
} from "@/lib/schemas/account.schema"
import { createAccountAction } from "../actions"

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      type: undefined,
      initialBalance: "0",
    },
  })

  const onSubmit = async (data: CreateAccountInput) => {
    setLoading(true)
    try {
      const result = await createAccountAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Conta criada com sucesso!")
      reset()
      setOpen(false)
    } catch {
      toast.error("Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Nova
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Nubank, Inter, Caixa"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              onValueChange={(v) =>
                setValue("type", v as "CHECKING" | "INVESTMENT", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHECKING">Corrente</SelectItem>
                <SelectItem value="INVESTMENT">Investimento</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialBalance">Saldo inicial</Label>
            <Input
              id="initialBalance"
              inputMode="decimal"
              placeholder="0,00"
              {...register("initialBalance")}
            />
            {errors.initialBalance && (
              <p className="text-sm text-destructive">
                {errors.initialBalance.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Pode ser negativo. Use vírgula ou ponto para centavos.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
