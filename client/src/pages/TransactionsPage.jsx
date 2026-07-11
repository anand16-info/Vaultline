import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { transactionService } from "../services/transactionService";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/formatters";
import TransactionFormModal from "../components/transactions/TransactionFormModal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { SkeletonRow } from "../components/common/Skeleton.jsx";

const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

const TransactionsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || "INR";

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionService.getAll({
        search: search || undefined,
        type: typeFilter || undefined,
        category: categoryFilter || undefined,
        sortBy,
        order,
        page,
        limit: 8,
      });
      setTransactions(res.transactions);
      setPagination(res.pagination);
    } catch (err) {
      toast.error("Could not load transactions");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, categoryFilter, sortBy, order, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await transactionService.update(editing._id, data);
        toast.success("Transaction updated");
      } else {
        await transactionService.create(data);
        toast.success("Transaction added");
      }
      setModalOpen(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await transactionService.remove(deleteTarget._id);
      toast.success("Transaction deleted");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error("Could not delete transaction");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Ledger</div>
          <h2 className="page-title">Transactions</h2>
          <p className="page-desc">Every rupee in and out, searchable and sortable.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Add transaction
        </button>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search">
            <Search size={16} />
            <input
              className="input"
              placeholder="Search by category or note..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="select"
            style={{ width: "auto" }}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="select"
            style={{ width: "auto" }}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="select"
            style={{ width: "auto" }}
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [sb, o] = e.target.value.split("-");
              setSortBy(sb);
              setOrder(o);
            }}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount: high to low</option>
            <option value="amount-asc">Amount: low to high</option>
          </select>
        </div>

        {loading ? (
          <div>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No transactions found"
            text="Try adjusting your filters, or add a new transaction."
          />
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <span className={`badge ${t.type === "income" ? "badge-income" : "badge-expense"}`}>
                          {t.category}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-secondary)", maxWidth: 220 }}>{t.note || "—"}</td>
                      <td className="mono">{formatDate(t.date)}</td>
                      <td style={{ textTransform: "capitalize", color: "var(--text-secondary)" }}>
                        {t.paymentMethod.replace("_", " ")}
                      </td>
                      <td className="mono" style={{ color: t.type === "income" ? "var(--positive)" : "var(--negative)", fontWeight: 500 }}>
                        {t.type === "income" ? "+" : "−"}
                        {formatCurrency(t.amount, currency)}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button
                            className="btn-icon"
                            onClick={() => {
                              setEditing(t);
                              setModalOpen(true);
                            }}
                            aria-label="Edit transaction"
                          >
                            <Pencil size={15} />
                          </button>
                          <button className="btn-icon" onClick={() => setDeleteTarget(t)} aria-label="Delete transaction">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages} · {pagination.total} total
              </span>
              <div className="pagination-controls">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialData={editing}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this transaction?"
        message={`This will permanently remove "${deleteTarget?.category}" from your ledger. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default TransactionsPage;
