"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { CategoryActions } from "./category-actions"

interface Child {
  id: string
  name: string
  icon: string | null
  color: string | null
  isActive: boolean
}

interface Category {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  icon: string | null
  color: string | null
  isActive: boolean
  children: Child[]
  _count: { transactions: number }
}

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}

function CategoryItem({ category }: { category: Category }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = category.children.length > 0

  return (
    <div>
      <Card className={cn(!category.isActive && "opacity-50")}>
        <CardContent className="flex items-center gap-3 py-3">
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 p-1"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: category.color ?? "#6b7280" }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{category.name}</p>
              {!category.isActive && (
                <Badge variant="secondary" className="text-xs">
                  Inativa
                </Badge>
              )}
            </div>
            {category._count.transactions > 0 && (
              <p className="text-xs text-muted-foreground">
                {category._count.transactions} transaç
                {category._count.transactions === 1 ? "ão" : "ões"}
              </p>
            )}
          </div>

          <CategoryActions
            category={{
              id: category.id,
              name: category.name,
              icon: category.icon,
              color: category.color,
              isActive: category.isActive,
            }}
          />
        </CardContent>
      </Card>

      {expanded && hasChildren && (
        <div className="ml-6 mt-1 space-y-1">
          {category.children.map((child) => (
            <Card
              key={child.id}
              className={cn(
                "border-l-2",
                !child.isActive && "opacity-50"
              )}
              style={{ borderLeftColor: child.color ?? "#6b7280" }}
            >
              <CardContent className="flex items-center gap-3 py-2">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: child.color ?? "#6b7280" }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{child.name}</p>
                </div>

                <CategoryActions
                  category={{
                    id: child.id,
                    name: child.name,
                    icon: child.icon,
                    color: child.color,
                    isActive: child.isActive,
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
