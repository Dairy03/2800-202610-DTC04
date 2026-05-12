import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { acceptDeal, removeDeal } from "../controllers/deal.controller.js";

const router = Router();

router.post("/accept/:itemId/:quantity", acceptDeal);
router.delete("/remove/:itemId/:quantity", removeDeal);

export default router;
