-- Habilitar pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "DocumentChunkEmbedding" (
    "id" TEXT NOT NULL,
    "documentChunkId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentChunkEmbedding_pkey" PRIMARY KEY ("id")
);

-- Agregar la columna vector
ALTER TABLE "DocumentChunkEmbedding"
ADD COLUMN "embedding" vector(768);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentChunkEmbedding_documentChunkId_key"
ON "DocumentChunkEmbedding"("documentChunkId");

-- AddForeignKey
ALTER TABLE "DocumentChunkEmbedding"
ADD CONSTRAINT "DocumentChunkEmbedding_documentChunkId_fkey"
FOREIGN KEY ("documentChunkId")
REFERENCES "DocumentChunk"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;