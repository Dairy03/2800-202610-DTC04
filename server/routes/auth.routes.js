import { Router } from "express";
import {
  unregister,
  login,
  logout,
  me,
  updateUser,
} from "../controllers/auth.controller.js";
import { registerCustomer } from "../controllers/customer.controller.js";
import { registerBusiness } from "../controllers/business.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register/customer", registerCustomer);
router.post("/register/business", registerBusiness);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

router.delete("/unregister", requireAuth, unregister);

router.get("/me", requireAuth, me);

router.patch("/user", requireAuth, updateUser);

export default router;
