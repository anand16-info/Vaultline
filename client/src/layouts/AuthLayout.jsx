import { Outlet } from "react-router-dom";
import { Gem } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div className="auth-visual-grid" />
        <div className="auth-visual-content" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="sidebar-brand-mark">
            <Gem size={17} strokeWidth={1.6} />
          </div>
          <div>
            <div className="sidebar-brand-name">Vaultline</div>
            <div className="sidebar-brand-tag">Finance Advisor</div>
          </div>
        </div>
        <p className="auth-visual-quote">
          Every rupee has a job. <span>Vaultline</span> makes sure it's doing the one you gave it.
        </p>
        <div>
          <p className="auth-visual-attribution">Private ledger · Bank-grade privacy · Built for clarity</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-box">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
