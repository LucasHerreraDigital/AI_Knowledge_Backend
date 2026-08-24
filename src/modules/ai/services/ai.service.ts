import { MessageRole } from "../../../generated/prisma/client.js";
import { OllamaProvider } from "../providers/ollama.provider.js";

export type AIMessage = {
    role: MessageRole;
    content: string;
};


export class AIService {

    private readonly provider = new OllamaProvider();

    async generateAnswer(messages: AIMessage[]) {

        return this.provider.generateResponse([
            {
                role: MessageRole.system,
                content:"Eres un asistente útil que responde en español."
            },
            ...messages
        ]);

    }
}