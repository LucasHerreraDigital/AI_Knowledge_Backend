import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

const controller = new AuthController();

router.post("/register",validate(registerSchema),controller.registerUser)
router.post("/login",validate(loginSchema),controller.loginUser)
router.post("/refresh",controller.refresh)
router.post("logout",controller.logout)

export default router