import { Metadata } from "next"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Entrar",
}

export default function LoginPage() {
  return <LoginForm />
}
