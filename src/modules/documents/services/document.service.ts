import { AppError } from "../../../shared/errors/AppError.js";
import { DocumentRepository } from "../repositories/document.repository.js";
import { WorkspaceRepository } from "../../workspaces/repositories/workspace.repository.js"; 
import {
  CreateDocumentDto,
  UpdateDocumentDTO,
} from "../schemas/document.schema.js";
import { PdfProcessor } from "../processors/pdf.processor.js";
import { TextChunker } from "../processors/text-chunker.js";
import { DocumentChunkRepository } from "../repositories/documentChunk.repository.js";
import { EmbeddingService } from "../../embeddings/services/embedding.service.js";
import fs from "fs/promises";

export class DocumentService {
  private readonly repository = new DocumentRepository();
  private readonly workspaceRepository = new WorkspaceRepository();
  private readonly pdfProcessor = new PdfProcessor();
  private readonly textChunker = new TextChunker();
  private readonly documentChunkRepository = new DocumentChunkRepository()
  private readonly embeddingService = new EmbeddingService();

  async getDocumentById(id: string, userId:string) {
    const document = await this.repository.findByIdAndUser(id,userId);

    if (!document) {
      throw new AppError(404, "Documento no encontrado");
    }

    return document;
  }

  async getDocumentsByWorkspace(workspaceId: string,userId:string) {
    return this.repository.findByWorkspace(workspaceId,userId);
  }

  async createDocument(data: CreateDocumentDto & {
    name: string;
    mimeType: string;
    extension: string;
    size: number;
    filePath: string;
  },userId:string) {
    const workspace = await this.workspaceRepository.findByIdAndUser(data.workspaceId,userId);

    if (!workspace) {
      throw new AppError(404, "Workspace no encontrado");
    }

    const document = await this.repository.create({
      ...data,
      processingStatus: "PENDING",
    });

    try {
      const extractedPages = await this.pdfProcessor.extractText(
        document.filePath
      );

      const extractedText = extractedPages
        .map((page) => page.content)
        .join("\n\n");

      const textChunked = this.textChunker.split(extractedPages);

      for (const chunkData of textChunked) {
        const chunk = await this.documentChunkRepository.create({
          documentId: document.id,
          content: chunkData.content,
          chunkIndex: chunkData.chunkIndex,
          pageNumber: chunkData.pageNumber,
        });

        await this.embeddingService.createEmbedding(
          chunk.id,
          chunk.content
        );
      }

      const updatedDocument = await this.repository.update(document.id, {
        extractedText,
        processingStatus: "COMPLETED",
      });

      return updatedDocument;
    } catch (error) {
      await this.repository.update(document.id, {
        processingStatus: "FAILED",
      });

      throw error;
    }
  }

  async updateDocument(id: string, data: UpdateDocumentDTO) {
    const document = await this.repository.findById(id);

    if (!document) {
      throw new AppError(404, "Documento no encontrado");
    }

    return this.repository.update(id, data);
  }

  async deleteDocument(id: string,userId:string) {
    const document = await this.repository.findByIdAndUser(id,userId);
  
    if (!document) {
      throw new AppError(404, "Documento no encontrado");
    }

    await fs.unlink(document.filePath)

    return this.repository.delete(id);
  }
}