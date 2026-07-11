const EmptyState = ({ icon: Icon, title, text, action }) => {
  return (
    <div className="empty-state">
      {Icon && <Icon size={40} strokeWidth={1.3} />}
      <div className="empty-state-title">{title}</div>
      {text && <p className="empty-state-text">{text}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
