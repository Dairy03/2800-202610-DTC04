import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { acceptDeal, removeDeal } from "../controllers/deal.controller.js";

const router = Router();

router.get("/accept/:dealId", acceptDeal);
router.delete("/remove/:dealId", removeDeal);

export default router;
