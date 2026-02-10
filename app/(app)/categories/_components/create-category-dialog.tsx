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
  createCategorySchema,
  type CreateCategoryInput,
} from "@/lib/schemas/category.schema"
import { createCategoryAction } from "../actions"

interface ParentOption {
  id: string
  name: string
  type: string
}

interface CreateCategoryDialogProps {
  parentOptions: ParentOption[]
}

export function CreateCategoryDialog({
  parentOptions,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: undefined,
      parentId: "",
      icon: "",
      color: "",
    },
  })

  const filteredParents = parentOptions.filter(
    (p) => !selectedType || p.type === selectedType
  )

  const onSubmit = async (data: CreateCategoryInput) => {
    setLoading(true)
    try {
      const result = await createCategoryAction(data)
      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }
      toast.success("Categoria criada!")
      reset()
      setSelectedType("")
      setOpen(false)
    } catch {
      toast.error("Erro ao criar categoria")
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
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nome</Label>
            <Input
              id="cat-name"
              placeholder="Ex: Alimentação, Salário"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              onValueChange={(v) => {
                setValue("type", v as "INCOME" | "EXPENSE", {
                  shouldValidate: true,
                })
                setSelectedType(v)
                setValue("parentId", "")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
                <SelectItem value="INCOME">Receita</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Categoria pai{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Select
              onValueChange={(v) =>
                setValue("parentId", v === "none" ? "" : v, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Nenhuma (categoria raiz)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma (raiz)</SelectItem>
                {filteredParents.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-icon">
                Ícone <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="cat-icon"
                placeholder="Ex: home, car"
                {...register("icon")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-color">
                Cor <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cat-color"
                  type="color"
                  className="h-9 w-12 p-1"
                  defaultValue="#6366f1"
                  onChange={(e) =>
                    setValue("color", e.target.value, { shouldValidate: true })
                  }
                />
                <Input
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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar categoria
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
