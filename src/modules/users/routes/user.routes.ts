import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

const controller = new UserController();

router.get("/", controller.getUsers);
router.get("/email/:email", controller.getUserByEmail);
router.get("/:id", controller.getUserById);

router.patch("/:id", controller.updateUser);

export default router;