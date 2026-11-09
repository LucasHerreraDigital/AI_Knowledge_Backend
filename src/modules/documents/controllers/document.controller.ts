import path from "path";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { DocumentService } from "../services/document.service.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class DocumentController {
  private readonly service = new DocumentService();

  getDocumentById = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const { id } = req.params as { id: string };

    const document = await this.service.getDocumentById(id,userId);

    return res.status(200).json(document);
  });

  getDocumentByWorkspace = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const { workspaceId } = req.params as {
      workspaceId: string;
    };

    const documents = await this.service.getDocumentsByWorkspace(workspaceId,userId);

    return res.status(200).json(documents);
  });

  createDocument = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const file = req.file;

    if (!file) {
      throw new AppError(400, "No se recibió ningún archivo");
    }

    const { workspaceId } = req.params as {workspaceId:string};

    const document =
      await this.service.createDocument({
        workspaceId,
        name: file.originalname,
        mimeType: file.mimetype,
        extension:
          file.originalname.split(".").pop() ?? "",
        size: file.size,
        filePath: file.path,
      },userId);

    return res.status(201).json(document);
  });

  getDocumentFile = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const { id } = req.params as {
      id: string;
    };

    const document =
      await this.service.getDocumentById(id,userId);

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
    if(!req.user){
      throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const { id } = req.params as {
      id: string;
    };

    await this.service.deleteDocument(id,userId);

    return res.status(204).send();
  });
}