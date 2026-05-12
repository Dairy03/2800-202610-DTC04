import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  acceptDeal,
  updateCart,
  removeDeal,
} from "../controllers/deal.controller.js";

const router = Router();

router.post("/accept/:itemId/:quantity", acceptDeal);
router.patch("/update/:itemId/:quantity", updateCart);
router.delete("/remove/:itemId", removeDeal);

export default router;
