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

    async searchSimilar(workspaceId:string,text:string){
        const result = await this.provider.generateEmbedding(text)
        return this.repository.searchSimilar(workspaceId,result.embedding)
    }
}