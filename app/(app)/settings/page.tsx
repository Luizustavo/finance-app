import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { ProfileForm } from "./_components/profile-form"
import { ChangePasswordForm } from "./_components/change-password-form"
import { LogoutButton } from "./_components/logout-button"
import { SettingsNav } from "./_components/settings-nav"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Configurações",
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phoneWhatsapp: true,
    },
  })

  if (!user) redirect("/login")

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Configurações</h1>

      <SettingsNav />

      <div className="mt-6 space-y-8">
        <section id="profile">
          <h2 className="mb-4 text-lg font-semibold">Perfil</h2>
          <ProfileForm
            defaultValues={{
              name: user.name,
              phoneWhatsapp: user.phoneWhatsapp ?? "",
            }}
            email={user.email}
          />
        </section>

        <Separator />

        <section id="password">
          <h2 className="mb-4 text-lg font-semibold">Alterar senha</h2>
          <ChangePasswordForm />
        </section>

        <Separator />

        <section id="logout">
          <LogoutButton />
        </section>
      </div>
    </div>
  )
}
