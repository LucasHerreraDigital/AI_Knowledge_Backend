import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  createChatSchema,
  updateChatSchema,
  createMessageSchema,
} from "../schemas/chat.schema.js";

const router = Router();

const controller = new ChatController();

router.use(authMiddleware);

router.post("/", validate(createChatSchema), controller.createChat);

router.get("/search",controller.searchChats)

router.get("/workspace/:workspaceId", controller.getChatsByWorkspace);

router.get("/:id", controller.getChatById);

router.patch("/:id", validate(updateChatSchema), controller.updateChat);

router.delete("/:id", controller.deleteChat);

router.post(
  "/:id/messages",
  validate(createMessageSchema),
  controller.createMessage,
);

router.get("/:id/messages", controller.getMessagesByChat);

export default router;