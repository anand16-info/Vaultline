import { useState } from "react";
import { Calculator, Save, Trash2, Landmark } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useCallback } from "react";
import { loanService } from "../services/loanService";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency } from "../utils/formatters";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

const LoanPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || "INR";

  const [form, setForm] = useState({ name: "", principal: "", interestRate: "", tenureMonths: "" });
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLoans = useCallback(async () => {
    setLoadingLoans(true);
    try {
      const res = await loanService.getAll();
      setLoans(res.loans);
    } catch (err) {
      toast.error("Could not load saved loans");
    } finally {
      setLoadingLoans(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!form.principal || form.interestRate === "" || !form.tenureMonths) {
      toast.error("Fill in principal, interest rate and tenure");
      return;
    }
    setCalculating(true);
    try {
      const res = await loanService.calculate({
        principal: Number(form.principal),
        interestRate: Number(form.interestRate),
        tenureMonths: Number(form.tenureMonths),
      });
      setResult(res.result);
      setShowSchedule(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not calculate EMI");
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveLoan = async () => {
    if (!form.name.trim()) {
      toast.error("Give this loan a name first");
      return;
    }
    setSaving(true);
    try {
      await loanService.create({
        name: form.name,
        principal: Number(form.principal),
        interestRate: Number(form.interestRate),
        tenureMonths: Number(form.tenureMonths),
      });
      toast.success("Loan saved for tracking");
      fetchLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save loan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await loanService.remove(deleteTarget._id);
      toast.success("Loan removed");
      setDeleteTarget(null);
      fetchLoans();
    } catch (err) {
      toast.error("Could not delete loan");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Model it first</div>
          <h2 className="page-title">Loan & EMI Calculator</h2>
          <p className="page-desc">See the true cost of a loan before you sign anything.</p>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Calculate EMI</div>
              <div className="card-subtitle">Reducing balance method</div>
            </div>
          </div>
          <form onSubmit={handleCalculate} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="loan-name">
                Loan name (optional, for saving)
              </label>
              <input
                id="loan-name"
                type="text"
                className="input"
                placeholder="e.g. Car loan, Home loan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="principal">
                Loan amount (principal)
              </label>
              <input
                id="principal"
                type="number"
                min="0"
                className="input"
                placeholder="e.g. 500000"
                value={form.principal}
                onChange={(e) => setForm({ ...form, principal: e.target.value })}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="interestRate">
                  Annual interest rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  placeholder="e.g. 9.5"
                  value={form.interestRate}
                  onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="tenureMonths">
                  Tenure (months)
                </label>
                <input
                  id="tenureMonths"
                  type="number"
                  min="1"
                  className="input"
                  placeholder="e.g. 60"
                  value={form.tenureMonths}
                  onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={calculating}>
              <Calculator size={16} /> {calculating ? "Calculating..." : "Calculate EMI"}
            </button>
          </form>
        </div>

        <div className="card">
          {!result ? (
            <EmptyState
              icon={Landmark}
              title="No calculation yet"
              text="Fill in the loan details to see your EMI and full breakdown."
            />
          ) : (
            <>
              <div className="emi-result">
                <span className="emi-result-label">Monthly EMI</span>
                <span className="emi-result-value mono">{formatCurrency(result.emi, currency)}</span>
                <div className="emi-breakdown">
                  <div className="emi-breakdown-item">
                    <div className="emi-breakdown-value mono">{formatCurrency(result.totalInterest, currency)}</div>
                    <div className="emi-breakdown-label">Total interest</div>
                  </div>
                  <div className="emi-breakdown-item">
                    <div className="emi-breakdown-value mono">{formatCurrency(result.totalPayment, currency)}</div>
                    <div className="emi-breakdown-label">Total payment</div>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-block" onClick={handleSaveLoan} disabled={saving} style={{ marginBottom: 12 }}>
                <Save size={15} /> {saving ? "Saving..." : "Save this loan"}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setShowSchedule((s) => !s)}>
                {showSchedule ? "Hide" : "View"} amortization schedule
              </button>
            </>
          )}
        </div>
      </div>

      {result && showSchedule && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Amortization schedule</div>
          </div>
          <div className="table-wrap" style={{ maxHeight: 360, overflowY: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>EMI</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td className="mono">{formatCurrency(row.emi, currency)}</td>
                    <td className="mono">{formatCurrency(row.principalComponent, currency)}</td>
                    <td className="mono">{formatCurrency(row.interestComponent, currency)}</td>
                    <td className="mono">{formatCurrency(row.balance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Your saved loans</div>
        </div>
        {loadingLoans ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Loading...</p>
        ) : loans.length === 0 ? (
          <EmptyState icon={Landmark} title="No loans saved" text="Save a calculation above to track it here." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Principal</th>
                  <th>Rate</th>
                  <th>Tenure</th>
                  <th>EMI</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l._id}>
                    <td>{l.name}</td>
                    <td className="mono">{formatCurrency(l.principal, currency)}</td>
                    <td className="mono">{l.interestRate}%</td>
                    <td>{l.tenureMonths} mo</td>
                    <td className="mono" style={{ color: "var(--gold-soft)" }}>
                      {formatCurrency(l.emi, currency)}
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => setDeleteTarget(l)} aria-label="Delete loan">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this loan?"
        message={`This will remove "${deleteTarget?.name}" from your tracked loans.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default LoanPage;
