import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success("Vault created — welcome to Vaultline");
      navigate("/app");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-eyebrow">Create account</div>
      <h1 className="auth-heading">Open your vault</h1>
      <p className="auth-subheading">Takes less than a minute. No card required.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="name">
            Full name
          </label>
          <div className="input-group">
            <User size={16} className="input-icon" />
            <input
              id="name"
              type="text"
              className={`input ${errors.name ? "input-error" : ""}`}
              placeholder="Anand Pandey"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
            />
          </div>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="email">
            Email address
          </label>
          <div className="input-group">
            <Mail size={16} className="input-icon" />
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type="password"
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                className={`input ${errors.confirmPassword ? "input-error" : ""}`}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating your vault..." : "Create account"}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
};

export default RegisterPage;
