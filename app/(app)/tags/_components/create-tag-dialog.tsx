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
  createTagSchema,
  type CreateTagInput,
} from "@/lib/schemas/tag.schema"
import { createTagAction } from "../actions"

export function CreateTagDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTagInput>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
      color: "",
    },
  })

  const onSubmit = async (data: CreateTagInput) => {
    setLoading(true)
    try {
      const result = await createTagAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Tag criada!")
      reset()
      setOpen(false)
    } catch {
      toast.error("Erro ao criar tag")
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
          <DialogTitle>Nova Tag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Nome</Label>
            <Input
              id="tag-name"
              placeholder="Ex: Viagem, Fixo, Urgente"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-color">
              Cor <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="h-9 w-12 p-1"
                defaultValue="#6366f1"
                onChange={(e) =>
                  setValue("color", e.target.value, { shouldValidate: true })
                }
              />
              <Input
                id="tag-color"
                placeholder="#6366f1"
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
            Criar tag
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
