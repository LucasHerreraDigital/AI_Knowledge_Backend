import { prisma } from "../../../config/prisma.js";
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from "../schemas/workspace.schema.js";

export class WorkspaceRepository {
  async findAll() {
    return prisma.workspace.findMany({
      include: {
        _count: {
          select: {
            documents: true,
            chats: true,
          },
        },
      },
    });
  }

  async findAllByUser(userId: string) {
    return prisma.workspace.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            documents: true,
            chats: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByUserAndName(
    name: string,
    userId: string
  ) {
    return prisma.workspace.findFirst({
      where: {
        name,
        userId,
      },
    });
  }

  async findById(id: string) {
    return prisma.workspace.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            documents: true,
            chats: true,
          },
        },
      },
    });
  }

  async create(data: CreateWorkspaceDTO) {
    return prisma.workspace.create({
      data,
      include: {
        _count: {
          select: {
            documents: true,
            chats: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateWorkspaceDTO
  ) {
    return prisma.workspace.update({
      where: {
        id,
      },
      data,
      include: {
        _count: {
          select: {
            documents: true,
            chats: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.workspace.delete({
      where: {
        id,
      },
    });
  }
}