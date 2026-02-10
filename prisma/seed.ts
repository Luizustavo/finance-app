import { PrismaClient, CategoryType } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

interface CategorySeed {
  name: string
  type: CategoryType
  icon: string
  color: string
  children?: { name: string; icon: string }[]
}

const defaultCategories: CategorySeed[] = [
  // INCOME
  { name: "Salário", type: "INCOME", icon: "banknote", color: "#22c55e" },
  { name: "Freelance", type: "INCOME", icon: "briefcase", color: "#10b981" },
  { name: "Outros Recebimentos", type: "INCOME", icon: "plus-circle", color: "#6366f1" },

  // EXPENSE
  {
    name: "Moradia",
    type: "EXPENSE",
    icon: "home",
    color: "#f59e0b",
    children: [
      { name: "Financiamento", icon: "landmark" },
      { name: "Condomínio", icon: "building-2" },
      { name: "Internet", icon: "wifi" },
      { name: "Garagem", icon: "car" },
    ],
  },
  {
    name: "Transporte",
    type: "EXPENSE",
    icon: "car",
    color: "#ef4444",
    children: [
      { name: "Gasolina", icon: "fuel" },
      { name: "IPVA", icon: "file-text" },
    ],
  },
  {
    name: "Pessoal",
    type: "EXPENSE",
    icon: "user",
    color: "#8b5cf6",
    children: [
      { name: "Barbeiro", icon: "scissors" },
      { name: "Celular", icon: "smartphone" },
    ],
  },
  {
    name: "Família",
    type: "EXPENSE",
    icon: "heart",
    color: "#ec4899",
    children: [{ name: "Pix Mãe", icon: "send" }],
  },
  {
    name: "Impostos",
    type: "EXPENSE",
    icon: "receipt",
    color: "#f97316",
    children: [{ name: "DAS", icon: "file-text" }],
  },
  {
    name: "Cartão de Crédito",
    type: "EXPENSE",
    icon: "credit-card",
    color: "#06b6d4",
    children: [
      { name: "Nubank", icon: "credit-card" },
      { name: "Inter", icon: "credit-card" },
      { name: "Leroy", icon: "credit-card" },
    ],
  },
  {
    name: "Alimentação",
    type: "EXPENSE",
    icon: "utensils",
    color: "#84cc16",
  },
  {
    name: "Saúde",
    type: "EXPENSE",
    icon: "heart-pulse",
    color: "#14b8a6",
  },
  {
    name: "Lazer",
    type: "EXPENSE",
    icon: "gamepad-2",
    color: "#a855f7",
  },
  {
    name: "Outros",
    type: "EXPENSE",
    icon: "more-horizontal",
    color: "#94a3b8",
  },
]

async function seedCategoriesForUser(userId: string) {
  for (const cat of defaultCategories) {
    const parent = await prisma.category.create({
      data: {
        userId,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
      },
    })

    if (cat.children) {
      for (const child of cat.children) {
        await prisma.category.create({
          data: {
            userId,
            parentId: parent.id,
            name: child.name,
            type: cat.type,
            icon: child.icon,
            color: cat.color,
          },
        })
      }
    }
  }
}

async function main() {
  console.log("🌱 Seeding database...")

  // Seed categories for all existing users
  const users = await prisma.user.findMany()

  if (users.length === 0) {
    console.log("No users found. Categories will be seeded when a user registers.")
  }

  for (const user of users) {
    const existingCategories = await prisma.category.count({
      where: { userId: user.id },
    })

    if (existingCategories === 0) {
      console.log(`Seeding categories for user: ${user.name}`)
      await seedCategoriesForUser(user.id)
    } else {
      console.log(`User ${user.name} already has categories, skipping.`)
    }
  }

  console.log("✅ Seed complete!")
}

export { seedCategoriesForUser }

// Only run main() when executed directly (e.g., `npx prisma db seed`)
// Not when imported by other modules (e.g., auth signUp action)
const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1]?.includes("seed")

if (isDirectRun) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
