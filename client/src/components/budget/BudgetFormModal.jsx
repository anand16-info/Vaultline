import { useState } from "react";
import Modal from "../common/Modal.jsx";
import { EXPENSE_CATEGORIES } from "../../utils/formatters";

const BudgetFormModal = ({ open, onClose, onSubmit, loading, month }) => {
  const [form, setForm] = useState({ category: "", limit: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = "Select a category";
    if (!form.limit || Number(form.limit) <= 0) errs.limit = "Enter a valid limit";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, limit: Number(form.limit), month });
    setForm({ category: "", limit: "" });
  };

  return (
    <Modal open={open} onClose={onClose} title="Set a budget">
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="budget-category">
            Category
          </label>
          <select
            id="budget-category"
            className={`select ${errors.category ? "input-error" : ""}`}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="budget-limit">
            Monthly limit
          </label>
          <input
            id="budget-limit"
            type="number"
            min="0"
            step="0.01"
            className={`input ${errors.limit ? "input-error" : ""}`}
            placeholder="e.g. 8000"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
          />
          {errors.limit && <span className="field-error">{errors.limit}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Saving..." : "Save budget"}
        </button>
      </form>
    </Modal>
  );
};

export default BudgetFormModal;
