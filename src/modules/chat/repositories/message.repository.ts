import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../config/prisma.js";

type CreateMessageDTO = Prisma.MessageUncheckedCreateInput

export class MessageRepository{
    async createMessage(data: CreateMessageDTO){
        return prisma.message.create({
            data,
        })
    }

    async findByChat(chatId: string){
        return prisma.message.findMany({
            where: {
                chatId: chatId
            },
            orderBy:{
                createdAt: "asc"
            }
        })
    }

    async findLastMessages(chatId: string){
        const messages = await prisma.message.findMany({
            where: {
                chatId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 20
        })

        return messages.reverse()
    }
}