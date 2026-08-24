import { Router } from "express";
import userRoutes from "../modules/users/routes/user.routes.js";
import authRoutes from "../modules/auth/routes/auth.routes.js"
import workspacesRoutes from "../modules/workspaces/routes/workspace.routes.js"
import documentsRoutes from "../modules/documents/routes/document.routes.js"
import chatRoutes from "../modules/chat/routes/chat.routes.js"

const router = Router();

router.use("/users", userRoutes);
router.use("/auth",authRoutes)
router.use("/workspaces",workspacesRoutes)
router.use("/documents",documentsRoutes)
router.use("/chats",chatRoutes)

export default router;