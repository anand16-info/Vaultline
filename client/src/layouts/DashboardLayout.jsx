import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";

const PAGE_TITLES = {
  "/app": "Dashboard",
  "/app/transactions": "Transactions",
  "/app/budget": "Budget Planner",
  "/app/goals": "Savings Goals",
  "/app/loans": "Loan & EMI Calculator",
  "/app/reports": "Reports & Insights",
  "/app/settings": "Settings",
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Vaultline";

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
