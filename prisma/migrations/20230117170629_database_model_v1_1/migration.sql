/*
  Warnings:

  - You are about to drop the column `tagCoverPhoto` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `tagPhoto` on the `tags` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(33)`.
  - Added the required column `isFavorited` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tags" DROP COLUMN "tagCoverPhoto",
DROP COLUMN "tagPhoto",
ADD COLUMN     "coverPhotoUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFavorited" BOOLEAN NOT NULL,
ADD COLUMN     "photoUrl" TEXT,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(33);
