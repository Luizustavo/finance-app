import { createSafeActionClient } from "next-safe-action"
import { auth } from "@/lib/auth"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message)
    return e.message
  },
})

export const authActionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message)
    return e.message
  },
}).use(async ({ next }) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Não autenticado")
  }

  return next({ ctx: { userId: session.user.id } })
})
