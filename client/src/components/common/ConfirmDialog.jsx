import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel, loading }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="confirm-icon">
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
            {message}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" style={{ background: "var(--negative)", color: "#100d02", borderColor: "var(--negative)" }} onClick={onConfirm} disabled={loading}>
              {loading ? "Please wait..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
