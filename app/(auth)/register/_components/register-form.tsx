"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSchema, type SignUpInput } from "@/lib/schemas/auth.schema"
import { signUpAction } from "../../actions"

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true)
    try {
      const result = await signUpAction(data)

      if (result?.serverError) {
        toast.error(result.serverError)
        return
      }

      toast.success("Conta criada com sucesso!")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Erro ao criar conta")
    } finally {
      setLoading(false)
    }
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
          Comece a controlar suas finanças
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/15 bg-white/10 p-8 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[#C2E5F2]">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-[#62ABD9] focus-visible:ring-[#62ABD9]/20"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#C2E5F2]">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-[#62ABD9] focus-visible:ring-[#62ABD9]/20"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#C2E5F2]">
              Confirmar senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              autoComplete="new-password"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-[#62ABD9] focus-visible:ring-[#62ABD9]/20"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#62ABD9] font-semibold text-white shadow-md transition-colors hover:bg-[#5299c4]"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[#A7D5F2]">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-white underline-offset-4 hover:underline"
        >
          Fazer login
        </Link>
      </p>
    </div>
  )
}
