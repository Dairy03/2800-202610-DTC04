import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getItemsByParams, getItemById } from "../controllers/item.controller.js";

const router = Router();

router.get("/:itemId", requireAuth, getItemById);
router.get("/", requireAuth, getItemsByParams);

export default router;