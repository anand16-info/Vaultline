import express from "express";
import { calculateLoanEMI, createLoan, getLoans, deleteLoan } from "../controllers/loanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/calculate", protect, calculateLoanEMI);
router.route("/").get(protect, getLoans).post(protect, createLoan);
router.delete("/:id", protect, deleteLoan);

export default router;
