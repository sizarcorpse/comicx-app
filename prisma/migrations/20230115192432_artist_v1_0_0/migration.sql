-- CreateTable
CREATE TABLE "Artist" (
    "artist_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_url" TEXT,
    "cover_url" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("artist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_username_key" ON "Artist"("username");
