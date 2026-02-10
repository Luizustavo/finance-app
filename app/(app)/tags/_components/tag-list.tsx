"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TagActions } from "./tag-actions"

interface TagItem {
  id: string
  name: string
  color: string | null
  _count: { transactions: number }
}

interface TagListProps {
  tags: TagItem[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <Card key={tag.id}>
          <CardContent className="flex items-center gap-3 py-3">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: tag.color ?? "#6b7280" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tag.name}</p>
              {tag._count.transactions > 0 && (
                <p className="text-xs text-muted-foreground">
                  {tag._count.transactions} transação(ões)
                </p>
              )}
            </div>
            <TagActions tag={tag} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
