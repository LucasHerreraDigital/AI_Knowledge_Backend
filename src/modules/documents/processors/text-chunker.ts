import type { ExtractedPage } from "./pdf.processor.js";

export interface DocumentChunkData {
  content: string;
  chunkIndex: number;
  pageNumber: number;
}

export class TextChunker {
  split(
    pages: ExtractedPage[],
    chunkSize = 1000,
    overlap = 200
  ): DocumentChunkData[] {
    const chunks: DocumentChunkData[] = [];

    let globalIndex = 0;

    for (const page of pages) {
      const text = page.content;
      let start = 0;

      while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);

        chunks.push({
          content: text.slice(start, end),
          chunkIndex: globalIndex++,
          pageNumber: page.pageNumber,
        });

        if (end === text.length) break;

        start = end - overlap;
      }
    }

    return chunks;
  }
}