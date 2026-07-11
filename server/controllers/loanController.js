import Loan from "../models/Loan.js";

// Standard reducing-balance EMI formula
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

// @desc  Calculate EMI without saving (for the EMI Calculator tool)
// @route POST /api/loans/calculate
export const calculateLoanEMI = async (req, res, next) => {
  try {
    const { principal, interestRate, tenureMonths } = req.body;

    if (!principal || interestRate === undefined || !tenureMonths) {
      return res.status(400).json({ success: false, message: "principal, interestRate and tenureMonths are required" });
    }

    const emi = calculateEMI(Number(principal), Number(interestRate), Number(tenureMonths));
    const totalPayment = Math.round(emi * tenureMonths * 100) / 100;
    const totalInterest = Math.round((totalPayment - principal) * 100) / 100;

    // Amortization schedule
    let balance = Number(principal);
    const monthlyRate = Number(interestRate) / 12 / 100;
    const schedule = [];
    for (let month = 1; month <= tenureMonths; month++) {
      const interestComponent = Math.round(balance * monthlyRate * 100) / 100;
      const principalComponent = Math.round((emi - interestComponent) * 100) / 100;
      balance = Math.round((balance - principalComponent) * 100) / 100;
      schedule.push({
        month,
        emi,
        principalComponent,
        interestComponent,
        balance: balance < 0 ? 0 : balance,
      });
    }

    res.status(200).json({
      success: true,
      result: { emi, totalPayment, totalInterest, schedule },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Save a loan for tracking
// @route POST /api/loans
export const createLoan = async (req, res, next) => {
  try {
    const { name, principal, interestRate, tenureMonths, startDate } = req.body;

    const emi = calculateEMI(Number(principal), Number(interestRate), Number(tenureMonths));

    const loan = await Loan.create({
      user: req.user._id,
      name,
      principal,
      interestRate,
      tenureMonths,
      emi,
      startDate,
    });

    res.status(201).json({ success: true, loan });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all loans for user
// @route GET /api/loans
export const getLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, loans });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete loan
// @route DELETE /api/loans/:id
export const deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }
    res.status(200).json({ success: true, message: "Loan deleted" });
  } catch (error) {
    next(error);
  }
};
