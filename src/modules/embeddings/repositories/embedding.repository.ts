import { prisma } from "../../../config/prisma.js";
import { createId } from "@paralleldrive/cuid2";

export type SimilarChunk = {
    id: string;
    content: string;
    distance: number;
};

export class EmbeddingRepository {
  async createEmbedding(documentChunkId: string,model: string,embedding: number[],) {
    const vector = `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "DocumentChunkEmbedding"
      ("id","documentChunkId","model","embedding")
      VALUES
      ($1, $2, $3, $4::vector)
      `,
      createId(),
      documentChunkId,
      model,
      vector,
    );
  }

  async searchSimilar(workspaceId:string,embedding:number[],limit = 5): Promise<SimilarChunk[]>{
    const vector = `[${embedding.join(",")}]`;
    return prisma.$queryRawUnsafe(
      `
      SELECT
        dc.id,
        dc.content,
        dce.embedding <=> $1::vector AS distance

      FROM "DocumentChunkEmbedding" dce

      JOIN "DocumentChunk" dc
        ON dc.id = dce."documentChunkId"

      JOIN "Document" d
        ON d.id = dc."documentId"

      WHERE d."workspaceId" = $2

      ORDER BY dce.embedding <=> $1::vector

      LIMIT $3;
      `,
      vector,
      workspaceId,
      limit
    );
  }
}
