import { Router } from "express";
import { getRecipes } from "../controllers/recipe.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, getRecipes);

export default router;
