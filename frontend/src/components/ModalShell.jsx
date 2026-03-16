import { useEffect } from "react";

export default function ModalShell({ isOpen, title, size = "", onClose, children, footer }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
      <div className={`modal-dialog ${size}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body">{children}</div>
          {footer ? <div className="modal-footer">{footer}</div> : null}
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onClose} />
    </div>
  );
}
