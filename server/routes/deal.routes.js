import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { acceptDeal } from "../controllers/deal.controller.js";

const router = Router();

router.get("/accept/:dealId", requireAuth, acceptDeal);
