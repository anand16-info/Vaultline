import Goal from "../models/Goal.js";

// @desc  Create savings goal
// @route POST /api/goals
export const createGoal = async (req, res, next) => {
  try {
    const { title, targetAmount, savedAmount, targetDate, icon } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      targetDate,
      icon,
    });

    res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all goals for user
// @route GET /api/goals
export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });

    const goalsWithProgress = goals.map((g) => {
      const percent = g.targetAmount > 0 ? Math.min(Math.round((g.savedAmount / g.targetAmount) * 100), 100) : 0;
      return { ...g.toObject(), percent };
    });

    res.status(200).json({ success: true, goals: goalsWithProgress });
  } catch (error) {
    next(error);
  }
};

// @desc  Update goal (edit or add contribution)
// @route PUT /api/goals/:id
export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const fields = ["title", "targetAmount", "savedAmount", "targetDate", "icon", "status"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) goal[field] = req.body[field];
    });

    if (goal.savedAmount >= goal.targetAmount && goal.status === "active") {
      goal.status = "completed";
    }

    await goal.save();

    res.status(200).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete goal
// @route DELETE /api/goals/:id
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    res.status(200).json({ success: true, message: "Goal deleted" });
  } catch (error) {
    next(error);
  }
};
