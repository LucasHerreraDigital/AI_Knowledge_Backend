import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../config/prisma.js";

type CreateChatDTO = Prisma.ChatUncheckedCreateInput;

type UpdateChatDTO = Prisma.ChatUncheckedUpdateInput;

export class ChatRepository {
  async findByIdAndUser(id: string,userId:string) {
    return prisma.chat.findUnique({
      where: { 
        id,
        workspace:{
          userId
        }
       },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async searchChats(query: string, userId: string) {
    return await prisma.chat.findMany({
      where: {
        workspace: {
          userId,
        },

        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            workspace: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },

      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },

      take: 20,
    });
  }

  async findByIdWithWorkspace(id: string,userId:string) {
    return prisma.chat.findFirst({
      where: { 
        id,
        workspace:{
          userId
        }
       },
      include: {
        workspace: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async findByWorkspace(workspaceId: string) {
    return prisma.chat.findMany({
      where: {
        workspaceId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async create(data: CreateChatDTO) {
    return prisma.chat.create({
      data,
    });
  }

  async update(id: string, data: UpdateChatDTO, userId: string ) {
    return prisma.chat.update({
      where: { 
        id,
        workspace:{
          userId
        }
       },
      data,
    });
  }

  async delete(id: string, userId: string ) {
    return prisma.chat.delete({
      where: { 
        id,
        workspace:{
          userId
        }
       },
    });
  }
}
