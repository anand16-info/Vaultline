import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "var(--bg-primary)" }}>
      <Compass size={40} color="var(--gold)" strokeWidth={1.3} />
      <h1 style={{ fontSize: 28 }}>Page not found</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
