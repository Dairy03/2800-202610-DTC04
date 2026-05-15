import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { addStock, removeStock } from "../controllers/business.controller.js";

const router = Router();

router.post("/add", requireAuth, addStock);
router.delete("/remove", requireAuth, removeStock);

export default router;
