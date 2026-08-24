import { MessageRole } from "../../../generated/prisma/client.js";

export type OllamaMessage = {
    role: MessageRole;
    content: string;
};

type OllamaChatResponse = {
  model: string;
  message: {
    role: "assistant";
    content: string;
  };
  prompt_eval_count?: number;
  eval_count?: number;
};

export class OllamaProvider {

    async generateResponse(messages: OllamaMessage[]) {

        const response = await fetch(
            `${process.env.OLLAMA_URL}/api/chat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: process.env.OLLAMA_MODEL,
                    messages,
                    stream: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Error comunicando con Ollama");
        }

        const data: OllamaChatResponse = await response.json();

        return {
            content: data.message.content,
            model: process.env.OLLAMA_MODEL,
            tokens: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0)
        };
    }
}