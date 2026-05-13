import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  acceptDeal,
  updateCart,
  removeDeal,
} from "../controllers/deal.controller.js";

const router = Router();

router.post("/accept/:itemId/:quantity", requireAuth, acceptDeal);
router.patch("/update/:itemId/:quantity", requireAuth, updateCart);
router.delete("/remove/:itemId", requireAuth, removeDeal);

export default router;
