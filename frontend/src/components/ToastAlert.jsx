export default function ToastAlert({ toast, onClose }) {
  if (!toast.visible) return null;
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div className={`toast show text-bg-${toast.type}`} role="alert">
        <div className="toast-header">
          <strong className="me-auto">{toast.title}</strong>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
        </div>
        <div className="toast-body">{toast.message}</div>
      </div>
    </div>
  );
}
