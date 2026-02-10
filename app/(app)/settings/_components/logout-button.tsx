"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/(auth)/actions"

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" className="w-full text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Sair da conta
      </Button>
    </form>
  )
}
