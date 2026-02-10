"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface FilterOption {
  id: string
  name: string
  type?: string
}

interface TransactionFiltersProps {
  accounts: FilterOption[]
  creditCards: FilterOption[]
  categories: FilterOption[]
  tags: FilterOption[]
  currentFilters: Record<string, string | undefined>
  month: number
  year: number
}

export function TransactionFilters({
  accounts,
  creditCards,
  categories,
  tags,
  currentFilters,
  month,
  year,
}: TransactionFiltersProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(currentFilters.q ?? "")
  const [open, setOpen] = useState(false)

  const activeFilterCount = [
    currentFilters.type,
    currentFilters.categoryId,
    currentFilters.accountId,
    currentFilters.creditCardId,
    currentFilters.tagId,
    currentFilters.status,
  ].filter(Boolean).length

  const buildUrl = (filters: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    params.set("month", String(month))
    params.set("year", String(year))
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    return `/transactions?${params.toString()}`
  }

  const handleSearch = () => {
    const url = buildUrl({ ...currentFilters, q: searchQuery || undefined })
    router.push(url)
  }

  const handleFilter = (key: string, value: string | undefined) => {
    const newFilters = { ...currentFilters, [key]: value || undefined }
    router.push(buildUrl(newFilters))
    setOpen(false)
  }

  const clearAllFilters = () => {
    router.push(`/transactions?month=${month}&year=${year}`)
    setSearchQuery("")
    setOpen(false)
  }

  return (
    <div className="mt-4 space-y-2">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscar transações..."
            className="pl-9"
          />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4 pb-6">
              {/* Type filter */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={currentFilters.type ?? "all"}
                  onValueChange={(v) =>
                    handleFilter("type", v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="INCOME">Receitas</SelectItem>
                    <SelectItem value="EXPENSE">Despesas</SelectItem>
                    <SelectItem value="TRANSFER">Transferências</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={currentFilters.status ?? "all"}
                  onValueChange={(v) =>
                    handleFilter("status", v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="paid">Pagos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category filter */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={currentFilters.categoryId ?? "all"}
                  onValueChange={(v) =>
                    handleFilter("categoryId", v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account filter */}
              <div className="space-y-2">
                <Label>Conta</Label>
                <Select
                  value={currentFilters.accountId ?? "all"}
                  onValueChange={(v) =>
                    handleFilter("accountId", v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Credit Card filter */}
              <div className="space-y-2">
                <Label>Cartão</Label>
                <Select
                  value={currentFilters.creditCardId ?? "all"}
                  onValueChange={(v) =>
                    handleFilter("creditCardId", v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {creditCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag filter */}
              {tags.length > 0 && (
                <div className="space-y-2">
                  <Label>Tag</Label>
                  <Select
                    value={currentFilters.tagId ?? "all"}
                    onValueChange={(v) =>
                      handleFilter("tagId", v === "all" ? undefined : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Clear button */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearAllFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {currentFilters.type && (
            <Badge variant="secondary" className="text-xs">
              {currentFilters.type === "INCOME"
                ? "Receitas"
                : currentFilters.type === "EXPENSE"
                  ? "Despesas"
                  : "Transferências"}
              <button
                className="ml-1"
                onClick={() => handleFilter("type", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.categoryId && (
            <Badge variant="secondary" className="text-xs">
              {categories.find((c) => c.id === currentFilters.categoryId)?.name}
              <button
                className="ml-1"
                onClick={() => handleFilter("categoryId", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.accountId && (
            <Badge variant="secondary" className="text-xs">
              {accounts.find((a) => a.id === currentFilters.accountId)?.name}
              <button
                className="ml-1"
                onClick={() => handleFilter("accountId", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.creditCardId && (
            <Badge variant="secondary" className="text-xs">
              {
                creditCards.find((c) => c.id === currentFilters.creditCardId)
                  ?.name
              }
              <button
                className="ml-1"
                onClick={() => handleFilter("creditCardId", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.tagId && (
            <Badge variant="secondary" className="text-xs">
              {tags.find((t) => t.id === currentFilters.tagId)?.name}
              <button
                className="ml-1"
                onClick={() => handleFilter("tagId", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.status && (
            <Badge variant="secondary" className="text-xs">
              {currentFilters.status === "paid" ? "Pagos" : "Pendentes"}
              <button
                className="ml-1"
                onClick={() => handleFilter("status", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
