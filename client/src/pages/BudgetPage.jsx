import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, PiggyBank, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { budgetService } from "../services/budgetService";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency } from "../utils/formatters";
import BudgetFormModal from "../components/budget/BudgetFormModal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { SkeletonCard } from "../components/common/Skeleton.jsx";

const shiftMonth = (month, delta) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonthLabel = (month) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("default", { month: "long", year: "numeric" });
};

const BudgetPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || "INR";

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await budgetService.getAll({ month });
      setBudgets(res.budgets);
    } catch (err) {
      toast.error("Could not load budgets");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await budgetService.create(data);
      toast.success("Budget saved");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save budget");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await budgetService.remove(deleteTarget._id);
      toast.success("Budget removed");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error("Could not delete budget");
    } finally {
      setDeleting(false);
    }
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Plan ahead</div>
          <h2 className="page-title">Budget Planner</h2>
          <p className="page-desc">Set a ceiling per category and watch it in real time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Set budget
        </button>
      </div>

      <div className="toolbar" style={{ marginBottom: 0 }}>
        <button className="btn-icon" onClick={() => setMonth((m) => shiftMonth(m, -1))} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <div style={{ fontWeight: 600, minWidth: 160, textAlign: "center" }}>{formatMonthLabel(month)}</div>
        <button className="btn-icon" onClick={() => setMonth((m) => shiftMonth(m, 1))} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      {!loading && budgets.length > 0 && (
        <div className="grid-2">
          <div className="stat-card">
            <span className="stat-card-label">Total budgeted</span>
            <span className="stat-card-value mono">{formatCurrency(totalLimit, currency)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Total spent</span>
            <span className="stat-card-value mono" style={{ color: totalSpent > totalLimit ? "var(--negative)" : "var(--text-primary)" }}>
              {formatCurrency(totalSpent, currency)}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={PiggyBank}
            title="No budgets for this month"
            text="Set spending limits per category to stay in control."
            action={
              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                Set your first budget
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid-2">
          {budgets.map((b) => (
            <div key={b._id} className="card card-tight">
              <div className="card-header" style={{ marginBottom: 12 }}>
                <div>
                  <div className="card-title" style={{ fontSize: 15 }}>
                    {b.category}
                  </div>
                  <div className="card-subtitle mono">
                    {formatCurrency(b.spent, currency)} of {formatCurrency(b.limit, currency)}
                  </div>
                </div>
                <button className="btn-icon" onClick={() => setDeleteTarget(b)} aria-label="Delete budget">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="progress-track">
                <div className={`progress-fill ${b.status === "over" ? "over" : ""}`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{b.percentUsed}% used</span>
                {b.status === "over" && (
                  <span className="badge badge-expense">
                    <AlertCircle size={12} /> Over budget
                  </span>
                )}
                {b.status === "warning" && <span className="badge badge-gold">Nearing limit</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <BudgetFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} loading={saving} month={month} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this budget?"
        message={`This will remove the budget for "${deleteTarget?.category}". Your transactions will not be affected.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default BudgetPage;
