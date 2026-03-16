import { useState } from "react";
import { validateIdentityForm } from "../utils/validation";

export default function IdentityVerificationModal({ product, onClose, onSuccess, showToast }) {
  const [formData, setFormData] = useState({ fullName: "", idNumber: "", idPhoto: null });

  if (!product) return null;

  const submit = () => {
    const validation = validateIdentityForm(formData);
    if (!validation.isValid) return showToast("Error", Object.values(validation.errors).join(" "), "danger");
    onSuccess(product);
    onClose();
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document"><div className="modal-content">
        <div className="modal-header"><h5 className="modal-title">Identity Verification Required</h5><button className="btn-close" onClick={onClose} /></div>
        <div className="modal-body">
          <input className="form-control mb-3" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Government ID Number" value={formData.idNumber} onChange={(e) => setFormData((p) => ({ ...p, idNumber: e.target.value }))} />
          <input className="form-control" type="file" accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, idPhoto: e.target.files?.[0] || null }))} />
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={submit}>Submit Verification</button></div>
      </div></div>
      <div className="modal-backdrop show" onClick={onClose} />
    </div>
  );
}
