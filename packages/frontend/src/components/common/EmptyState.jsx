import './EmptyState.css';

export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionButton,
}) {
  return (
    <div className="empty-state">
      {Icon && <Icon className="empty-icon" />}
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionButton}
    </div>
  );
}
