import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { CategoryList } from "./_components/category-list"
import { CreateCategoryDialog } from "./_components/create-category-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid3X3 } from "lucide-react"

export const metadata: Metadata = {
  title: "Categorias",
}

export default async function CategoriesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id, parentId: null },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      children: {
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
      },
      _count: { select: { transactions: true } },
    },
  })

  const incomeCategories = categories.filter((c) => c.type === "INCOME")
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE")

  // All parent categories for select (to create subcategories)
  const parentOptions = categories
    .filter((c) => c.isActive)
    .map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
    }))

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <CreateCategoryDialog parentOptions={parentOptions} />
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Grid3X3 className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma categoria cadastrada
          </p>
        </div>
      ) : (
        <Tabs defaultValue="expense">
          <TabsList className="w-full">
            <TabsTrigger value="expense" className="flex-1">
              Despesas ({expenseCategories.length})
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1">
              Receitas ({incomeCategories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="mt-4">
            <CategoryList categories={expenseCategories} />
          </TabsContent>

          <TabsContent value="income" className="mt-4">
            <CategoryList categories={incomeCategories} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
