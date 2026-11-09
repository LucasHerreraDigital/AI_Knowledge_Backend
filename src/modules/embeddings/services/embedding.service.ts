import { EmbeddingProvider } from "../../ai/providers/embedding.provider.js";
import { EmbeddingRepository } from "../repositories/embedding.repository.js";


export class EmbeddingService{
    private readonly provider = new EmbeddingProvider()
    private readonly repository = new EmbeddingRepository()

    async createEmbedding(documentChunkId:string,text:string){
        const result = await this.provider.generateEmbedding(text)
        await this.repository.createEmbedding(
            documentChunkId,
            result.model,
            result.embedding
        )
    }

    async searchSimilar(workspaceId: string, text: string) {
        const embeddingStart = performance.now();

        const result = await this.provider.generateEmbedding(text);

        console.log(
            `Embedding: ${((performance.now() - embeddingStart) / 1000).toFixed(2)}s`
        );

        const databaseStart = performance.now();

        const chunks = await this.repository.searchSimilar(
            workspaceId,
            result.embedding
        );
        
        console.log(
            "Fuentes recuperadas:",
            chunks.map((chunk) => ({
                documento: chunk.documentName,
                pagina: chunk.pageNumber,
                chunk: chunk.chunkIndex,
                distancia: chunk.distance,
            }))
        );

        console.log("Pregunta:", text);
        console.log("Cantidad de chunks:", chunks.length);

        console.log(
            "Chunks recuperados:",
            chunks.map((chunk, index) => ({
                posicion: index + 1,
                distancia: chunk.distance,
                contenido: chunk.content.slice(0, 500),
            }))
        );
        

        console.log(
            `PostgreSQL: ${((performance.now() - databaseStart) / 1000).toFixed(2)}s`
        );

        return chunks;
    }
}