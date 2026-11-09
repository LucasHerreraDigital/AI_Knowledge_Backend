import { AppError } from "../../../shared/errors/AppError.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import { MessageRepository } from "../repositories/message.repository.js";
import { WorkspaceRepository } from "../../workspaces/repositories/workspace.repository.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { AIService } from "../../ai/services/ai.service.js";
import { RAGService } from "../../rag/services/rag.services.js";

type CreateChatDTO = Prisma.ChatUncheckedCreateInput;
type UpdateChatDTO = {title?:string};
type CreateMessageDTO = {chatId:string, content: string};

export class ChatService {
  private readonly repository = new ChatRepository();
  private readonly messageRepository = new MessageRepository();
  private readonly workspaceRepository = new WorkspaceRepository();
  private readonly ragService = new RAGService()

  async searchChats(query:string,userId:string){
    if(query.length<2){
      return []
    }
    return await this.repository.searchChats(query, userId)
  }

  async getChatById(id: string,userId:string) {
    const chat = await this.repository.findByIdAndUser(id,userId);
    if (!chat) {
      throw new AppError(404, "No existen chats con esa id");
    }
    return chat;
  }

  async getChatByIdWithWorkspace(id: string,userId:string) {
    const chat = await this.repository.findByIdWithWorkspace(id,userId);
    if (!chat) {
      throw new AppError(404, "No existen chats con esa id");
    }
    return chat;
  }

  async getChatsByWorkspace(workspaceId: string, userId: string) {
    const workspace = await this.workspaceRepository.findByIdAndUser(workspaceId,userId);

    if (!workspace) {
      throw new AppError(404, "No existe un workspace con esa id");
    }

    if (workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }
    return this.repository.findByWorkspace(workspaceId);
  }

  async createChat(data: {title:string}, userId: string,workspaceId:string) {
    const workspace = await this.workspaceRepository.findByIdAndUser(workspaceId,userId);

    if (!workspace) {
      throw new AppError(404, "No existe un workspace con esa id");
    }

    return this.repository.create({
      title:data.title,
      workspaceId: workspace.id
    });
  }

  async updateChat(id: string, userId: string, data: UpdateChatDTO) {
    return this.repository.update(id, {
      title: data.title
    },userId);
  }

  async deleteChat(id: string, userId: string) {
    await this.repository.delete(id,userId);
  }

  async createMessage(data: CreateMessageDTO, userId: string) {
    const chat = await this.getChatByIdWithWorkspace(data.chatId,userId);
 
    const userMessage = await this.messageRepository.createMessage({
      chatId:data.chatId,
      content:data.content,
      role:"user"
    });
    const history = await this.messageRepository.findLastMessages(data.chatId);
    const aiResponse = await this.ragService.generateAnswer(
      chat.workspaceId,
      data.content,
      history
    )
    await this.messageRepository.createMessage({
        chatId: data.chatId,
        role: "assistant",
        content: aiResponse.content,
        tokens: aiResponse.tokens,
        model: aiResponse.model,
    });

    const updatedChat = await this.getChatById(data.chatId,userId)

    return{
      chat: updatedChat,
      sources: aiResponse.sources
    }
  }

  async getMessagesByChat(chatId: string, userId: string) {
    const chat = await this.getChatByIdWithWorkspace(chatId,userId);
    
    return this.messageRepository.findByChat(chatId);
  }
}
