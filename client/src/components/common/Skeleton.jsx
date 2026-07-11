export const SkeletonLine = ({ width = "100%", height = 14, style = {} }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

export const SkeletonCard = () => (
  <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <SkeletonLine width="40%" height={12} />
    <SkeletonLine width="60%" height={28} />
    <SkeletonLine width="30%" height={10} />
  </div>
);

export const SkeletonRow = () => (
  <div style={{ display: "flex", gap: 16, padding: "14px 0", alignItems: "center" }}>
    <SkeletonLine width={36} height={36} style={{ borderRadius: "50%" }} />
    <SkeletonLine width="100%" height={14} />
    <SkeletonLine width={80} height={14} />
  </div>
);
