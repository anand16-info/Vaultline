import { useEffect, useState, useCallback } from "react";
import { Plus, Target, Pencil, Trash2, PlusCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { goalService } from "../services/goalService";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatDate } from "../utils/formatters";
import GoalFormModal from "../components/goals/GoalFormModal.jsx";
import ContributeModal from "../components/goals/ContributeModal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { SkeletonCard } from "../components/common/Skeleton.jsx";

const GoalsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || "INR";

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [contributeTarget, setContributeTarget] = useState(null);
  const [contributing, setContributing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await goalService.getAll();
      setGoals(res.goals);
    } catch (err) {
      toast.error("Could not load goals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await goalService.update(editing._id, data);
        toast.success("Goal updated");
      } else {
        await goalService.create(data);
        toast.success("Goal created");
      }
      setModalOpen(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save goal");
    } finally {
      setSaving(false);
    }
  };

  const handleContribute = async (newSavedAmount) => {
    setContributing(true);
    try {
      await goalService.update(contributeTarget._id, { savedAmount: newSavedAmount });
      toast.success("Contribution added");
      setContributeTarget(null);
      fetchData();
    } catch (err) {
      toast.error("Could not add contribution");
    } finally {
      setContributing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await goalService.remove(deleteTarget._id);
      toast.success("Goal deleted");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error("Could not delete goal");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Working toward it</div>
          <h2 className="page-title">Savings Goals</h2>
          <p className="page-desc">Give every intention a target and a deadline.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> New goal
        </button>
      </div>

      {loading ? (
        <div className="grid-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : goals.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Target}
            title="No goals yet"
            text="Create your first savings goal — an emergency fund, a trip, a gadget."
            action={
              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                Create your first goal
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid-3">
          {goals.map((g) => (
            <div key={g._id} className="goal-card">
              <div className="goal-card-head">
                <div className="goal-icon">
                  {g.status === "completed" ? <CheckCircle2 size={18} /> : <Target size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{g.title}</div>
                  {g.targetDate && (
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>By {formatDate(g.targetDate)}</div>
                  )}
                </div>
                {g.status === "completed" && <span className="badge badge-gold">Done</span>}
              </div>

              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${g.percent}%` }} />
              </div>

              <div className="goal-amounts">
                <strong>{formatCurrency(g.savedAmount, currency)}</strong>
                <span>
                  of {formatCurrency(g.targetAmount, currency)} · {g.percent}%
                </span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setContributeTarget(g)}>
                  <PlusCircle size={14} /> Add funds
                </button>
                <button
                  className="btn-icon"
                  onClick={() => {
                    setEditing(g);
                    setModalOpen(true);
                  }}
                  aria-label="Edit goal"
                >
                  <Pencil size={15} />
                </button>
                <button className="btn-icon" onClick={() => setDeleteTarget(g)} aria-label="Delete goal">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <GoalFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialData={editing}
        loading={saving}
      />

      <ContributeModal
        open={!!contributeTarget}
        onClose={() => setContributeTarget(null)}
        onSubmit={handleContribute}
        goal={contributeTarget}
        loading={contributing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this goal?"
        message={`This will permanently remove "${deleteTarget?.title}" and its saved progress.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default GoalsPage;
