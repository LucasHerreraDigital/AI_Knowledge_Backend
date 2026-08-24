import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controllers.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../schemas/workspace.schema.js";

const router = Router();

const controller = new WorkspaceController();

router.get("/", controller.getWorkspaces);
router.get("/user/:userId", controller.getWorkspaceByUser);
router.get("/:id", controller.getWorkspaceById);

router.post(
  "/",
  validate(createWorkspaceSchema),
  controller.createWorkspace
);

router.patch(
  "/:id",
  validate(updateWorkspaceSchema),
  controller.updateWorkspace
);

router.delete("/:id", controller.deleteWorkspace);

export default router;