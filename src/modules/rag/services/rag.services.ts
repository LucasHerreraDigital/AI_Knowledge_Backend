import { EmbeddingService } from "../../embeddings/services/embedding.service.js";
import { AIService } from "../../ai/services/ai.service.js";
import { Message, MessageRole } from "../../../generated/prisma/client.js";

export class RAGService{
    private readonly embeddingService = new EmbeddingService()
    private readonly aiService = new AIService()

    async generateAnswer(
        workspaceId: string,
        question: string,
        history: Message[]
        ) {
        const startSearch = performance.now();

        const chunks = await this.embeddingService.searchSimilar(
            workspaceId,
            question
        );

        console.log(
            `Búsqueda RAG: ${((performance.now() - startSearch) / 1000).toFixed(2)}s`
        );

        const sources = chunks.slice(0,5)

        const context = sources
            .map(chunk => chunk.content)
            .join("\n\n");

        const messages = [
            {
            role: MessageRole.system,
            content: `
                Responde usando únicamente la información del contexto.
                Si el contexto no contiene la respuesta,
                indicá que no encontraste información suficiente.

                Contexto:
                ${context}
            `
            },
            ...history.map(message => ({
            role: message.role,
            content: message.content
            }))
        ];

        const startGeneration = performance.now();

        const response = await this.aiService.generateAnswer(messages);

        console.log(
            `Generación IA: ${((performance.now() - startGeneration) / 1000).toFixed(2)}s`
        );

        return {...response,sources};
    }
}