import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../config/prisma.js";

type CreateDocumentChunkDTO = Prisma.DocumentChunkUncheckedCreateInput;

export class DocumentChunkRepository {

  async findById(id: string) {
    return prisma.documentChunk.findUnique({
      where: { id },
    });
  }

  async findByDocumentId(documentId: string) {
    return prisma.documentChunk.findMany({
      where: { documentId },
      orderBy: {
        chunkIndex: "asc",
      },
    });
  }

  async create(data: CreateDocumentChunkDTO) {
    return prisma.documentChunk.create({
      data,
    });
  }

  async createMany(data: Prisma.DocumentChunkCreateManyInput[]) {
    return prisma.documentChunk.createMany({
      data,
    });
  }

  async deleteByDocumentId(documentId: string) {
    return prisma.documentChunk.deleteMany({
      where: { documentId },
    });
  }

  async delete(id: string) {
    return prisma.documentChunk.delete({
      where: { id },
    });
  }
}