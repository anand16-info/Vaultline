import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { formatDateInput } from "../../utils/formatters";

const emptyForm = { title: "", targetAmount: "", savedAmount: "", targetDate: "" };

const GoalFormModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        targetAmount: initialData.targetAmount,
        savedAmount: initialData.savedAmount,
        targetDate: initialData.targetDate ? formatDateInput(initialData.targetDate) : "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Give your goal a name";
    if (!form.targetAmount || Number(form.targetAmount) <= 0) errs.targetAmount = "Enter a valid target";
    if (form.savedAmount && Number(form.savedAmount) < 0) errs.savedAmount = "Cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount) || 0,
      targetDate: form.targetDate || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit goal" : "New savings goal"}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="goal-title">
            Goal name
          </label>
          <input
            id="goal-title"
            type="text"
            className={`input ${errors.title ? "input-error" : ""}`}
            placeholder="e.g. Emergency fund, Japan trip"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="target-amount">
              Target amount
            </label>
            <input
              id="target-amount"
              type="number"
              min="0"
              step="0.01"
              className={`input ${errors.targetAmount ? "input-error" : ""}`}
              placeholder="e.g. 50000"
              value={form.targetAmount}
              onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
            />
            {errors.targetAmount && <span className="field-error">{errors.targetAmount}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="saved-amount">
              Already saved
            </label>
            <input
              id="saved-amount"
              type="number"
              min="0"
              step="0.01"
              className={`input ${errors.savedAmount ? "input-error" : ""}`}
              placeholder="0"
              value={form.savedAmount}
              onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
            />
            {errors.savedAmount && <span className="field-error">{errors.savedAmount}</span>}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="target-date">
            Target date (optional)
          </label>
          <input
            id="target-date"
            type="date"
            className="input"
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Save changes" : "Create goal"}
        </button>
      </form>
    </Modal>
  );
};

export default GoalFormModal;
