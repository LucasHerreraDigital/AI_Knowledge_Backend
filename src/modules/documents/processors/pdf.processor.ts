import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export interface ExtractedPage {
  pageNumber: number;
  content: string;
}

export class PdfProcessor {
  async extractText(filePath: string): Promise<ExtractedPage[]> {
    const buffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result = await parser.getText();

      const regex = /--\s*(\d+)\s+of\s+\d+\s*--/g;

      const extractedPages: ExtractedPage[] = [];

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let currentPage = 1;

      while ((match = regex.exec(result.text)) !== null) {
        const content = result.text
          .slice(lastIndex, match.index)
          .trim();

        if (content) {
          extractedPages.push({
            pageNumber: currentPage,
            content,
          });
        }

        currentPage = Number(match[1]) + 1;
        lastIndex = regex.lastIndex;
      }

      // Recuperar el contenido posterior al último marcador.
      const remainingContent = result.text.slice(lastIndex).trim();

      if (remainingContent) {
        extractedPages.push({
          pageNumber: currentPage,
          content: remainingContent,
        });
      }

      return extractedPages;
    } finally {
      await parser.destroy();
    }
  }
}