import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAllItems, getItemById } from "../controllers/item.controller.js";

const router = Router();

router.get("/:itemId", requireAuth, getItemById);
router.get("/", requireAuth, getAllItems);

export default router;
