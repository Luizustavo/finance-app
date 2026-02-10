import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { TagList } from "./_components/tag-list"
import { CreateTagDialog } from "./_components/create-tag-dialog"
import { Tags as TagsIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Tags",
}

export default async function TagsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { transactions: true } },
    },
  })

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tags</h1>
        <CreateTagDialog />
      </div>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <TagsIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma tag cadastrada
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tags ajudam a organizar suas transações
          </p>
        </div>
      ) : (
        <TagList tags={tags} />
      )}
    </div>
  )
}
