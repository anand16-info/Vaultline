import { useState } from "react";
import Modal from "../common/Modal.jsx";

const ContributeModal = ({ open, onClose, onSubmit, goal, loading }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    onSubmit(Number(goal.savedAmount) + Number(amount));
    setAmount("");
  };

  if (!goal) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Add to "${goal.title}"`} maxWidth={380}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="contribute-amount">
            Amount to add
          </label>
          <input
            id="contribute-amount"
            type="number"
            min="0"
            step="0.01"
            className={`input ${error ? "input-error" : ""}`}
            placeholder="e.g. 2000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            autoFocus
          />
          {error && <span className="field-error">{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Adding..." : "Add to goal"}
        </button>
      </form>
    </Modal>
  );
};

export default ContributeModal;
