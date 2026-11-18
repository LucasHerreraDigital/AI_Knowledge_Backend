-- CreateTable
CREATE TABLE "MessageSource" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "documentChunkId" TEXT,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "pageNumber" INTEGER,
    "chunkIndex" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MessageSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessageSource_messageId_idx" ON "MessageSource"("messageId");

-- CreateIndex
CREATE INDEX "MessageSource_documentChunkId_idx" ON "MessageSource"("documentChunkId");

-- AddForeignKey
ALTER TABLE "MessageSource" ADD CONSTRAINT "MessageSource_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageSource" ADD CONSTRAINT "MessageSource_documentChunkId_fkey" FOREIGN KEY ("documentChunkId") REFERENCES "DocumentChunk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
