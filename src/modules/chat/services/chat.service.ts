import { AppError } from "../../../shared/errors/AppError.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import { MessageRepository } from "../repositories/message.repository.js";
import { WorkspaceRepository } from "../../workspaces/repositories/workspace.repository.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { AIService } from "../../ai/services/ai.service.js";
import { RAGService } from "../../rag/services/rag.services.js";

type CreateChatDTO = Prisma.ChatUncheckedCreateInput;
type UpdateChatDTO = Prisma.ChatUncheckedUpdateInput;
type CreateMessageDTO = Prisma.MessageUncheckedCreateInput;

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

  async getChatById(id: string) {
    const chat = await this.repository.findById(id);
    if (!chat) {
      throw new AppError(404, "No existen chats con esa id");
    }
    return chat;
  }

  async getChatByIdWithWorkspace(id: string) {
    const chat = await this.repository.findByIdWithWorkspace(id);
    if (!chat) {
      throw new AppError(404, "No existen chats con esa id");
    }
    return chat;
  }

  async getChatsByWorkspace(workspaceId: string, userId: string) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError(404, "No existe un workspace con esa id");
    }

    if (workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }
    return this.repository.findByWorkspace(workspaceId);
  }

  async createChat(data: CreateChatDTO, userId: string) {
    const workspace = await this.workspaceRepository.findById(data.workspaceId);

    if (!workspace) {
      throw new AppError(404, "No existe un workspace con esa id");
    }

    if (workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }

    return this.repository.create(data);
  }

  async updateChat(id: string, userId: string, data: UpdateChatDTO) {
    const chat = await this.getChatByIdWithWorkspace(id);
    if (chat.workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }
    return this.repository.update(id, data);
  }

  async deleteChat(id: string, userId: string) {
    const chat = await this.getChatByIdWithWorkspace(id);

    if (chat.workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }
    await this.repository.delete(id);
  }

  async createMessage(data: CreateMessageDTO, userId: string) {
    const chat = await this.getChatByIdWithWorkspace(data.chatId);
    if (chat.workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }
    const userMessage = await this.messageRepository.createMessage(data);
    const history = await this.messageRepository.findLastMessages(data.chatId);
    const context = await this.ragService.generateAnswer
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

    return this.getChatById(data.chatId);
  }

  async getMessagesByChat(chatId: string, userId: string) {
    const chat = await this.getChatByIdWithWorkspace(chatId);
    if (chat.workspace.userId !== userId) {
      throw new AppError(403, "No autorizado");
    }
    return this.messageRepository.findByChat(chatId);
  }
}
