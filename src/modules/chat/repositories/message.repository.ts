import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../config/prisma.js";

type CreateMessageDTO = Prisma.MessageUncheckedCreateInput
type RagSourceDTO = {
    id: string,
    content:string,
    distance: number,
    documentId: string,
    documentName:string,
    pageNumber: number | null,
    chunkIndex:number,
}

export class MessageRepository{
    async createMessage(data: CreateMessageDTO){
        return prisma.message.create({
            data,
        })
    }
    
    async createMessageWithSources(data:CreateMessageDTO,sources:RagSourceDTO[]){
        return prisma.message.create({
            data:{
              ...data,
              sources:{
                    create:sources.map(source=>{
                        return{
                            documentChunkId:source.id,
                            content: source.content,
                            documentId: source.documentId,
                            documentName: source.documentName,
                            pageNumber: source.pageNumber,
                            chunkIndex: source.chunkIndex,
                            distance: source.distance
                        }
                    })
                  }
            }
            
        })
    }

    async findByChat(chatId: string){
        return prisma.message.findMany({
            where: {
                chatId: chatId
            },include:{
                sources:true
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