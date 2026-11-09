import { Router } from "express";
import { DocumentController } from "../controllers/document.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { workspaceOwnershipValidate } from "../middlewares/workspaceOwnership.middleware.js";

const router = Router();
router.use(authMiddleware)

const controller = new DocumentController();

router.get("/:workspaceId", controller.getDocumentByWorkspace);
router.get("/:id/file", controller.getDocumentFile);

router.post("/:workspaceId/upload",workspaceOwnershipValidate, upload.single("file"), controller.createDocument);


router.delete("/:id", controller.deleteDocument);

export default router;
