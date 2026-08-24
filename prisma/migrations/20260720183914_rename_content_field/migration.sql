/*
  Warnings:

  - You are about to drop the column `conten` on the `DocumentChunk` table. All the data in the column will be lost.
  - Added the required column `content` to the `DocumentChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentChunk" DROP COLUMN "conten",
ADD COLUMN     "content" TEXT NOT NULL;
