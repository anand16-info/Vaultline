import Transaction from "../models/Transaction.js";

// @desc  Create a transaction
// @route POST /api/transactions
export const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, note, date, paymentMethod } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      note,
      date: date || Date.now(),
      paymentMethod,
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all transactions for logged-in user (with filters, search, sort, pagination)
// @route GET /api/transactions
export const getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      search,
      startDate,
      endDate,
      sortBy = "date",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.$or = [
      { category: { $regex: search, $options: "i" } },
      { note: { $regex: search, $options: "i" } },
    ];
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update a transaction
// @route PUT /api/transactions/:id
export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const fields = ["type", "amount", "category", "note", "date", "paymentMethod"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) transaction[field] = req.body[field];
    });

    await transaction.save();

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a transaction
// @route DELETE /api/transactions/:id
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc  Get summary stats (for dashboard) - totals, category breakdown, monthly trend
// @route GET /api/transactions/summary
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { months = 6 } = req.query;

    const allTransactions = await Transaction.find({ user: userId });

    const totalIncome = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Category breakdown (expenses)
    const categoryMap = {};
    allTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });
    const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    // Monthly trend (last N months)
    const now = new Date();
    const monthlyTrend = [];
    for (let i = Number(months) - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = d.toLocaleString("default", { month: "short", year: "2-digit" });

      const monthIncome = allTransactions
        .filter((t) => {
          const td = new Date(t.date);
          return t.type === "income" && td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpense = allTransactions
        .filter((t) => {
          const td = new Date(t.date);
          return t.type === "expense" && td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
        })
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyTrend.push({ month: monthKey, label: monthLabel, income: monthIncome, expense: monthExpense });
    }

    const recentTransactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(5);

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance,
        categoryBreakdown,
        monthlyTrend,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};
