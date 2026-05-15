import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addStock,
  getStoreItems,
  getAllBusinesses,
  getBusinessById,
} from "../controllers/business.controller.js";

const router = Router();

router.post("/add", requireAuth, addStock);
router.get("/all", requireAuth, getAllBusinesses);
router.get("/:storeId/items", requireAuth, getStoreItems);
router.get("/:businessId", requireAuth, getBusinessById);

export default router;
