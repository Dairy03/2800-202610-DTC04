import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { acceptDeal, updateCart } from "../controllers/deal.controller.js";

const router = Router();

router.post("/accept/:itemId/:quantity", acceptDeal);
router.patch("/update/:itemId/:quantity", updateCart);

export default router;
