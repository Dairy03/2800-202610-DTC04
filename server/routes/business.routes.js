import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { addStock } from "../controllers/business.controller.js";

const router = Router();

router.post("/add", requireAuth, addStock);

export default router;
