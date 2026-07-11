const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const formatCurrency = (amount, currency = "INR") => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const value = Number(amount) || 0;
  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};

export const formatCompactCurrency = (amount, currency = "INR") => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const value = Number(amount) || 0;
  if (Math.abs(value) >= 10000000) return `${symbol}${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `${symbol}${(value / 100000).toFixed(2)}L`;
  if (Math.abs(value) >= 1000) return `${symbol}${(value / 1000).toFixed(1)}K`;
  return `${symbol}${value.toFixed(0)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

export const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Housing & Rent",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Travel",
  "Subscriptions",
  "Insurance",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment Returns",
  "Gift",
  "Refund",
  "Other",
];
