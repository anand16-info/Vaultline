import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ArrowLeftRight,
  PieChart,
  Target,
  Calculator,
  BarChart3,
  Settings,
  X,
  Gem,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/formatters.js";

const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/budget", label: "Budget Planner", icon: PieChart },
  { to: "/app/goals", label: "Savings Goals", icon: Target },
  { to: "/app/loans", label: "Loan & EMI", icon: Calculator },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      <div className={`sidebar-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">
            <Gem size={17} strokeWidth={1.6} />
          </div>
          <div>
            <div className="sidebar-brand-name">Vaultline</div>
            <div className="sidebar-brand-tag">Finance Advisor</div>
          </div>
          <button className="btn-icon sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <item.icon size={17} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar" style={{ background: user?.avatarColor || "#D4AF37" }}>
              {getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
