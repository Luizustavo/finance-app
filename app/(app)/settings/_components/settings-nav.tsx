"use client"

import Link from "next/link"
import { User, Lock, Tag, Grid3X3, Wallet } from "lucide-react"

const links = [
  { label: "Perfil", href: "#profile", icon: User },
  { label: "Senha", href: "#password", icon: Lock },
  { label: "Contas", href: "/accounts", icon: Wallet },
  { label: "Categorias", href: "/categories", icon: Grid3X3 },
  { label: "Tags", href: "/tags", icon: Tag },
]

export function SettingsNav() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors hover:bg-accent"
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </div>
  )
}
