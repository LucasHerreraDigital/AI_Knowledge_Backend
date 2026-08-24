import { EmbeddingService } from "../../embeddings/services/embedding.service.js";
import { AIService } from "../../ai/services/ai.service.js";
import { Message, MessageRole } from "../../../generated/prisma/client.js";

export class RAGService{
    private readonly embeddingService = new EmbeddingService()
    private readonly aiService = new AIService()

    async generateAnswer(workspaceId:string,question:string,history:Message[]){
        const chunks = await this.embeddingService.searchSimilar(workspaceId,question)
        console.log("Chunks encontrados:", chunks.length);
        console.log(chunks);
        const context = chunks.slice(0,5).map(chunk=>chunk.content).join("\n\n")
        const messages = [
            {
                role:MessageRole.system,
                content:
                `
                Responde usando únicamente la información del contexto.
                Si el contexto no contiene la respuesta,
                indicá que no encontraste información suficiente.
                Contexto:
                ${context}
                `
            },
            ...history.map(message=>({
                role:message.role,
                content:message.content
            })),
            {
                role:MessageRole.user,
                content: question
            }
        ]
        return this.aiService.generateAnswer(messages)
    }
}