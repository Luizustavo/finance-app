-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paid_at" TIMESTAMP(3);
