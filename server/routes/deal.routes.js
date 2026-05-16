import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  acceptDeal,
  updateCart,
  removeDeal,
  getCart,
} from "../controllers/deal.controller.js";

const router = Router();

router.post("/accept/:itemId/:quantity", requireAuth, acceptDeal);
router.patch("/update/:itemId/:quantity", requireAuth, updateCart);
router.delete("/remove/:itemId", requireAuth, removeDeal);
router.get("/cart", requireAuth, getCart);

export default router;
