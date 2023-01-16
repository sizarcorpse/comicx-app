/*
  Warnings:

  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('English', 'Japanese', 'Chinese');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('Appalling', 'Horrible', 'Bad', 'Average', 'Fine', 'Good', 'Awesome', 'Fastastic', 'Masterpiece');

-- DropTable
DROP TABLE "Artist";

-- CreateTable
CREATE TABLE "artists" (
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "profileCoverPhoto" TEXT,
    "isFavorite" BOOLEAN,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("artistId")
);

-- CreateTable
CREATE TABLE "albums" (
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "artistId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Untitled Album',
    "issue" INTEGER DEFAULT 1,
    "language" "Language" NOT NULL DEFAULT 'English',
    "pages" INTEGER,
    "isCencored" BOOLEAN NOT NULL DEFAULT false,
    "isFavorited" BOOLEAN NOT NULL,
    "rating" "Rating" NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("albumId")
);

-- CreateTable
CREATE TABLE "photos" (
    "photoId" TEXT NOT NULL,
    "albumId" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("photoId")
);

-- CreateTable
CREATE TABLE "tags" (
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "tagPhoto" TEXT,
    "tagCoverPhoto" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "TagsOnAlbum" (
    "albumId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnAlbum_pkey" PRIMARY KEY ("albumId","tagId")
);

-- CreateTable
CREATE TABLE "TagsOnArtist" (
    "artistId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnArtist_pkey" PRIMARY KEY ("artistId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_username_key" ON "artists"("username");

-- CreateIndex
CREATE INDEX "albums_title_issue_idx" ON "albums"("title", "issue" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "tags_title_key" ON "tags"("title");

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("albumId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnAlbum" ADD CONSTRAINT "TagsOnAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("albumId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnAlbum" ADD CONSTRAINT "TagsOnAlbum_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnArtist" ADD CONSTRAINT "TagsOnArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnArtist" ADD CONSTRAINT "TagsOnArtist_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;
