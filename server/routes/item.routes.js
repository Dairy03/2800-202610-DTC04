import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getItemById } from "../controllers/item.controller.js";

const router = Router();

router.get("/:itemId", requireAuth, getItemById);

export default router;
