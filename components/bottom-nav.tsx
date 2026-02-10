"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, Plus, CreditCard, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Início",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transações",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Novo",
    href: "/transactions/new",
    icon: Plus,
    isCenter: true,
  },
  {
    label: "Cartões",
    href: "/cards",
    icon: CreditCard,
  },
  {
    label: "Menu",
    href: "/settings",
    icon: Menu,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex -mt-4 h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
              >
                <item.icon className="h-6 w-6" />
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      {/* Safe area for iPhone home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
