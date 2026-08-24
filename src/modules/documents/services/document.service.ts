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

  async getDocumentById(id: string) {
    const document = await this.repository.findById(id);

    if (!document) {
      throw new AppError(404, "Documento no encontrado");
    }

    return document;
  }

  async getDocumentsByWorkspace(workspaceId: string) {
    return this.repository.findByWorkspace(workspaceId);
  }

  async createDocument(data: CreateDocumentDto & {
    name: string;
    mimeType: string;
    extension: string;
    size: number;
    filePath: string;
  }) {
    const workspace = await this.workspaceRepository.findById(data.workspaceId);

    if (!workspace) {
      throw new AppError(404, "Workspace no encontrado");
    }

    const document = await this.repository.create({
      ...data,
      processingStatus: "PENDING",
    });

    try {
      const extractedText = await this.pdfProcessor.extractText(
        document.filePath
      );

      const textChunked = this.textChunker.split(extractedText)

      for (let i = 0; i < textChunked.length; i++) {
        const chunk = await this.documentChunkRepository.create({
          documentId: document.id,
          content: textChunked[i],
          chunkIndex: i,
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

  async deleteDocument(id: string) {
    const document = await this.repository.findById(id);
  
    if (!document) {
      throw new AppError(404, "Documento no encontrado");
    }

    await fs.unlink(document.filePath)

    return this.repository.delete(id);
  }
}