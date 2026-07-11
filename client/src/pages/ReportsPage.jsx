import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Inbox, TrendingUp, TrendingDown, Percent } from "lucide-react";
import toast from "react-hot-toast";
import { transactionService } from "../services/transactionService";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatCompactCurrency } from "../utils/formatters";
import EmptyState from "../components/common/EmptyState.jsx";
import { SkeletonCard } from "../components/common/Skeleton.jsx";

const PIE_COLORS = ["#D4AF37", "#E8C766", "#8a7530", "#6f6a61", "#a8a29a", "#c96a5a", "#6fae8c"];

const ReportsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || "INR";
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await transactionService.getSummary({ months: 12 });
        setSummary(res.summary);
      } catch (err) {
        toast.error("Could not load reports");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const hasData = summary && (summary.totalIncome > 0 || summary.totalExpense > 0);
  const savingsRate = summary && summary.totalIncome > 0 ? Math.round((summary.balance / summary.totalIncome) * 100) : 0;

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">The full picture</div>
          <h2 className="page-title">Reports & Insights</h2>
          <p className="page-desc">Twelve months of trends, distilled into what actually matters.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="card">
          <EmptyState icon={Inbox} title="Not enough data yet" text="Add a few transactions and check back here." />
        </div>
      ) : (
        <>
          <div className="grid-3">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Savings rate</span>
                <div className="stat-card-icon">
                  <Percent size={16} />
                </div>
              </div>
              <span className="stat-card-value mono">{savingsRate}%</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Avg. monthly income</span>
                <div className="stat-card-icon" style={{ color: "var(--positive)", background: "rgba(111,174,140,0.14)" }}>
                  <TrendingUp size={16} />
                </div>
              </div>
              <span className="stat-card-value mono">
                {formatCompactCurrency(summary.monthlyTrend.reduce((s, m) => s + m.income, 0) / summary.monthlyTrend.length, currency)}
              </span>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Avg. monthly expense</span>
                <div className="stat-card-icon" style={{ color: "var(--negative)", background: "rgba(201,106,90,0.14)" }}>
                  <TrendingDown size={16} />
                </div>
              </div>
              <span className="stat-card-value mono">
                {formatCompactCurrency(summary.monthlyTrend.reduce((s, m) => s + m.expense, 0) / summary.monthlyTrend.length, currency)}
              </span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly income vs. expense</div>
                <div className="card-subtitle">Last 12 months</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.monthlyTrend}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactCurrency(v, currency)} width={60} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--line-strong)", borderRadius: 8, fontSize: 13 }}
                  formatter={(value) => formatCurrency(value, currency)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="#6fae8c" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#D4AF37" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Spending by category</div>
              </div>
              {summary.categoryBreakdown.length === 0 ? (
                <EmptyState icon={Inbox} title="No expenses yet" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={summary.categoryBreakdown} dataKey="amount" nameKey="category" outerRadius={100} label={(entry) => entry.category}>
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
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Top categories</div>
              </div>
              {summary.categoryBreakdown.length === 0 ? (
                <EmptyState icon={Inbox} title="No expenses yet" />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[...summary.categoryBreakdown]
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 7)
                    .map((c, i) => {
                      const max = Math.max(...summary.categoryBreakdown.map((x) => x.amount));
                      return (
                        <div key={c.category}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                            <span>{c.category}</span>
                            <span className="mono">{formatCurrency(c.amount, currency)}</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${(c.amount / max) * 100}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
