type EmbeddingResponse = {
  model: string;
  embedding: number[];
};

export class EmbeddingProvider {
  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    const response = await fetch(
      `${process.env.OLLAMA_URL}/api/embed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_EMBED_MODEL,
          input: text,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error generando embedding");
    }

    const data = await response.json() as {
      embeddings: number[][];
    };

    return {
      model: process.env.OLLAMA_EMBED_MODEL!,
      embedding:data.embeddings[0]
    };
  }
}