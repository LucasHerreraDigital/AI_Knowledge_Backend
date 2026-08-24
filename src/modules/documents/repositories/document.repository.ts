import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../config/prisma.js";

type CreateDocumentDTO = Prisma.DocumentUncheckedCreateInput;

type UpdateDocumentDTO = Prisma.DocumentUncheckedUpdateInput;

export class DocumentRepository {
  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
    });
  }

  async findByWorkspace(workspaceId: string) {
    return prisma.document.findMany({
      where: { workspaceId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateDocumentDTO) {
    return prisma.document.create({
      data,
    });
  }

  async update(id: string, data: UpdateDocumentDTO) {
    return prisma.document.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }

}