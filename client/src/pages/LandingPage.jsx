import { Link } from "react-router-dom";
import {
  Gem,
  ArrowRight,
  Wallet,
  PieChart,
  Target,
  Calculator,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Income & expense tracking",
    text: "Log every transaction in seconds and see exactly where your money goes, categorized automatically.",
  },
  {
    icon: PieChart,
    title: "Budget planner",
    text: "Set monthly limits per category and get warned before you overspend — not after.",
  },
  {
    icon: Target,
    title: "Savings goals",
    text: "Turn a vague intention into a tracked target with a deadline and visible progress.",
  },
  {
    icon: Calculator,
    title: "Loan & EMI calculator",
    text: "Model any loan with a full amortization schedule before you commit to it.",
  },
  {
    icon: TrendingUp,
    title: "Reports & insights",
    text: "Monthly trends and category breakdowns that explain your habits, not just your numbers.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Your ledger belongs to you. No ads, no data reselling, no noise — just your finances, clearly.",
  },
];

const LandingPage = () => {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="sidebar-brand-mark">
            <Gem size={16} strokeWidth={1.6} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Vaultline</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div>
          <div className="landing-hero-eyebrow">
            <Gem size={13} /> Personal Finance, Refined
          </div>
          <h1 className="landing-hero-title">
            A private ledger for people who take their <em>money</em> seriously.
          </h1>
          <p className="landing-hero-desc">
            Vaultline brings your income, expenses, budgets, goals, and loans into one calm, uncluttered
            place — so every decision is made with the full picture in view.
          </p>
          <div className="landing-hero-actions">
            <Link to="/register" className="btn btn-primary">
              Open your vault <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mockup-frame">
          <div className="card-header">
            <div>
              <div className="card-title">This month</div>
              <div className="card-subtitle">Overview</div>
            </div>
            <span className="badge badge-gold">On track</span>
          </div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="stat-card card-tight">
              <span className="stat-card-label">Income</span>
              <span className="stat-card-value mono" style={{ color: "var(--positive)" }}>
                ₹82,400
              </span>
            </div>
            <div className="stat-card card-tight">
              <span className="stat-card-label">Expenses</span>
              <span className="stat-card-value mono" style={{ color: "var(--negative)" }}>
                ₹51,120
              </span>
            </div>
          </div>
          <div className="field-label" style={{ marginBottom: 8 }}>
            Savings goal — Japan trip
          </div>
          <div className="progress-track" style={{ marginBottom: 6 }}>
            <div className="progress-fill" style={{ width: "64%" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
            <span>₹64,000 saved</span>
            <span>64%</span>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <div className="page-eyebrow" style={{ justifyContent: "center", display: "flex" }}>
            Everything, in one vault
          </div>
          <h2 className="page-title" style={{ fontSize: 32 }}>
            Built for the way money actually moves
          </h2>
        </div>
        <div className="landing-features">
          {FEATURES.map((f) => (
            <div className="landing-feature-card" key={f.title}>
              <div className="landing-feature-icon">
                <f.icon size={20} strokeWidth={1.7} />
              </div>
              <div className="landing-feature-title">{f.title}</div>
              <p className="landing-feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <span>© 2026 Vaultline</span>
      </footer>
    </div>
  );
};

export default LandingPage;
