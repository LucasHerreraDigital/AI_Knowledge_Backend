import path from "path";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { DocumentService } from "../services/document.service.js";

export class DocumentController {
  private readonly service = new DocumentService();

  getDocumentById = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    const document =
      await this.service.getDocumentById(id);

    return res.status(200).json(document);
  });

  getDocumentByWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params as {
      workspaceId: string;
    };

    const documents =
      await this.service.getDocumentsByWorkspace(
        workspaceId
      );

    return res.status(200).json(documents);
  });

  createDocument = asyncHandler(async (req, res) => {
    const file = req.file!;

    const { workspaceId } = req.body;

    const document =
      await this.service.createDocument({
        workspaceId,
        name: file.originalname,
        mimeType: file.mimetype,
        extension:
          file.originalname.split(".").pop() ?? "",
        size: file.size,
        filePath: file.path,
      });

    return res.status(201).json(document);
  });

  getDocumentFile = asyncHandler(async (req, res) => {
    const { id } = req.params as {
      id: string;
    };

    const document =
      await this.service.getDocumentById(id);

    const absolutePath = path.resolve(
      document.filePath
    );

    res.setHeader(
      "Content-Type",
      document.mimeType
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(
        document.name
      )}"`
    );

    return res.sendFile(absolutePath);
  });

  deleteDocument = asyncHandler(async (req, res) => {
    const { id } = req.params as {
      id: string;
    };

    await this.service.deleteDocument(id);

    return res.status(204).send();
  });
}