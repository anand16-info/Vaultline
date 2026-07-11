import express from "express";
import { createBudget, getBudgets, deleteBudget } from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getBudgets).post(createBudget);
router.route("/:id").delete(deleteBudget);

export default router;
