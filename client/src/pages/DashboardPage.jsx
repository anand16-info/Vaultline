import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import { transactionService } from "../services/transactionService";
import { goalService } from "../services/goalService";
import { budgetService } from "../services/budgetService";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatCompactCurrency, formatDate } from "../utils/formatters";
import { SkeletonCard, SkeletonRow } from "../components/common/Skeleton.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

const PIE_COLORS = ["#D4AF37", "#E8C766", "#8a7530", "#6f6a61", "#a8a29a", "#c96a5a", "#6fae8c"];

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, goalsRes, budgetsRes] = await Promise.all([
          transactionService.getSummary({ months: 6 }),
          goalService.getAll(),
          budgetService.getAll({}),
        ]);
        setSummary(summaryRes.summary);
        setGoals(goalsRes.goals.filter((g) => g.status === "active").slice(0, 3));
        setBudgets(budgetsRes.budgets.slice(0, 4));
      } catch (err) {
        toast.error("Could not load your dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currency = user?.currency || "INR";

  if (loading) {
    return (
      <div className="stack">
        <div className="grid-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="card">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  const hasData = summary && (summary.totalIncome > 0 || summary.totalExpense > 0);

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Overview</div>
          <h2 className="page-title">Good to see you, {user?.name?.split(" ")[0]}</h2>
          <p className="page-desc">Here's where your money stands right now.</p>
        </div>
        <Link to="/app/transactions" className="btn btn-primary">
          Add transaction
        </Link>
      </div>

      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Balance</span>
            <div className="stat-card-icon">
              <Wallet size={16} />
            </div>
          </div>
          <span className="stat-card-value mono">{formatCompactCurrency(summary?.balance, currency)}</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Total income</span>
            <div className="stat-card-icon" style={{ color: "var(--positive)", background: "rgba(111,174,140,0.14)" }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <span className="stat-card-value mono" style={{ color: "var(--positive)" }}>
            {formatCompactCurrency(summary?.totalIncome, currency)}
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Total expenses</span>
            <div className="stat-card-icon" style={{ color: "var(--negative)", background: "rgba(201,106,90,0.14)" }}>
              <TrendingDown size={16} />
            </div>
          </div>
          <span className="stat-card-value mono" style={{ color: "var(--negative)" }}>
            {formatCompactCurrency(summary?.totalExpense, currency)}
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Active goals</span>
            <div className="stat-card-icon">
              <PiggyBank size={16} />
            </div>
          </div>
          <span className="stat-card-value mono">{goals.length}</span>
        </div>
      </div>

      {!hasData ? (
        <div className="card">
          <EmptyState
            icon={Inbox}
            title="No activity yet"
            text="Add your first income or expense to see your dashboard come to life."
            action={
              <Link to="/app/transactions" className="btn btn-primary btn-sm">
                Add your first transaction
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid-2-1">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Income vs. expense</div>
                <div className="card-subtitle">Last 6 months</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={summary.monthlyTrend}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactCurrency(v, currency)} width={60} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--line-strong)", borderRadius: 8, fontSize: 13 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(value) => formatCurrency(value, currency)}
                />
                <Line type="monotone" dataKey="income" stroke="#6fae8c" strokeWidth={2} dot={false} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#D4AF37" strokeWidth={2} dot={false} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Where it goes</div>
                <div className="card-subtitle">By category</div>
              </div>
            </div>
            {summary.categoryBreakdown.length === 0 ? (
              <EmptyState icon={Inbox} title="No expenses yet" text="Log an expense to see the breakdown." />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={summary.categoryBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {summary.categoryBreakdown.map((entry, index) => (
                        <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--line-strong)", borderRadius: 8, fontSize: 13 }}
                      formatter={(value) => formatCurrency(value, currency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {summary.categoryBreakdown.slice(0, 5).map((c, i) => (
                    <div key={c.category} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {c.category}
                      </span>
                      <span className="mono">{formatCurrency(c.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent transactions</div>
            </div>
            <Link to="/app/transactions" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {summary.recentTransactions.length === 0 ? (
            <EmptyState icon={Inbox} title="Nothing logged yet" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {summary.recentTransactions.map((t) => (
                <div key={t._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.category}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{formatDate(t.date)}</div>
                  </div>
                  <span className={`mono ${t.type === "income" ? "" : ""}`} style={{ color: t.type === "income" ? "var(--positive)" : "var(--negative)", fontSize: 14 }}>
                    {t.type === "income" ? "+" : "−"}
                    {formatCurrency(t.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Budget overview</div>
            </div>
            <Link to="/app/budget" className="btn btn-ghost btn-sm">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {budgets.length === 0 ? (
            <EmptyState icon={Inbox} title="No budgets set" text="Create a budget to track spending limits." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {budgets.map((b) => (
                <div key={b._id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span>{b.category}</span>
                    <span className="mono" style={{ color: "var(--text-secondary)" }}>
                      {formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${b.status === "over" ? "over" : ""}`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
