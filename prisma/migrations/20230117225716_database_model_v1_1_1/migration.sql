-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "isFavorited" DROP NOT NULL,
ALTER COLUMN "isFavorited" SET DEFAULT false;
