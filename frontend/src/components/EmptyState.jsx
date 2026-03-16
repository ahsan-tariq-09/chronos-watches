export default function EmptyState({ icon = "bi-search", title, message, action }) {
  return (
    <div className="empty-state text-center py-5 border rounded-3 bg-light-subtle">
      <i className={`bi ${icon} fs-1`} />
      <h4 className="mt-3">{title}</h4>
      <p className="text-muted mb-3">{message}</p>
      {action}
    </div>
  );
}
