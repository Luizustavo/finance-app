"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInInput } from "@/lib/schemas/auth.schema";
import { signInAction } from "../../actions";
import Image from "next/image";
import logo from "@/public/system/favicon.png";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setLoading(true);
    try {
      const result = await signInAction(data);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Branding */}
      <div className="flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={logo}
          alt="Finx Control"
          className="mb-3 drop-shadow-lg"
          width={150}
          height={150}
        />
        <h1 className="text-2xl font-bold tracking-wide text-white">
          FINX CONTROL
        </h1>
        <p className="mt-1 text-sm text-[#A7D5F2]">
          Entre na sua conta para continuar
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/15 bg-white/10 p-8 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-[#C2E5F2]"
            >
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#C2E5F2]"
              >
                Senha
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#A7D5F2] transition-colors hover:text-white"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-[#62ABD9] focus-visible:ring-[#62ABD9]/20"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#62ABD9] font-semibold text-white shadow-md transition-colors hover:bg-[#5299c4]"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[#A7D5F2]">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="font-semibold text-white underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
