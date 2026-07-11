import { useState } from "react";
import toast from "react-hot-toast";
import { User, Lock, Palette } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/authService";
import { getInitials } from "../utils/formatters";

const CURRENCIES = [
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
];

const AVATAR_COLORS = ["#D4AF37", "#6fae8c", "#c96a5a", "#8a7530", "#a8a29a", "#7c8ba1"];

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    currency: user?.currency || "INR",
    monthlyIncomeTarget: user?.monthlyIncomeTarget || "",
    avatarColor: user?.avatarColor || "#D4AF37",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authService.updateMe({
        ...profileForm,
        monthlyIncomeTarget: Number(profileForm.monthlyIncomeTarget) || 0,
      });
      updateUser(res.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Your account</div>
          <h2 className="page-title">Settings</h2>
          <p className="page-desc">Manage your profile, preferences, and security.</p>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="stack">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <User size={16} style={{ display: "inline", marginRight: 8, verticalAlign: -2 }} />
                  Profile
                </div>
              </div>
            </div>
            <form onSubmit={handleProfileSubmit} noValidate>
              <div className="field">
                <label className="field-label" htmlFor="settings-name">
                  Full name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  className="input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field-label" htmlFor="settings-currency">
                    Currency
                  </label>
                  <select
                    id="settings-currency"
                    className="select"
                    value={profileForm.currency}
                    onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="income-target">
                    Monthly income target
                  </label>
                  <input
                    id="income-target"
                    type="number"
                    min="0"
                    className="input"
                    placeholder="0"
                    value={profileForm.monthlyIncomeTarget}
                    onChange={(e) => setProfileForm({ ...profileForm, monthlyIncomeTarget: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">
                  <Palette size={13} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
                  Avatar color
                </label>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-swatch ${profileForm.avatarColor === c ? "selected" : ""}`}
                      style={{ background: c }}
                      onClick={() => setProfileForm({ ...profileForm, avatarColor: c })}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Lock size={16} style={{ display: "inline", marginRight: 8, verticalAlign: -2 }} />
                  Change password
                </div>
              </div>
            </div>
            <form onSubmit={handlePasswordSubmit} noValidate>
              <div className="field">
                <label className="field-label" htmlFor="current-password">
                  Current password
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  autoComplete="current-password"
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field-label" htmlFor="new-password">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="input"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="confirm-new-password">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    className="input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-outline" disabled={savingPassword}>
                {savingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>

        <div className="card" style={{ textAlign: "center", height: "fit-content" }}>
          <div
            className="avatar"
            style={{
              width: 72,
              height: 72,
              fontSize: 24,
              margin: "0 auto 16px",
              background: profileForm.avatarColor,
            }}
          >
            {getInitials(profileForm.name)}
          </div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>{user?.email}</div>
          <div className="settings-row" style={{ padding: "10px 0" }}>
            <span className="settings-row-label" style={{ fontSize: 12 }}>
              Member since
            </span>
            <span className="mono" style={{ fontSize: 12 }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
