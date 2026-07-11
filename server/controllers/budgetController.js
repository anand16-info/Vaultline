import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

// @desc  Create/set a budget for a category+month
// @route POST /api/budgets
export const createBudget = async (req, res, next) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ success: false, message: "Category, limit and month are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

// @desc  Get budgets for a given month with spent amount + progress
// @route GET /api/budgets?month=YYYY-MM
export const getBudgets = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    const budgets = await Budget.find({ user: req.user._id, month });

    const [year, mon] = month.split("-").map(Number);
    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
      date: { $gte: startDate, $lte: endDate },
    });

    const spentMap = {};
    transactions.forEach((t) => {
      spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
    });

    const budgetsWithProgress = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const percentUsed = b.limit > 0 ? Math.min(Math.round((spent / b.limit) * 100), 999) : 0;
      return {
        _id: b._id,
        category: b.category,
        limit: b.limit,
        month: b.month,
        spent,
        remaining: b.limit - spent,
        percentUsed,
        status: percentUsed >= 100 ? "over" : percentUsed >= 80 ? "warning" : "healthy",
      };
    });

    res.status(200).json({ success: true, budgets: budgetsWithProgress });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a budget
// @route DELETE /api/budgets/:id
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    res.status(200).json({ success: true, message: "Budget deleted" });
  } catch (error) {
    next(error);
  }
};
