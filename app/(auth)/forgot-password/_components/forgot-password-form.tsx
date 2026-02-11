"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas/auth.schema"
import { forgotPasswordAction } from "../../actions"

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true)
    try {
      const result = await forgotPasswordAction(data)

      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }

      setSent(true)
    } catch {
      toast.error("Erro ao processar solicitação")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#62ABD9] shadow-md">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">E-mail enviado</h1>
          <p className="mt-1 text-sm text-[#A7D5F2]">
            Se o e-mail informado estiver cadastrado, enviaremos um link para
            redefinir sua senha.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-8 shadow-xl backdrop-blur-md">
          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Branding */}
      <div className="flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/system/favicon.png"
          alt="Finx Control"
          className="mb-3 h-16 w-16 drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold tracking-wide text-white">FINX CONTROL</h1>
        <p className="mt-1 text-sm text-[#A7D5F2]">
          Informe seu e-mail para receber um link de redefinição
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/15 bg-white/10 p-8 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#C2E5F2]">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-[#62ABD9] focus-visible:ring-[#62ABD9]/20"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#62ABD9] font-semibold text-white shadow-md transition-colors hover:bg-[#5299c4]"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar link
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-[#A7D5F2] transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Voltar para login
        </Link>
      </div>
    </div>
  )
}
