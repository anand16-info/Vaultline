import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatDateInput } from "../../utils/formatters";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "other", label: "Other" },
];

const emptyForm = {
  type: "expense",
  amount: "",
  category: "",
  note: "",
  date: formatDateInput(new Date()),
  paymentMethod: "upi",
};

const TransactionFormModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        note: initialData.note || "",
        date: formatDateInput(initialData.date),
        paymentMethod: initialData.paymentMethod || "other",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData, open]);

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Enter a valid amount";
    if (!form.category) errs.category = "Select a category";
    if (!form.date) errs.date = "Select a date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit transaction" : "Add transaction"}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label">Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className={`btn ${form.type === "expense" ? "btn-primary" : "btn-outline"}`}
              style={{ flex: 1 }}
              onClick={() => setForm({ ...form, type: "expense", category: "" })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${form.type === "income" ? "btn-primary" : "btn-outline"}`}
              style={{ flex: 1 }}
              onClick={() => setForm({ ...form, type: "income", category: "" })}
            >
              Income
            </button>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              className={`input ${errors.amount ? "input-error" : ""}`}
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              className={`input ${errors.date ? "input-error" : ""}`}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={`select ${errors.category ? "input-error" : ""}`}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="paymentMethod">
            Payment method
          </label>
          <select
            id="paymentMethod"
            className="select"
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="note">
            Note (optional)
          </label>
          <textarea
            id="note"
            className="textarea"
            rows={2}
            placeholder="Add a short note..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Save changes" : "Add transaction"}
        </button>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
