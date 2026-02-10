"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/schemas/auth.schema"
import { updateProfileAction } from "../actions"

interface ProfileFormProps {
  defaultValues: UpdateProfileInput
  email: string
}

export function ProfileForm({ defaultValues, email }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  })

  const onSubmit = async (data: UpdateProfileInput) => {
    setLoading(true)
    try {
      const result = await updateProfileAction(data)

      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }

      toast.success("Perfil atualizado!")
    } catch {
      toast.error("Erro ao atualizar perfil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              O e-mail não pode ser alterado
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneWhatsapp">WhatsApp</Label>
            <Input
              id="phoneWhatsapp"
              placeholder="+5511999999999"
              {...register("phoneWhatsapp")}
            />
            {errors.phoneWhatsapp && (
              <p className="text-sm text-destructive">
                {errors.phoneWhatsapp.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Para receber alertas de orçamento via WhatsApp
            </p>
          </div>

          <Button type="submit" disabled={loading || !isDirty}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar alterações
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
