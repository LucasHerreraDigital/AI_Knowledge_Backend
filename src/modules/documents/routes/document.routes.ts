import { Router } from "express";
import { DocumentController } from "../controllers/document.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

const controller = new DocumentController();

router.get("/:workspaceId", controller.getDocumentByWorkspace);
router.get("/:id/file", controller.getDocumentFile);

router.post("/upload", upload.single("file"), controller.createDocument);


router.delete("/:id", controller.deleteDocument);

export default router;
