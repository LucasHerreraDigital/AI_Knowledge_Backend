/*
  Warnings:

  - You are about to drop the column `estadoProcesamiento` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `rutaArchivo` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `tamaño` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `textoExtraido` on the `Document` table. All the data in the column will be lost.
  - Added the required column `filePath` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "estadoProcesamiento",
DROP COLUMN "rutaArchivo",
DROP COLUMN "tamaño",
DROP COLUMN "textoExtraido",
ADD COLUMN     "extractedText" TEXT,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "size" INTEGER NOT NULL;
